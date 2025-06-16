# Proyecto HPCE Fullstack

Este proyecto es una plataforma de trueques y servicios desarrollada con Django (backend) y React + Vite (frontend).

## Estructura del proyecto

- `Back/`: Backend en Django + Django REST Framework
- `Front/`: Frontend en React (Vite)

## Instalación y ejecución rápida

### Backend
1. Instala dependencias:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt
   ```
2. Aplica migraciones:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
3. Crea un superusuario:
   ```bash
   python manage.py createsuperuser
   ```
4. Ejecuta el servidor:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ejecuta la app:
   ```bash
   npm run dev
   ```

## Comunicación entre frontend y backend
- El frontend consume la API REST del backend.
- La autenticación se realiza mediante JWT (`/token/` y `/token/refresh/`).

## Documentación adicional
- Ver `Back/READBACK.txt` para detalles del backend.
- Ver `Front/READFRONT.txt` para detalles del frontend.

Fase 1: Análisis y Planificación (Semana 1)

Gestión de Usuarias
CRUD de usuarias (Las usuarias pueden registrarse, consultar, editar y eliminar sus cuentas).
Formularios:
Registro: Accesible para todas.
Inicio de sesión: Solo usuarias autenticadas.
Perfil de usuaria:
Solo usuarias autenticadas pueden:
Ver su información personal.
Editar datos del perfil.
Eliminar su cuenta.

Gestión de Trueques
Solo usuarias autenticadas pueden:
CRUD de trueques (Crear, consultar, editar y eliminar sus propios trueques).
Mercado de trueques:
Ver sus propios trueques y los de otras usuarias.
Buscador de trueques:
Filtrar y encontrar trueques disponibles.

Gestión de Publicaciones y Publicidad
Solo usuarias autenticadas pueden:
CRUD de publicaciones (Crear, consultar, editar y eliminar sus propias publicaciones).
Muro de publicaciones:
Ver sus publicaciones y las de otras usuarias.
Ver publicidad.

Solo administradoras autenticadas y autorizadas pueden:
CRUD de publicidad (Crear, consultar, editar y eliminar anuncios publicitarios).
Contacto
Solo usuarias autenticadas pueden:
Llenar el formulario de contacto (solo acción Create).
Solo administradoras autenticadas y autorizadas pueden:
Ver y eliminar mensajes.

Gestión de Imágenes
CRUD de imágenes (Investigar cómo almacenarlas correctamente dentro de la plataforma).

Tecnologías:

Front-End: React., Back-End: Python (Django), Base de datos: MySQL, para imagenes aun no se

Diseño de la arquitectura del sistema:
Crear un diagrama ER para la base de datos.
Wireframes o Mockups para la interfaz de usuario.



Fase 2: Diseño de la Interfaz y Configuración del Entorno (Semana 2)

1. Configuración del entorno de desarrollo.

2. Desarrollo de los componentes en React.

3. Diseño y pruebas iniciales del Front-End:

o Implementación de una interfaz atractiva y responsiva para cualquier dispositivo.

o Configuración de rutas con React Router.

Fase 3: Desarrollo del Back-End y Conexión con la Base de Datos (Semana 3 y 4)

1. Configurar el servidor con Python

2. Conectar la base de datos con el Back-End.

3. Crear la API RESTful y manejar la lógica de negocio.

4. Implementar autenticación con JWT.

Fase 4: Integración del Front-End y Back-End (Semana 4 y 5)

1. Conectar el Front-End con el Back-End utilizando peticiones HTTP.

2. Validar la autenticación y autorización de usuarios (crear validaciones de seguridad).

Fase 5: Pruebas, Documentación y Optimización (Semana 5 y 6)
1. Realizar pruebas unitarias y funcionales para asegurar la correcta funcionalidad.
2. Documentar el sistema, incluyendo la instalación y la API.
3. Optimizar el sistema para garantizar su buen rendimiento.
