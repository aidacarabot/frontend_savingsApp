# 💰 Savings App — Gestión Financiera Personal

Aplicación web avanzada para la gestión integral de finanzas personales. Controla ingresos y gastos, crea y administra metas de ahorro con cálculos automáticos, visualiza tu situación financiera con gráficos interactivos y personaliza tu experiencia con potentes herramientas de análisis y edición de perfil.

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
| XLSX             | 0.18.5  | Importación masiva desde Excel      |

**Backend:** Node.js + Express (API REST en `http://localhost:3000/api/v1`)
**Autenticación:** JWT almacenado en `localStorage` y enviado en cada petición autenticada.

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

> **Importante:** Asegúrate de tener el backend en ejecución antes de usar la app. El frontend se conecta a la API REST en `http://localhost:3000/api/v1`.

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

> **Protección de rutas:** Las rutas `/overview`, `/transactions`, `/goals` y `/user` requieren autenticación. Si el usuario no ha iniciado sesión, se redirige automáticamente a `/login`.

---

## 📄 Páginas y funcionalidades

### 🔐 Login (`/login`)

- Inicio de sesión con email y contraseña.
- Toggle para mostrar/ocultar contraseña.
- Validación en tiempo real y mensajes de error claros.
- Redirección automática a `/overview` tras login exitoso.
- Acceso directo a registro para nuevos usuarios.

---

### 📝 Registro (`/register`)

- Formulario con nombre completo, fecha de nacimiento, email y contraseña (con confirmación).
- Validación de formato y coincidencia de contraseñas.
- Toggle para mostrar/ocultar contraseñas.
- Redirección automática a login tras registro exitoso.

---

### 📊 Overview (`/overview`)

Panel principal con visión global de tu situación financiera.

- **Selector de periodo:** Filtra todos los datos por mes, año o histórico.
- **Tarjetas de resumen:** Muestra saldo actual, ahorros, ingresos y gastos del periodo, con comparación porcentual respecto al periodo anterior.
- **SavingsChart:** Gráfico de línea/área con evolución del balance, comparando periodos.
- **ExpensesChart:** Gráfico de dona con desglose de gastos por categoría, leyenda interactiva y tooltips detallados.
- **GoalsOverview:** Vista rápida de metas activas/completadas y barra de distribución de fondos.

---

### 💳 Transactions (`/transactions`)

Gestión avanzada de ingresos y gastos.

- **Selector de vista:** Cambia entre todos los movimientos, solo gastos o solo ingresos.
- **Filtros avanzados:** Filtra por rango de fechas, importe mínimo/máximo y categoría. Todos los filtros son combinables y se aplican en tiempo real.
- **Importación masiva:** Sube archivos Excel para cargar múltiples transacciones de una vez (BulkImport).
- **Lazy loading:** Las transacciones se cargan en bloques de 20 al hacer scroll.
- **Lista de transacciones:** Cada ítem muestra icono, color, nombre, importe (+/-), fecha y tipo. Menú contextual para editar/eliminar (con confirmación).
- **Formulario de transacción:** Añade o edita ingresos/gastos con validación, formato automático de moneda y campos pre-rellenados en edición.
- **Categorías de gasto:**
  | Categoría | Color |
  | ------------------- | -------------- |
  | 🏠 Home | Azul claro |
  | 🛒 Groceries | Verde claro |
  | 🍺 Dining & Drinks | Naranja claro |
  | 🚗 Transport | Azul |
  | 🛍️ Lifestyle | Violeta claro |
  | 🎭 Entertainment | Rosa claro |
  | 💪 Health & Fitness | Verde agua |
  | ✈️ Travel | Amarillo claro |
  | 🏦 Debt | Rojo claro |
  | 🪙 Other | Gris |

---

### 🎯 Goals (`/goals`)

Crea y gestiona metas de ahorro con cálculos automáticos y visualización avanzada.

- **Distribución de fondos:** Barra visual y contadores de metas activas/completadas. Muestra fondos asignados vs. disponibles.
- **Lista de metas:** Metas activas primero, completadas después. Cada meta muestra nombre, progreso circular, importe actual/objetivo, contribución mensual estimada, fecha estimada de finalización y edad al completar (calculada automáticamente).
- **Acciones sobre metas:**
  - Agregar fondos (desde balance disponible)
  - Remover fondos (de la meta al balance)
  - Editar (abre formulario con datos actuales)
  - Eliminar (requiere confirmación)
  - **Confetti** al completar una meta al 100%
- **Formulario inteligente:**
  - Tres parámetros: Importe objetivo, Fecha de finalización, Contribución mensual
  - Rellena 2 y el sistema calcula el 3º automáticamente
  - Muestra edad estimada al completar la meta
  - Resumen en tiempo real antes de guardar

---

### 👤 User (`/user`)

Gestión completa de perfil y presupuesto mensual.

- **Información del perfil:**
  - Foto de perfil editable (con preview y subida al servidor)
  - Nombre de usuario
  - Badge con edad actual (calculada automáticamente)
- **Presupuesto mensual editable:**
  - Ingresos mensuales
  - Gastos esperados por cada categoría
  - Indicadores en tiempo real: suma de gastos, potencial de ahorro, ratio de gastos (con barra visual)
- **Edición segura:** Cambios requieren confirmación y muestran mensajes de éxito/error.

---

## 🔒 Seguridad y autenticación

- **Autenticación JWT:** El token se almacena en `localStorage` tras login y se envía en cada petición autenticada.
- **Rutas protegidas:** Acceso restringido a `/overview`, `/transactions`, `/goals` y `/user` mediante `PrivateRoute`.
- **Logout seguro:** Elimina token y user ID de `localStorage`.
- **Confirmación de acciones destructivas:** Cualquier eliminación requiere confirmación explícita.

---

## 💡 Características destacadas

- **Cálculos bidireccionales en metas:** Rellenar 2 de 3 parámetros calcula el tercero automáticamente.
- **Comparativa de periodos:** Cada métrica muestra variación porcentual respecto al periodo anterior.
- **Filtros combinables:** Transacciones filtrables por fecha, importe y categoría, en tiempo real.
- **Importación masiva:** Sube archivos Excel para cargar múltiples transacciones de una vez.
- **Lazy loading:** Transacciones cargadas en bloques de 20 al hacer scroll.
- **Formato automático de moneda:** Importe con formato `1,000.50` en todos los campos.
- **Confirmación antes de eliminar:** Todas las acciones destructivas requieren confirmación.
- **Mensajes toast:** Notificaciones de éxito/error con cierre automático a los 3 segundos.
- **Confetti:** Efecto visual al completar una meta de ahorro al 100%.
- **Edad estimada al completar metas:** Calculada automáticamente desde la fecha de nacimiento.
- **Presupuesto por categoría:** Define y compara gastos esperados vs. reales.
- **Edición de foto de perfil:** Cambia tu imagen con preview y subida instantánea.

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
├── components/          # Componentes reutilizables por funcionalidad (AreYouSure, BulkImport, Button, CurrentData, DropDown, ExpensesChart, GoalBox, GoalForm, GoalsDistribution, GoalsOverview, IncomeExpenseForm, Loader, LoginForm, LoginTransition, Logo, Messages, Navbar, PersonalInfoForm, ProfilePicture, ProfilePictureEdit, ProgressBarFile, RegisterForm, SavingsChart, Title, TransactionBox, TransactionsFilter, ViewBy)
├── hooks/               # Custom hooks para lógica de negocio, cálculos, API y formularios
├── context/             # FinancialContext — periodo seleccionado y datos compartidos globales
├── routes/              # Configuración de rutas y PrivateRoute
└── utils/               # Constantes, utilidades de cálculo y helpers de API
```

---

### 🆕 Funcionalidades y mejoras recientes

- **Importación masiva de transacciones desde Excel (BulkImport):** Permite cargar múltiples movimientos de una sola vez.
- **Edición avanzada de foto de perfil:** Preview instantáneo y subida segura.
- **Indicadores en tiempo real en edición de perfil:** Gastos totales, potencial de ahorro y ratio de gastos.
- **Animación de confetti al completar metas:** Celebración visual automática.
- **Comparativa de periodos en todas las métricas clave.**
- **Cálculos automáticos y bidireccionales en metas de ahorro.**
- **Validación y feedback mejorados en todos los formularios.**
- **Lazy loading optimizado para grandes volúmenes de transacciones.**
- **Filtros combinables y reseteo automático al cambiar de vista.**
- **Mensajes toast y confirmaciones para todas las acciones importantes.**

---

## 📝 Funcionamiento general del proyecto

1. **Autenticación:**

- El usuario se registra e inicia sesión. El token JWT se almacena en `localStorage` y se usa en cada petición autenticada.
- Las rutas protegidas redirigen automáticamente a `/login` si no hay sesión activa.

2. **Panel principal (Overview):**

- Muestra resumen financiero, gráficos de evolución y desglose de gastos, y vista rápida de metas.
- Permite filtrar todos los datos por periodo (mes, año, histórico).

3. **Transacciones:**

- Visualiza, filtra y gestiona ingresos y gastos.
- Permite importar movimientos en bloque desde Excel.
- Edición y eliminación con confirmación y feedback visual.

4. **Metas de ahorro:**

- Crea, edita y elimina metas con cálculos automáticos.
- Asigna y retira fondos entre balance y metas.
- Visualiza progreso, fechas estimadas y edad al completar.
- Animación de confetti al lograr una meta.

5. **Perfil de usuario:**

- Edita datos personales, foto de perfil y presupuesto mensual.
- Visualiza indicadores clave en tiempo real.

6. **Seguridad y experiencia de usuario:**

- Todas las acciones importantes requieren confirmación.
- Notificaciones automáticas y feedback inmediato.
- Interfaz moderna, responsiva y accesible.

---
