# Frontend - Sistema de Gestión Académica

Este repositorio contiene la interfaz de usuario desarrollada en React con TypeScript para la gestión de alumnos, materias y notas.

## Configuración de Variables de Entorno (.env)

Tras clonar el repositorio, debe crear un archivo llamado `.env` en la raíz del proyecto para permitir la conexión con la API. Utilice el siguiente contenido:

```env
VITE_API_URL=http://localhost:8080/api
FRONTEND_PORT=5173
```

## Instrucciones de Despliegue

Siga estos pasos para poner en marcha la interfaz. *Se recomienda haber desplegado previamente el repositorio del Backend para asegurar la disponibilidad de los datos*.

1. **Clonación:** Descargue el repositorio en su máquina local.
2. **Creación del archivo .env:** Cree el archivo en la raíz del proyecto con los valores mencionados en la sección anterior. Esto es indispensable para la conexión con la base de datos.
3. **Ejecución con Docker:** Ejecute el comando de levantamiento. Dependiendo de su versión de Docker, el comando puede requerir o no el guion intermedio (`docker-compose` o `docker compose`).

Una vez finalizado el proceso, la aplicación será accesible desde `http://localhost:5173`.

## Comandos de Ejecución

El despliegue se realiza mediante los siguientes comandos:

1. `git clone https://github.com/jlaradev/pruebatecnica-gestionalumnos-frontend`
2. `cd pruebatecnica-gestionalumnos-frontend`
3. `docker compose up -d --build` (O en su defecto: `docker-compose up -d --build`; las variables de entorno deben haber sido configuradas previamente)

## Vistas de la Aplicación

La aplicación está organizada en las siguientes secciones accesibles desde la barra de navegación:

* **Gestión de Alumnos:** `/alumnos` (Vista principal por defecto).
* **Gestión de Materias:** `/materias`.
* **Gestión de Notas:** `/notas`.

## Información Adicional

* **Tecnologías:** El proyecto utiliza Vite, React Router para la navegación y **Axios** como cliente HTTP para el consumo de la API REST.
* **Comunicación:** La conexión con el servidor se realiza a través de la URL definida en la variable `VITE_API_URL`.
* **Puerto:** El contenedor expone la aplicación a través del puerto 5173.
