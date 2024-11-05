# Buscador de Usuarios de GitHub

Una aplicación web que permite buscar y gestionar usuarios de GitHub, desarrollada con React.

## Características

- 🔍 Búsqueda de usuarios de GitHub en tiempo real
- 🌓 Modo oscuro/claro
- ✏️ Edición de nombres de usuario
- ➕ Creación de usuarios personalizados
- 🗑️ Eliminación de usuarios
- 💾 Persistencia de datos en localStorage
- 📱 Diseño responsive

## Requisitos Previos

- Navegador web moderno
- Servidor web local (puede usar Live Server de VS Code o similar)

## Instalación

1. Clone este repositorio:
```git clone [URL-del-repositorio]```

2. Navegue al directorio del proyecto:
```cd buscador-github```

3. Asegúrese de que todos los archivos estén en la siguiente estructura:
buscador-github/

├── app.js
├── public/
│   ├── estilos.css
│   └── logoUVM.png
│   └── index.html

## Ejecución

1. Si está usando Visual Studio Code, instale la extensión "Live Server"

2. Haga clic derecho en el archivo `index.html` y seleccione "Open with Live Server"

3. La aplicación se abrirá automáticamente en su navegador predeterminado

## Uso

- Escriba un nombre de usuario de GitHub en el campo de búsqueda y haga clic en "Buscar"
- Use el botón "Cambiar Tema" para alternar entre modo claro y oscuro
- Para editar un usuario, escriba el nuevo nombre en el campo de texto y haga clic en el botón de edición
- Para agregar un usuario personalizado, use el botón "Agregar Nuevo Usuario"
- Para eliminar un usuario, use el botón "Eliminar" en la tarjeta del usuario

## Tecnologías Utilizadas

- React 17
- HTML5
- CSS3
- GitHub API
- LocalStorage API

## Desarrollado por

Universidad Valle del Momboy
- Profesor: Yerson González
- Estudiantes:
  - Sarahy Ocanto - CI: 30.140.127
  - Norlys Castañeda - CI: 20.597.586
  - María Molina - CI: 27.229.410
