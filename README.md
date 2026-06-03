# ☀️ Bitácora de Verano

Aplicación web instalable (**PWA**) para el **registro observacional
socioemocional** de niñas y niños en un curso de verano. Pensada para **un solo
usuario** (la persona monitora), con enfoque **no patologizante** y **aviso de
confidencialidad** de datos de menores.

Construida con **Next.js 14 (App Router) + Supabase + Tailwind CSS**.

---

## ✨ Funcionalidades

- **Fichas de niñas y niños**: datos básicos, tutor/a, contacto, alergias y notas.
- **Observaciones** con cinco categorías: 🧩 conducta, 💗 emocional, 🤝 social,
  🩺 salud y bienestar, ⭐ fortalezas.
- **Semáforo 🚦** verde / amarillo / rojo en cada observación.
- **Check-in de ánimo** diario con escala de emojis (1–5).
- **Alertas**: manuales o generadas automáticamente desde observaciones rojas,
  con estados (abierta → en seguimiento → cerrada).
- **Seguimiento con tutores**: registro de contactos, medio y acuerdos.
- **Tablero resumen** con métricas, distribución del semáforo y actividad reciente.
- **Reportes** individual y general **exportables a PDF**, firmados por
  *Br. Edy Medina, Psicólogo en formación, 6º cuatrimestre, UVM* y con el aviso
  de confidencialidad.
- **PWA responsive**: instalable en el teléfono y con pantalla offline.
- **Privacidad por diseño**: autenticación y *Row Level Security* en Supabase
  (cada registro pertenece sólo a tu usuario).

---

## 🚀 Puesta en marcha

### 1. Requisitos
- Node.js 18.18+ (probado con Node 22).
- Una cuenta gratuita en [Supabase](https://supabase.com).

### 2. Crear el proyecto en Supabase
1. Crea un proyecto nuevo en Supabase.
2. Ve a **SQL Editor**, pega el contenido de [`supabase/schema.sql`](supabase/schema.sql)
   y pulsa **Run**. Esto crea las tablas, los tipos y las políticas de seguridad.

### 3. Variables de entorno
Copia el ejemplo y complétalo con tus credenciales (en **Project Settings → API**):

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_FIRMANTE_NOMBRE=Br. Edy Medina
NEXT_PUBLIC_FIRMANTE_TITULO=Psicólogo en formación, 6º cuatrimestre, UVM
```

### 4. Instalar y ejecutar
```bash
npm install
npm run dev
```
Abre <http://localhost:3000>. La primera vez, usa **«Crear cuenta»** para
registrar tu usuario monitor (correo + contraseña).

> Si en Supabase tienes activada la confirmación por correo, confirma el correo
> antes de iniciar sesión, o desactívala en **Authentication → Providers → Email**.

### 5. Construir para producción
```bash
npm run build
npm start
```

Se despliega sin cambios en **Vercel** (recuerda configurar las mismas variables
de entorno).

---

## 📲 Instalar como app (PWA)

En el navegador del teléfono abre la app y usa **«Agregar a pantalla de inicio»**.
Quedará como una app independiente, con icono y modo standalone. La pantalla
`/offline` se muestra cuando no hay conexión.

---

## 🗂️ Estructura

```
src/
  app/
    (panel)/            Páginas privadas (tablero, niños, alertas, etc.)
    login/              Acceso y alta de usuario
    auth/signout/       Cierre de sesión
    offline/            Pantalla sin conexión (PWA)
  components/           UI reutilizable y formularios
  lib/
    dominio.ts          Tipos, categorías, semáforo, utilidades
    acciones.ts         Server Actions (altas y cambios de estado)
    datos.ts            Consultas a Supabase
    pdf.ts              Generación de PDF firmados (jsPDF)
    supabase/           Clientes de Supabase + middleware de sesión
supabase/schema.sql     Esquema de base de datos + RLS
public/                 manifest.webmanifest, sw.js, iconos
```

---

## 🔒 Privacidad y enfoque

Esta herramienta es un **registro observacional de acompañamiento**, **no** un
instrumento de diagnóstico clínico. El lenguaje sugerido describe **conductas
observables y fortalezas**, evitando etiquetas. Los datos de menores son
sensibles: se almacenan bajo tu cuenta con *Row Level Security* y deben tratarse
conforme a la normativa de protección de datos personales y con el consentimiento
de madres, padres o tutores.

---

_Br. Edy Medina · Psicólogo en formación, 6º cuatrimestre, UVM_
