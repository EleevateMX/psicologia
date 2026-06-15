# 🐾 Bitácora de Verano · Safari

Aplicación web instalable (**PWA**) para el **registro observacional
socioemocional** de niñas y niños en un curso de verano, con tema **safari /
zoológico salvaje** 🦁. Pensada para **una sola persona monitora**, con enfoque
**no patologizante** y **aviso de confidencialidad** de datos de menores.

> **Funciona al instante, sin configurar nada.** Toda la información se guarda
> **en tu dispositivo** (localStorage), funciona **sin conexión** y los datos
> sensibles de las y los menores **nunca salen del equipo**. No requiere cuentas
> ni servidores.

Construida con **Next.js 14 (App Router) + React + Tailwind CSS**.

---

## ✨ Funcionalidades

- 🐾 **Fichas de cachorros** (niñas y niños): datos básicos, **animal del safari**
  para identificarles, manada/grupo, tutor/a, contacto, alergias y notas.
- 🗒️ **Observaciones** en cinco categorías: 🧩 conducta, 💗 emocional, 🤝 social,
  🩺 salud y bienestar, ⭐ fortalezas.
- 🚦 **Semáforo** verde / amarillo / rojo en cada observación.
- 💗 **Check-in de ánimo** con escala de emojis (1–5).
- 🦁 **Alertas**: manuales o generadas automáticamente desde observaciones rojas,
  con estados (abierta → en seguimiento → cerrada).
- 🤝 **Seguimiento con tutores**: registro de contactos, medio y acuerdos.
- 🗺️ **Campamento base** (tablero) con métricas, distribución del semáforo y
  actividad reciente.
- 📄 **Reportes** individual y general **exportables a PDF**, firmados por
  *Br. Edy Medina, Psicólogo en formación, 6º cuatrimestre, UVM* y con el aviso
  de confidencialidad.
- ⚙️ **Ajustes y respaldo**: exporta/importa tus datos a un archivo, carga datos
  de ejemplo o borra todo.
- 📲 **PWA responsive**: instalable en el teléfono y con pantalla offline.

---

## 🚀 Puesta en marcha

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. **No hay que iniciar sesión ni configurar bases de
datos.** Crea tu primera ficha desde **«+ Cachorro»**, o entra a **Ajustes →
Cargar datos de ejemplo** para explorar la app con un safari de muestra.

### Construir para producción
```bash
npm run build
npm start
```
Se despliega sin cambios en **Vercel**, **Netlify** o cualquier hosting estático
de Next.js.

### Personalizar la firma de los reportes (opcional)
Crea un archivo `.env.local` si quieres cambiar el nombre que firma los PDF:
```env
NEXT_PUBLIC_FIRMANTE_NOMBRE=Br. Edy Medina
NEXT_PUBLIC_FIRMANTE_TITULO=Psicólogo en formación, 6º cuatrimestre, UVM
```

---

## 📲 Instalar como app (PWA)

En el navegador del teléfono abre la app y usa **«Agregar a pantalla de inicio»**.
Quedará como una app independiente, con icono de huella 🐾 y modo standalone. La
pantalla `/offline` se muestra cuando no hay conexión.

---

## 💾 Respaldo y privacidad

Como los datos viven sólo en este dispositivo:

- Usa **Ajustes → Descargar respaldo** con frecuencia para guardar un archivo
  `.json` con todo tu safari (sirve también para pasarlo a otro dispositivo).
- Restaúralo con **Ajustes → Restaurar respaldo**.

Esta herramienta es un **registro observacional de acompañamiento**, **no** un
instrumento de diagnóstico clínico. El lenguaje describe **conductas observables
y fortalezas**, evitando etiquetas. Los datos de menores son sensibles y deben
tratarse conforme a la normativa de protección de datos personales y con el
consentimiento de madres, padres o tutores.

---

## 🗂️ Estructura

```
src/
  app/
    (panel)/            Páginas (campamento, cachorros, alertas, tutores,
                        reportes, ajustes)
    offline/            Pantalla sin conexión (PWA)
  components/           UI reutilizable, formularios y botones de reporte
  lib/
    dominio.ts          Tipos, categorías, semáforo, animales y utilidades
    store.tsx           Almacén local (localStorage) + React Context
    form.ts             Helpers para leer formularios
    pdf.ts              Generación de PDF firmados (jsPDF)
    config.ts           Datos del profesional que firma
scripts/generar-iconos.mjs   Genera los iconos PWA (huella safari)
public/                 manifest.webmanifest, sw.js, iconos
```

---

_Br. Edy Medina · Psicólogo en formación, 6º cuatrimestre, UVM_
