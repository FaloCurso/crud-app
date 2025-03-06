# CRUD App

CRUD App es una aplicación web para la gestión de jornada laboral, permitiendo crear, leer, actualizar y eliminar registros de manera sencilla.

## Características

- Registro de empleados con nombre, apellidos, usuario, contraseña, e imagen de este.
- Edición y eliminación de registros, con hora entrada, salida, horas trabajadas y monitoriza si esta trabajando. 
- Filtra por dias, nombre de usuario y ambas.
- Interfaz sencilla y funcional.
- Uso de tecnologías web modernas.

## Tecnologías utilizadas

- **Frontend**: HTML, CSS y JavaScript.
- **Backend**: Node.js con Express.
- **Base de datos**: JSON (archivo local).

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/FaloCurso/crud-app.git
   ```
2. Accede al directorio del proyecto:
   ```bash
   cd crud-app
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor:
   ```bash
   npm run startserver
   ```
5. Abre el navegador y accede a:
   ```
   http://localhost:3000
   ```

## Estructura del proyecto

```
crud-app/
├── 📁 css/                # Archivos de estilos
│   ├── 🎨 entrada_salida.css
│   ├── 🎨 gestion_Admin.css
│   ├── 🎨 index.css
├── 📁 database/           # Base de datos
│   ├── 🗄️ db.json
├── 📁 img/                # Recursos de imagen
│   ├── 🖼️ favicon.ico
│   ├── 🖼️ foto1.webp
│   ├── 🖼️ foto2.webp
│   ├── 🖼️ foto3.webp
│   ├── 🖼️ foto4.webp
│   ├── 🖼️ logo.webp
├── 📁 public/             # Archivos HTML públicos
│   ├── 📄 entrada_Salida.html
│   ├── 📄 gestion_Admin.html
│   ├── 📄 index.html
├── 📁 src/                # Código fuente
│   ├── 📜 crud.js
│   ├── 📜 entrada_salida.js
│   ├── 📜 gestion_Admin.js
│   ├── 📜 index.js
├── 📄 .gitignore          # Archivos a ignorar por Git
├── 📄 package.json        # Configuración del proyecto y dependencias
├── 📄 package-lock.json   # Archivo de bloqueo de dependencias
├── 📄 README.md           # Documentación del proyecto
```

## Contribución

1. Haz un fork del repositorio.
2. Crea una nueva rama con tu funcionalidad:
   ```bash
   git checkout -b feature-nueva-funcionalidad
   ```
3. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "Descripción de cambios"
   ```
4. Sube los cambios a tu fork:
   ```bash
   git push origin feature-nueva-funcionalidad
   ```
5. Abre un Pull Request en el repositorio original.

## Licencia

Este proyecto está bajo la licencia MIT. ¡Siéntete libre de usarlo y mejorarlo!

