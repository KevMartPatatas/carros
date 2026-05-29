# 🚗 API REST CRUD de Carros

API REST desarrollada con Node.js, Express y MySQL para administrar información de carros.

## 🧰 Tecnologías

- Node.js
- Express
- Sequelize (ORM)
- MySQL
- Multer (subida de archivos)

## 📁 Estructura del proyecto

```
proyecto-carros/
├── src/
│   ├── app.js                  → Punto de entrada
│   ├── config/
│   │   └── database.js         → Conexión a MySQL
│   ├── models/
│   │   └── Carro.js            → Modelo de la entidad
│   ├── controllers/
│   │   └── carroController.js  → Lógica CRUD
│   ├── routes/
│   │   └── carros.js           → Endpoints
│   └── middlewares/
│       └── upload.js           → Manejo de fotos
├── uploads/                    → Fotos almacenadas
├── .env.example
├── .gitignore
└── package.json
```

## ⚙️ Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/api-carros.git
cd api-carros
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Editar `.env` con tus datos de MySQL:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=carros_db
DB_USER=root
DB_PASSWORD=tu_password
PORT=3000
BASE_URL=http://localhost:3000
```

### 4. Crear la base de datos en MySQL
```sql
CREATE DATABASE carros_db;
```

### 5. Correr el servidor
```bash
npm start
# o en desarrollo:
npm run dev
```

## 🌐 Despliegue en Render

### Base de datos MySQL
1. Ir a [render.com](https://render.com) → **New +** → **MySQL**
2. Copiar: `Host`, `Port`, `Database`, `Username`, `Password`

### Servidor Node.js
1. **New +** → **Web Service**
2. Conectar tu repositorio de GitHub
3. Configurar:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. En **Environment Variables** agregar:
   ```
   DB_HOST     → (host de MySQL en Render)
   DB_PORT     → 3306
   DB_NAME     → (nombre de tu DB)
   DB_USER     → (usuario)
   DB_PASSWORD → (contraseña)
   BASE_URL    → https://tu-servicio.onrender.com
   ```

## 📡 Endpoints

| Método | Endpoint          | Acción              |
|--------|-------------------|---------------------|
| GET    | /api/carros       | Listar todos        |
| POST   | /api/carros       | Crear carro         |
| GET    | /api/carros/:id   | Obtener uno         |
| PUT    | /api/carros/:id   | Actualizar carro    |
| DELETE | /api/carros/:id   | Eliminar carro      |

## 📨 Ejemplos de uso con Postman

### Crear carro (POST /api/carros)
- Body: `form-data`
  - `placas` → ABC-123
  - `serie` → 1HGBH41JXMN109186
  - `color` → Rojo
  - `foto` → (archivo imagen, opcional)

### Listar carros (GET /api/carros)
- Sin body

### Obtener carro (GET /api/carros/1)
- Sin body

### Actualizar carro (PUT /api/carros/1)
- Body: `form-data` con los campos a modificar

### Eliminar carro (DELETE /api/carros/1)
- Sin body

## ✅ Formato de respuestas

**Éxito:**
```json
{
  "ok": true,
  "mensaje": "Carro creado correctamente",
  "data": { ... }
}
```

**Error:**
```json
{
  "ok": false,
  "error": "Datos inválidos"
}
```
