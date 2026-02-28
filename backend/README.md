# Paso a paso de creación del proyecto energía renovables

**Tecnologías**
- backend: Java + Spring boot
- database: Postgres

**Extensiones en VScode**
1. Extension pack for java (microsoft)
2. Spring Boot Extension (vmware)
3. Maven for java (microsoft)

## Paso 1 - Definir
- Tipo de aplicación: CRUD con autenticación
- Arquitectura: Frontend y Backend desacoplados (API REST)
- Comunicación: JSON sobre HTTP
- Autenticación: JWT (JSON Web Token)

## Paso 2 - Crear proyecto con Maven
1. ctrl + shift + p: spring inizialitr
2. maven project
3. spring boot version para este caso (3.5.11)
4. lenguaje (java)
5. dominio (com.nombreEmpresa)
6. nombre-proyecto
7. nombre del paquete (por defecto)
8. jar
9. version java este caso 17
**Dependencies:**
1. Spring Web
2. Spring Data JPA
4. PostgreSQL Driver

**Configuración básica**
En api/src/main/resources crear archivo application.yml y pegar este código:
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/energy_db <-- el nombre de tu db
    username: postgres <-- tu usuario
    password: tu_password <-- tu contraseña
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

server:
  port: 8080
  error: <-- para mostrar los mensajes de error
    include-message: always

## Paso 3 - Creamos DTO, repository, service y controller para los queries solicitados
*1. Solicitud: Producción total de energía renovable por tipo de fuente en un año específico, agrupadas por región*
- Creamos el dto/TotalProductionEnergyDTO
- En FactEnergyDataRepository agregamos la petición con JPQL
- Creamos el service/EnergyDataService y ahí su método
- Creamos controller/EnergyDataController y ahí su método
*(Esto mismo para los demás queries)*
**probar en postman GET**
- http://localhost:8080/api/energy/total?year=2018&energyType=Wind Production&limit=5

*2. Solicitud: Porcentaje de energía renovable en el consumo eléctrico total de cada región*
**probar en postman GET**
- http://localhost:8080/api/energy/percent?year=2018&limit=5

*3. Solicitud: Tendencia de la capacidad instalada de energía solar a lo largo de los años*
**probar en postman GET**
- http://localhost:8080/api/energy/trend?energyType=Installed Solar PV Capacity&entityName=China&limit=5

*4. Solicitud: Los 10 países con mayor producción de energía eólica en un año específico*
**probar en postman GET**
- http://localhost:8080/api/energy/top?year=2019&energyType=Hydro Production&limit=10

*5. Solicitud: Participación de todas las fuentes de energía en el consumo eléctrico total a nivel global*
**probar en postman GET**
- http://localhost:8080/api/energy/participation?year=2019&entityName=World&limit=5

## Paso 4 - Crear modelo User y controlador de autenticación con contraseña encriptada
1. Creamos el model/User con lombok (opcional)
2. Creamos el repository/UserRepository
3. Creamos el service/UserService
4. Creamos el controller/AuthController
5. configuramos el SecurityConfig

## Paso 5 - Implementación de autenticación con JWT (JSON Web Token)

### ¿Qué es JWT?
Un token firmado que el servidor entrega al hacer login. El cliente lo envía en cada request para demostrar su identidad, sin necesidad de sesiones en el servidor.

### 5.1 - Dependencias en `pom.xml`
Agregar las 3 dependencias de JJWT (mismo grupo, versiones coherentes):
```xml
<!-- API pública de JJWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<!-- Implementación interna (solo en runtime) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<!-- Soporte JSON con Jackson (solo en runtime) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```
> ⚠️ No usar `jjwt 0.9.1` (artifact ID diferente, API incompatible con 0.11.x)

### 5.2 - Configuración en `application.yml`
```yaml
jwt:
  secret: una_clave_de_al_menos_32_caracteres_aqui  # mínimo 32 chars para HS256
  expiration: 86400000  # duración del token en ms (86400000 = 24 horas)
```

### 5.3 - Archivos creados

**`dto/user/`** — Objetos de transferencia de datos:
- `RegisterRequest.java` — campos: `username`, `email`, `password`
- `LoginRequest.java` — campos: `username`, `password`
- `AuthResponse.java` — campo: `token` (la respuesta al login/registro)

**`security/JwtService.java`** — Lógica de tokens:
- `generateToken(username)` — crea el JWT firmado con HS256
- `extractUsername(token)` — lee el username del token
- `isTokenValid(token, username)` — verifica firma y expiración

**`security/JwtAuthenticationFilter.java`** — Filtro HTTP:
- Intercepta cada request y busca el header `Authorization: Bearer <token>`
- Si el token es válido, establece la autenticación en el `SecurityContext`

**`security/CustomUserDetailsService.java`** — Carga usuarios:
- Implementa `UserDetailsService` de Spring Security
- Busca el usuario en la BD por `username` para que Spring pueda validar credenciales

**`config/PasswordConfig.java`** — Bean del encoder:
- Define el `PasswordEncoder` (BCrypt) como bean inyectable en toda la app

### 5.4 - Cambios en `SecurityConfig.java`
```java
.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // sin sesiones
.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
```
- Política `STATELESS`: el servidor no guarda sesiones, cada request es independiente
- El filtro JWT se ejecuta antes que el filtro de usuario/contraseña estándar

### 5.5 - Probar en Postman

**Registrar usuario** — `POST http://localhost:8080/api/auth/register`
```json
{
  "username": "juan",
  "email": "juan@mail.com",
  "password": "12345"
}
```
Respuesta:
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

**Login** — `POST http://localhost:8080/api/auth/login`
```json
{
  "username": "juan",
  "password": "12345"
}
```
Respuesta:
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }

**Usar el token en requests protegidos:**
En Postman → pestaña **Authorization** → tipo **Bearer Token** → pegar el token recibido.
O manualmente en el header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

### Paso 6 - Agregar validación a los DTOs y controller
- Usar la depencia validation en pom.xml

### Paso 7 - Crear control de excepciones globales
- Crear exception/GlobalExceptionHandler.java para manejar las excepciones por validación