# Prompt para Agente IA — Diseño y Desarrollo del Frontend Angular (Energías Renovables)

---

## Contexto del Proyecto

Estoy desarrollando una aplicación web de **análisis de datos de energías renovables**. Ya tengo un backend funcional en **Java + Spring Boot 3** con autenticación **JWT** que sirve una API REST sobre una base de datos **PostgreSQL**. Necesito que diseñes e implementes el **frontend en Angular** (última versión estable, standalone components), conectándote al backend existente.

---

## 1. Arquitectura del Backend (ya implementado)

| Capa | Tecnología |
|------|-----------|
| Framework | Java 17 + Spring Boot 3.5 |
| Base de datos | PostgreSQL 12+ (esquema `energy`) |
| Autenticación | JWT (JJWT 0.11.5) — stateless, BCrypt |
| Puerto | `http://localhost:8080` |

### Modelo de datos (3 tablas)

```
energy.dim_entities        → id, name, code (países/regiones; code IS NULL = regiones)
energy.dim_energy_type     → id, name, unit, category, description (19 tipos de energía)
energy.fact_energy_data    → id, entity_id, energy_type_id, year, value
```

### 19 tipos de energía disponibles

| # | Nombre | Unidad | Categoría |
|---|--------|--------|-----------|
| 1 | Renewable Share Energy | % | General |
| 2 | Geo Biomass Consumption | TWh | Consumption |
| 3 | Wind Consumption | TWh | Consumption |
| 4 | Share Electricity Renewables | % | Electricity |
| 5 | Hydropower Consumption | TWh | Consumption |
| 6 | Hydro Share Energy | % | Hydro |
| 7 | Share Electricity Hydro | % | Hydro |
| 8 | Wind Production | TWh | Production |
| 9 | Cumulative Wind Capacity | GW | Wind |
| 10 | Wind Share Energy | % | Wind |
| 11 | Share Electricity Wind | % | Wind |
| 12 | Solar Energy Consumption | TWh | Consumption |
| 13 | Installed Solar PV Capacity | GW | Solar |
| 14 | Solar Share Energy | % | Solar |
| 15 | Share Electricity Solar | % | Solar |
| 16 | Biofuel Production | TWh | Production |
| 17 | Installed Geothermal Capacity | GW | Geothermal |
| 18 | Hydro Production | TWh | Production |
| 19 | Solar Production | TWh | Production |

---

## 2. Endpoints de la API REST

### 2.1 Autenticación (`/api/auth`)

**Rutas públicas** (no requieren token):

#### `POST /api/auth/register`
```json
// Request body
{
  "username": "string",   // @NotBlank, 3-50 caracteres
  "email": "string",      // @NotBlank, @Email válido
  "password": "string"    // @NotBlank, mínimo 8 caracteres
}
// Response 200
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
// Response 400
"El usuario ya existe" | "El email ya existe" | errores de validación
```

#### `POST /api/auth/login`
```json
// Request body
{
  "username": "string",
  "password": "string"
}
// Response 200
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
// Response 401
"Credenciales inválidas"
```

> **Nota:** El token JWT dura **24 horas** (`86400000 ms`). Se envía en el header `Authorization: Bearer <token>` para acceder a rutas protegidas.

---

### 2.2 Consultas de Energía (`/api/energy`) — Requieren token JWT

#### `GET /api/energy/total` — Producción total por tipo y año (agrupado por regiones)
| Parámetro | Tipo | Requerido | Default | Ejemplo |
|-----------|------|-----------|---------|---------|
| `energyType` | String | ✅ | — | `Wind Production` |
| `year` | Integer | ✅ | — | `2018` |
| `limit` | Integer | ❌ | `10` | `5` |

```json
// Response: Array de TotalProductionEnergyDTO
[
  {
    "region": "Asia Pacific",
    "energyType": "Wind Production",
    "year": 2018,
    "unit": "TWh",
    "total": 450.123456
  }
]
```

#### `GET /api/energy/percent` — % de energía renovable en consumo eléctrico por región
| Parámetro | Tipo | Requerido | Default | Ejemplo |
|-----------|------|-----------|---------|---------|
| `year` | Integer | ✅ | — | `2018` |
| `limit` | Integer | ❌ | `10` | `5` |

```json
// Response: Array de PercentElectricalTotalDTO
[
  {
    "region": "South America",
    "year": 2018,
    "unit": "%",
    "percentageRenewableEnergy": 68.543210
  }
]
```

#### `GET /api/energy/trend` — Tendencia temporal de un tipo de energía para una entidad
| Parámetro | Tipo | Requerido | Default | Ejemplo |
|-----------|------|-----------|---------|---------|
| `energyType` | String | ✅ | — | `Installed Solar PV Capacity` |
| `entityName` | String | ❌ | `World` | `China` |
| `limit` | Integer | ❌ | `10` | `20` |

```json
// Response: Array de TrendEnergyDTO
[
  {
    "year": 2010,
    "unit": "GW",
    "totalSolarCapacity": 40.123456,
    "country": "China"
  }
]
```

#### `GET /api/energy/top` — Top países por tipo de energía en un año
| Parámetro | Tipo | Requerido | Default | Ejemplo |
|-----------|------|-----------|---------|---------|
| `year` | Integer | ✅ | — | `2019` |
| `energyType` | String | ❌ | `Wind Generation` | `Hydro Production` |
| `limit` | Integer | ❌ | `10` | `10` |

```json
// Response: Array de TopEnergyYearDTO
[
  {
    "country": "China",
    "code": "CHN",
    "energy": 1302.578000,
    "unit": "TWh",
    "energyType": "Hydro Production"
  }
]
```

#### `GET /api/energy/participation` — Participación global de fuentes energéticas en electricidad
| Parámetro | Tipo | Requerido | Default | Ejemplo |
|-----------|------|-----------|---------|---------|
| `entityName` | String | ❌ | `World` | `World` |
| `year` | Integer | ✅ | — | `2019` |
| `limit` | Integer | ❌ | `10` | `5` |

> **Nota:** Este endpoint filtra automáticamente por estos 4 tipos de energía: `Share Electricity Renewables`, `Share Electricity Hydro`, `Share Electricity Wind`, `Share Electricity Solar`.

```json
// Response: Array de ParticipationElectricalConsumptionDTO
[
  {
    "year": 2019,
    "energySource": "Share Electricity Renewables",
    "entity": "World",
    "sharePercent": 26.234567,
    "unit": "%"
  }
]
```

---

## 3. Configuración de Seguridad del Backend

```
Rutas públicas:      /api/auth/login, /api/auth/register
Todas las demás:     Requieren header "Authorization: Bearer <JWT_TOKEN>"
Política de sesión:  STATELESS (sin cookies de sesión)
CSRF:                Deshabilitado
CORS:                ⚠️ NO está configurado actualmente (necesitarás que el backend lo habilite o usar proxy en Angular)
```

---

## 4. Requisitos del Frontend Angular

### 4.1 Estructura general
- **Angular 19+** con **standalone components** y **signals**
- Enrutamiento con lazy loading
- **Interceptor HTTP** para inyectar automáticamente el token JWT en todas las peticiones
- **AuthGuard** que proteja las rutas de dashboard y redirija al login si no hay token válido
- Servicio centralizado `AuthService` para login/register/logout con almacenamiento del token en `localStorage`
- Servicio `EnergyService` que consuma los 5 endpoints del backend
- Manejo global de errores HTTP (401 → redirigir a login, mostrar notificaciones de error)

### 4.2 Páginas requeridas

#### 🔐 Login / Registro
- Formulario de **login** (username, password) con validación reactiva
- Formulario de **registro** (username, email, password) con validación que refleje las restricciones del backend:
  - Username: obligatorio, 3–50 caracteres
  - Email: obligatorio, formato email válido
  - Password: obligatorio, mínimo 8 caracteres
- Mostrar **errores del backend** inline (usuario existe, email existe, credenciales inválidas)
- Al autenticarse exitosamente, almacenar el token y redirigir al dashboard

#### 📊 Dashboard Principal
- Resumen visual con **tarjetas KPI** (indicadores clave)
- Gráficos resumen usando los endpoints disponibles
- Navegación lateral o superior a las 5 secciones de consultas

#### 📈 Página de cada Consulta (5 páginas o secciones)
Cada sección debe incluir:
1. **Formulario de filtros** con los parámetros del endpoint correspondiente (selects, inputs numéricos, etc.)
2. **Tabla de resultados** con los datos retornados (paginada/sorteable si aplica)
3. **Gráfico interactivo** que represente los mismos datos visualmente

| Consulta | Gráfico recomendado |
|----------|-------------------|
| 1. Producción total por tipo y año | Gráfico de barras horizontales (regiones vs. total) |
| 2. % renovable en consumo eléctrico | Gráfico de barras o mapa de calor (regiones vs. %) |
| 3. Tendencia temporal | Gráfico de líneas (años vs. valor) |
| 4. Top países | Gráfico de barras verticales (países vs. producción) |
| 5. Participación global | Gráfico de torta/donut (fuentes vs. %) |

### 4.3 Gráficos interactivos
- Usar una librería de gráficos como **ngx-charts**, **Chart.js (ng2-charts)** o **ApexCharts (ng-apexcharts)**
- Los gráficos deben ser **interactivos**: tooltips al hover, click para detallar, animaciones de entrada
- Deben actualizarse **dinámicamente** al cambiar los filtros del formulario
- Responsive: adaptarse a mobile, tablet y desktop

### 4.4 Funcionalidades obligatorias
- ✅ **Búsqueda en tiempo real** (debounce en campos de texto para filtrar resultados)
- ✅ **Validación de formularios** reactivos con mensajes de error claros
- ✅ **Actualización dinámica de contenido** (al cambiar filtros se re-consulta el backend y se actualizan tabla + gráfico sin recargar página)
- ✅ **Diseño responsivo** (Mobile-first con CSS Grid/Flexbox o Angular Material/PrimeFaces)
- ✅ **Loading states** (spinners/skeletons mientras se cargan datos)
- ✅ **Manejo de estados vacíos** (cuando no hay resultados para los filtros seleccionados)

### 4.5 UX/UI
- Diseño moderno, limpio y profesional
- Paleta de colores temática de energías renovables (verdes, azules, blancos)
- Sidebar o navbar para navegación entre las consultas
- **Dark mode** opcional sería un plus
- Transiciones suaves entre páginas y al cargar datos
- Iconografía coherente (Material Icons o similar)

---

## 5. Consideraciones técnicas

### 5.1 CORS
El backend actualmente **NO tiene CORS configurado**. Opciones:
- **Opción A (recomendada para desarrollo):** Configurar un **proxy** en Angular (`proxy.conf.json`) que redirija `/api/*` a `http://localhost:8080`
- **Opción B:** Agregar `@CrossOrigin` o una configuración global de CORS en el backend

### 5.2 Estructura de carpetas sugerida
```
src/app/
├── core/                     # Servicios globales, interceptors, guards
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── energy.service.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── models/               # Interfaces TypeScript para los DTOs
│       ├── auth.models.ts
│       └── energy.models.ts
├── features/
│   ├── auth/                 # Login + Register
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/            # Dashboard principal
│   ├── total-production/     # Consulta 1
│   ├── percent-electrical/   # Consulta 2
│   ├── trend/                # Consulta 3
│   ├── top-countries/        # Consulta 4
│   └── participation/        # Consulta 5
├── shared/                   # Componentes reutilizables
│   ├── components/
│   │   ├── data-table/
│   │   ├── chart-wrapper/
│   │   ├── filter-form/
│   │   └── loading-spinner/
│   └── pipes/
└── layout/                   # Sidebar, header, footer
    ├── sidebar/
    └── header/
```

### 5.3 Interfaces TypeScript (modelos de los DTOs)
```typescript
// Auth
interface LoginRequest { username: string; password: string; }
interface RegisterRequest { username: string; email: string; password: string; }
interface AuthResponse { token: string; }

// Energy DTOs
interface TotalProductionEnergy {
  region: string; energyType: string; year: number; unit: string; total: number;
}
interface PercentElectricalTotal {
  region: string; year: number; unit: string; percentageRenewableEnergy: number;
}
interface TrendEnergy {
  year: number; unit: string; totalSolarCapacity: number; country: string;
}
interface TopEnergyYear {
  country: string; code: string; energy: number; unit: string; energyType: string;
}
interface ParticipationElectricalConsumption {
  year: number; energySource: string; entity: string; sharePercent: number; unit: string;
}
```

### 5.4 Proxy de desarrollo
```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```
Ejecutar con: `ng serve --proxy-config proxy.conf.json`

---

## 6. Resumen de entregables esperados

1. Proyecto Angular funcional que se conecte al backend Spring Boot existente
2. Autenticación completa (login, register, logout, guard, interceptor JWT)
3. Dashboard con KPIs y gráficos resumen
4. 5 páginas de consultas con formularios de filtros + tabla + gráfico interactivo cada una
5. Diseño responsivo, moderno y profesional
6. Búsqueda en tiempo real, validación de formularios y actualización dinámica de contenido
7. Manejo de errores, estados de carga y estados vacíos
