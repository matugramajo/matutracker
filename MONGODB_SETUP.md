# Configuración de MongoDB Atlas

## Pasos para configurar MongoDB Atlas:

### 1. Crear cuenta en MongoDB Atlas
- Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
- Crea una cuenta gratuita
- Crea un nuevo cluster (gratuito)

### 2. Configurar la base de datos
- En tu cluster, ve a "Collections"
- Crea una nueva base de datos llamada `matutracker`
- Crea una colección llamada `mediaitems`

### 3. Obtener la connection string
- Ve a "Database Access" y crea un usuario
- Ve a "Network Access" y permite acceso desde cualquier IP (0.0.0.0/0)
- Ve a "Database" y haz clic en "Connect"
- Selecciona "Connect your application"
- Copia la connection string

### 4. Configurar las variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/matutracker?retryWrites=true&w=majority
```

### 5. Instalar dependencias
```bash
npm install mongodb mongoose
# o
pnpm add mongodb mongoose
```

### 6. Ejecutar el proyecto
```bash
npm run dev
# o
pnpm dev
```

## Notas importantes:
- Reemplaza `tu_usuario`, `tu_password` y `tu_cluster` con tus datos reales
- Asegúrate de que el archivo `.env.local` esté en `.gitignore`
- La base de datos se creará automáticamente cuando agregues el primer item 