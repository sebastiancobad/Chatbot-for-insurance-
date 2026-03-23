# 🛡️ Chatbot de Agencia de Seguros

Aplicación web con chatbot inteligente para agencias de seguros independientes. El bot responde consultas de clientes basándose **exclusivamente** en los documentos de pólizas cargados por el administrador.

## Características

- **Chat público** con streaming de respuestas en tiempo real
- **Panel de administración** protegido con JWT
- **Gestión de documentos**: subir PDFs, TXT y MD con procesamiento automático
- **Búsqueda inteligente** por relevancia en los documentos
- **Preguntas frecuentes** configurables
- **Rate limiting** para protección contra abuso
- **Diseño responsive** optimizado para móvil y desktop

## Requisitos Previos

- **Node.js 18+** — [Descargar](https://nodejs.org/)
- **Cuenta en Anthropic** — [Registrarse](https://console.anthropic.com/) para obtener una API key
- **Cuenta en Vercel** (para deploy) — [Registrarse](https://vercel.com/)

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/seguros-chatbot.git
cd seguros-chatbot
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y editarlo:

```bash
cp .env.local.example .env.local
```

Editar `.env.local` con tus valores:

```env
# Tu API key de Anthropic (REQUERIDA)
ANTHROPIC_API_KEY=sk-ant-api03-tu-clave-aqui

# Contraseña para el panel admin (REQUERIDA)
ADMIN_PASSWORD=tu_contraseña_segura

# Secreto para JWT — genera uno con: openssl rand -base64 32
JWT_SECRET=tu_secreto_jwt_aqui

# Modelo de Claude (opcional, por defecto usa claude-sonnet-4-20250514)
CLAUDE_MODEL=claude-sonnet-4-20250514
```

### 4. Iniciar en modo desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Deploy en Vercel

### Paso 1: Subir el código a GitHub

Crear un repositorio en GitHub y subir el código.

### Paso 2: Importar en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Seleccionar el repositorio de GitHub
3. Hacer clic en **Import**

### Paso 3: Configurar Variables de Entorno

En la pantalla de configuración del proyecto, agregar estas variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Tu API key de Anthropic |
| `ADMIN_PASSWORD` | `tu_contraseña` | Contraseña del panel admin |
| `JWT_SECRET` | `secreto_aleatorio` | Ejecutar `openssl rand -base64 32` |
| `CLAUDE_MODEL` | `claude-sonnet-4-20250514` | Modelo a usar (opcional) |

### Paso 4: Deploy

Hacer clic en **Deploy**. Vercel construirá y desplegará la aplicación automáticamente.

## Uso

### Chat del Cliente (/)

1. Los clientes acceden a la URL principal
2. Pueden escribir preguntas sobre sus pólizas
3. El bot responde basándose en los documentos cargados
4. Si no hay documentos, muestra un mensaje informativo

### Panel de Administración (/admin)

1. Hacer clic en "Administrar" en el header del chat
2. Ingresar la contraseña configurada en `ADMIN_PASSWORD`
3. Desde el panel se puede:
   - **Datos de Agencia**: Cambiar nombre y slogan
   - **Documentos**: Subir PDFs, TXT o MD con pólizas y documentación
   - **Preguntas Frecuentes**: Configurar las sugerencias del chat
   - **Estadísticas**: Ver estado general del sistema

### Agregar Documentos

1. Ir al panel admin → pestaña **Documentos**
2. Arrastrar un archivo PDF, TXT o MD a la zona de carga
3. El sistema extrae el texto y lo divide en chunks automáticamente
4. Los documentos aparecen en la tabla con su información
5. El chatbot ya puede responder preguntas basadas en esos documentos

## Estructura del Proyecto

```
seguros-chatbot/
├── app/
│   ├── layout.tsx                  ← Layout raíz con fuentes
│   ├── page.tsx                    ← Vista cliente (chat público)
│   ├── globals.css                 ← Estilos globales + Tailwind
│   ├── admin/
│   │   └── page.tsx                ← Panel administrador
│   └── api/
│       ├── chat/route.ts           ← Proxy seguro a Claude (streaming)
│       └── admin/
│           ├── login/route.ts      ← Autenticación JWT
│           └── upload/route.ts     ← Procesar PDFs en servidor
├── components/
│   ├── ChatInterface.tsx           ← Interfaz principal del chat
│   ├── MessageBubble.tsx           ← Burbuja de mensaje
│   ├── TypingIndicator.tsx         ← Indicador de escritura (3 puntos)
│   ├── AdminPanel.tsx              ← Panel completo de admin
│   ├── DocumentManager.tsx         ← Gestión de documentos (drag & drop)
│   └── LoginModal.tsx              ← Modal de login
├── lib/
│   ├── types.ts                    ← Interfaces TypeScript
│   ├── auth.ts                     ← Helpers JWT
│   ├── pdf.ts                      ← Parser de PDFs
│   ├── chunker.ts                  ← División de texto en chunks
│   ├── store.ts                    ← Gestión de estado (localStorage)
│   └── relevance.ts                ← Selección inteligente de chunks
├── .env.local.example
├── .gitignore
└── README.md
```

## Stack Tecnológico

- **Next.js 14** (App Router) — Framework React
- **TypeScript** — Tipado estático
- **Tailwind CSS** — Estilos utilitarios
- **Anthropic SDK** — Integración con Claude
- **Vercel AI SDK** — Streaming de respuestas
- **pdf-parse** — Extracción de texto de PDFs
- **jose** — Autenticación JWT

## Limitaciones del MVP

- Los documentos se almacenan en **localStorage** del navegador admin (se pierden al limpiar datos del navegador)
- La búsqueda de relevancia es por **palabras clave** (no usa embeddings vectoriales)
- El rate limiting usa un **Map en memoria** (se reinicia con el servidor)

## Próximas Mejoras Sugeridas

1. **Vercel KV/Blob** para persistencia de documentos en la nube
2. **Embeddings vectoriales** para búsqueda semántica más precisa
3. **Historial de conversaciones** persistente
4. **Multi-idioma** soporte para inglés
5. **Analytics** detallados de uso del chatbot
6. **Múltiples usuarios admin** con roles
7. **Notificaciones** cuando el bot no puede responder una pregunta
8. **Exportar conversaciones** en PDF para seguimiento

## Licencia

MIT
