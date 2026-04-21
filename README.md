# 💰 Savings App — Gestión Financiera Personal

Aplicación web para gestionar tus finanzas personales: controla tus ingresos y gastos, crea metas de ahorro con cálculos inteligentes y visualiza tu situación financiera con gráficos interactivos.

---

## 🚀 Tecnologías utilizadas

| Tecnología       | Versión | Uso                                 |
| ---------------- | ------- | ----------------------------------- |
| React            | 19.1.0  | Framework principal de UI           |
| Vite             | 7.0.0   | Bundler y servidor de desarrollo    |
| React Router DOM | 7.6.3   | Enrutamiento y rutas protegidas     |
| React Hook Form  | 7.62.0  | Gestión y validación de formularios |
| Recharts         | 3.5.1   | Gráficos interactivos               |
| Lucide React     | 0.563.0 | Iconos                              |
| React Icons      | 5.5.0   | Iconos adicionales                  |
| Canvas Confetti  | 1.9.4   | Efectos de celebración              |

**Backend:** Node.js + Express (API REST en `http://localhost:3000/api/v1`)  
**Autenticación:** JWT almacenado en `localStorage`

---

## ⚙️ Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

> Asegúrate de tener el backend en ejecución antes de usar la app.

---

## 🗺️ Estructura de rutas

| Ruta            | Descripción                            |
| --------------- | -------------------------------------- |
| `/login`        | Inicio de sesión                       |
| `/register`     | Registro de nuevo usuario              |
| `/overview`     | Panel principal con resumen financiero |
| `/transactions` | Historial y gestión de transacciones   |
| `/goals`        | Metas de ahorro                        |
| `/user`         | Perfil y configuración personal        |

Las rutas `/overview`, `/transactions`, `/goals` y `/user` están protegidas. Si el usuario no ha iniciado sesión, se redirige automáticamente a `/login`.

---

## 📄 Páginas y funcionalidades

### 🔐 Login (`/login`)

- Inicio de sesión con email y contraseña.
- Toggle para mostrar u ocultar la contraseña.
- Validación de campos en tiempo real.
- Mensajes de error específicos.
- Redirige al panel principal (`/overview`) tras un login exitoso.
- Enlace a la página de registro para nuevos usuarios.

---

### 📝 Registro (`/register`)

- Formulario de registro con los siguientes campos:
  - Nombre completo
  - Fecha de nacimiento
  - Email (con validación de formato)
  - Contraseña y confirmación de contraseña
- Toggle para mostrar u ocultar contraseñas.
- Validación de coincidencia entre contraseñas.
- Redirige al login tras un registro exitoso.

---

### 📊 Overview (`/overview`)

Panel principal con una visión global de tu situación financiera.

#### Selector de periodo

Filtra todos los datos mostrados en la página según el periodo seleccionado:

- **Month** — datos del mes actual
- **Year** — datos del año actual
- **All-Time** — todos los datos históricos

#### Tarjetas de resumen (`CurrentData`)

Cuatro tarjetas con los datos clave del periodo seleccionado:

- **Current Balance** — saldo total actual
- **Savings** — monto ahorrado en el periodo
- **Income** — ingresos totales
- **Expenses** — gastos totales

Cada tarjeta muestra el porcentaje de variación respecto al periodo anterior (▲ subida / ▼ bajada) y el valor del periodo anterior.

#### Gráfico de ahorros (`SavingsChart`)

- Gráfico de línea/área con la evolución del balance a lo largo del tiempo.
- Muestra datos del periodo actual y del periodo anterior (cuando aplica).
- Tooltip personalizado con formato de moneda.

#### Gráfico de gastos por categoría (`ExpensesChart`)

- Gráfico de dona con el desglose de gastos por categoría.
- Muestra el total de gastos en el centro.
- Tooltip con nombre de categoría, monto y porcentaje del total.
- Leyenda interactiva con colores por categoría.

#### Vista previa de metas (`GoalsOverview`)

- Número de metas activas y completadas.
- Barra visual de distribución: fondos asignados a metas vs. fondos disponibles.
- Botón "View all" que navega a `/goals`.

---

### 💳 Transactions (`/transactions`)

Gestiona todos tus ingresos y gastos.

#### Selector de vista

- **ALL** — muestra todos los movimientos
- **EXPENSES** — solo gastos
- **INCOME** — solo ingresos

#### Filtros avanzados

Al pulsar el botón **Filter** se despliega un panel con:

- Rango de fechas (desde / hasta)
- Rango de importes (mínimo / máximo)
- Filtro por categoría (desplegable)

Todos los filtros son combinables y se aplican en tiempo real. Se resetean al cambiar el tipo de vista.

#### Lista de transacciones

- **Lazy loading:** se cargan 20 transacciones inicialmente; al hacer scroll al final se cargan más automáticamente.
- Cada transacción muestra:
  - Icono y color de categoría
  - Nombre de la transacción
  - Importe con signo (+ ingresos / − gastos)
  - Fecha
  - Tipo (Income / Expense)
- Menú desplegable por transacción con las opciones **Editar** y **Eliminar**.
  - **Eliminar** solicita confirmación antes de ejecutarse.

#### Formulario de transacción

Al pulsar **+ Add** o **Editar** se abre el formulario:

- Tipo: Income o Expense
- Título de la transacción
- Fecha
- Categoría (solo para gastos)
- Importe (con formato automático de miles: `1,000.50`)
- Validación en todos los campos
- En modo edición, los campos se pre-rellenan con los datos existentes

#### Categorías de gasto disponibles

| Categoría           | Color          |
| ------------------- | -------------- |
| 🏠 Home             | Azul claro     |
| 🛒 Groceries        | Verde claro    |
| 🍺 Dining & Drinks  | Naranja claro  |
| 🚗 Transport        | Azul           |
| 🛍️ Lifestyle        | Violeta claro  |
| 🎭 Entertainment    | Rosa claro     |
| 💪 Health & Fitness | Verde agua     |
| ✈️ Travel           | Amarillo claro |
| 🏦 Debt             | Rojo claro     |
| 🪙 Other            | Gris           |

---

### 🎯 Goals (`/goals`)

Crea y gestiona tus metas de ahorro.

#### Distribución de fondos (`GoalsDistribution`)

- Muestra el total de fondos asignados a metas activas vs. el balance total.
- Barra de progreso visual.
- Contadores de metas activas y completadas.
- Importe disponible para asignar a nuevas metas.

#### Lista de metas

- Las metas activas aparecen primero; las completadas se listan debajo.
- Cada tarjeta de meta muestra:
  - Nombre de la meta
  - Progreso circular con porcentaje
  - Importe actual / Importe objetivo
  - Contribución mensual estimada
  - Fecha de finalización estimada
  - Edad que tendrás al completarla (calculada a partir de tu fecha de nacimiento)

#### Acciones sobre cada meta

- **Agregar fondos** — transfiere importe desde tu balance disponible a la meta. Solo se muestra si hay fondos disponibles.
- **Remover fondos** — retira importe de la meta de vuelta al balance disponible. Solo se muestra si la meta tiene fondos asignados.
- **Editar** — abre el formulario de meta con los datos actuales.
- **Eliminar** — solicita confirmación antes de borrar la meta.

Cuando una meta se completa al 100%, se lanza una animación de confetti como celebración.

#### Formulario de metas (cálculos inteligentes)

El formulario tiene tres parámetros relacionados entre sí:

| Campo                 | Descripción                    |
| --------------------- | ------------------------------ |
| Importe objetivo      | Cuánto quieres ahorrar         |
| Fecha de finalización | Cuándo quieres lograrlo        |
| Contribución mensual  | Cuánto puedes ahorrar cada mes |

**Si rellenas dos de los tres campos, el sistema calcula el tercero automáticamente:**

- Objetivo + Fecha → calcula la contribución mensual necesaria
- Objetivo + Contribución mensual → calcula la fecha estimada de finalización
- Objetivo + Fecha de finalización → verifica la viabilidad con la contribución

Además se muestra la **edad que tendrás al completar la meta**, calculada automáticamente desde tu fecha de nacimiento.

Un resumen debajo del formulario refleja los cálculos en tiempo real antes de guardar.

---

### 👤 User (`/user`)

Gestiona tu perfil y configura tu presupuesto mensual.

#### Información del perfil

- Foto de perfil (con opción de cambiarla mediante upload de imagen).
- Nombre de usuario.
- Badge con tu edad actual (calculada a partir de tu fecha de nacimiento).

#### Foto de perfil

- Al pulsar el icono de cámara sobre la foto, se abre el selector de archivo.
- Muestra un preview de la imagen antes de confirmar.
- La imagen se sube al servidor al guardar.

#### Información financiera editable

- **Ingresos mensuales** — tu salario o ingresos mensuales esperados.
- **Gastos esperados por categoría** — un importe para cada una de las 10 categorías de gasto.

Mientras editas se muestran tres indicadores calculados en tiempo real:

- **Gastos totales esperados** — suma de todos los campos de gasto.
- **Potencial de ahorro mensual** — Ingresos − Gastos totales.
- **Ratio de gastos** — porcentaje del ingreso destinado a gastos, con barra visual proporcional.

Estos datos sirven como referencia para controlar tu presupuesto y configurar metas de ahorro realistas.

---

## 🔒 Seguridad y autenticación

- El token JWT se almacena en `localStorage` tras el login.
- Todas las peticiones autenticadas incluyen el token en la cabecera `Authorization`.
- Las rutas privadas (PrivateRoute) redirigen a `/login` si no hay sesión activa.
- El logout elimina el token y el user ID del `localStorage` completamente.

---

## 💡 Características destacadas

- **Cálculos bidireccionales en metas** — rellenar 2 de 3 parámetros calcula el tercero automáticamente.
- **Comparativa de periodos** — cada métrica muestra la variación porcentual respecto al periodo anterior.
- **Filtros combinables** — las transacciones se pueden filtrar simultáneamente por fecha, importe y categoría.
- **Lazy loading** — las transacciones se cargan en bloques de 20 al hacer scroll.
- **Formato automático de moneda** — los campos de importe aplican formato `1,000.50` automáticamente.
- **Confirmación antes de eliminar** — cualquier acción destructiva requiere confirmación explícita.
- **Mensajes toast** — notificaciones de éxito y error con cierre automático a los 3 segundos.
- **Confetti** — efecto visual al completar una meta de ahorro al 100%.
- **Edad estimada al completar metas** — integra la fecha de nacimiento del usuario con los cálculos de metas.
- **Presupuesto por categoría** — define gastos esperados para comparar con los reales.

---

## 📡 API — Endpoints utilizados

```
POST   /users/register              Registro de usuario
POST   /users/login                 Inicio de sesión
GET    /users                       Datos del usuario autenticado
PUT    /users/:id                   Actualizar perfil (salario, gastos esperados, foto)

GET    /transactions                Listar transacciones
POST   /transactions                Crear transacción
PUT    /transactions/:id            Actualizar transacción
DELETE /transactions/:id            Eliminar transacción

GET    /goals                       Listar metas
POST   /goals                       Crear meta
PUT    /goals/:id                   Actualizar meta (fondos, datos, fecha)
DELETE /goals/:id                   Eliminar meta
```

---

## 📁 Estructura del proyecto

```
src/
├── pages/               # Páginas principales (Overview, Transactions, Goals, User)
├── components/          # Componentes reutilizables por funcionalidad
├── hooks/               # Custom hooks (lógica de negocio y acceso a API)
├── context/             # FinancialContext — periodo seleccionado y datos compartidos
├── routes/              # Configuración de rutas y PrivateRoute
└── utils/               # Constantes, utilidades de cálculo y helpers de API
```
