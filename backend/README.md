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