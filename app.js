function App() {
  const [usuarios, setUsuarios] = React.useState([]);
  const [nombreUsuario, setNombreUsuario] = React.useState("");
  const [modoOscuro, setModoOscuro] = React.useState(false);
  const [nombresEditados, setNombresEditados] = React.useState({});
  const [nuevoUsuario, setNuevoUsuario] = React.useState({
    login: "",
    name: "",
    company: "",
    public_repos: 0,
    avatar_url: "/placeholder.svg?height=120&width=120",
    html_url: "#",
  });
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
  const [usuariosEliminados, setUsuariosEliminados] = React.useState([]);

  React.useEffect(() => {
    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios")) || [];
    const nombresEditadosGuardados =
      JSON.parse(localStorage.getItem("nombresEditados")) || {};
    const usuariosEliminadosGuardados =
      JSON.parse(localStorage.getItem("usuariosEliminados")) || [];
    setUsuarios(usuariosGuardados);
    setNombresEditados(nombresEditadosGuardados);
    setUsuariosEliminados(usuariosEliminadosGuardados);

    const temaGuardado = localStorage.getItem("modoOscuro");
    if (temaGuardado !== null) {
      setModoOscuro(temaGuardado === "true");
    } else {
      setModoOscuro(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  React.useEffect(() => {
    document.body.classList.toggle("modo-oscuro", modoOscuro);
    localStorage.setItem("modoOscuro", modoOscuro);
  }, [modoOscuro]);

  const buscarUsuarios = async () => {
    if (nombreUsuario) {
      try {
        const respuesta = await fetch(
          `https://api.github.com/search/users?q=${nombreUsuario}&per_page=3`
        );
        const datos = await respuesta.json();
        const promesasUsuarios = datos.items.map((usuario) =>
          fetch(usuario.url).then((respuesta) => respuesta.json())
        );
        const datosUsuarios = await Promise.all(promesasUsuarios);
        const usuariosConNombresEditados = datosUsuarios
          .filter((usuario) => !usuariosEliminados.includes(usuario.login))
          .map((usuario) => ({
            ...usuario,
            name: nombresEditados[usuario.login] || usuario.name,
          }));
        setUsuarios(usuariosConNombresEditados);
        guardarUsuariosEnLocalStorage(usuariosConNombresEditados);
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
      }
    }
  };

  const eliminarUsuario = (login) => {
    const usuariosActualizados = usuarios.filter(
      (usuario) => usuario.login !== login
    );
    setUsuarios(usuariosActualizados);
    guardarUsuariosEnLocalStorage(usuariosActualizados);

    const nuevosNombresEditados = { ...nombresEditados };
    delete nuevosNombresEditados[login];
    setNombresEditados(nuevosNombresEditados);
    localStorage.setItem(
      "nombresEditados",
      JSON.stringify(nuevosNombresEditados)
    );

    const nuevosUsuariosEliminados = [...usuariosEliminados, login];
    setUsuariosEliminados(nuevosUsuariosEliminados);
    localStorage.setItem(
      "usuariosEliminados",
      JSON.stringify(nuevosUsuariosEliminados)
    );
  };

  const actualizarUsuario = (login, nuevoNombre) => {
    const usuariosActualizados = usuarios.map((usuario) =>
      usuario.login === login ? { ...usuario, name: nuevoNombre } : usuario
    );
    setUsuarios(usuariosActualizados);
    guardarUsuariosEnLocalStorage(usuariosActualizados);

    const nuevosNombresEditados = { ...nombresEditados, [login]: nuevoNombre };
    setNombresEditados(nuevosNombresEditados);
    localStorage.setItem(
      "nombresEditados",
      JSON.stringify(nuevosNombresEditados)
    );
  };

  const guardarUsuariosEnLocalStorage = (usuariosActualizados) => {
    localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoUsuario((prev) => ({
          ...prev,
          avatar_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarNuevoUsuario = () => {
    const usuarioCreado = {
      ...nuevoUsuario,
      login: nuevoUsuario.name.toLowerCase().replace(/\s+/g, "-"),
      html_url: `https://github.com/${nuevoUsuario.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    };

    const usuariosActualizados = [...usuarios, usuarioCreado];
    setUsuarios(usuariosActualizados);
    guardarUsuariosEnLocalStorage(usuariosActualizados);

    setNuevoUsuario({
      login: "",
      name: "",
      company: "",
      public_repos: 0,
      avatar_url: "/placeholder.svg?height=120&width=120",
      html_url: "#",
    });
    setMostrarFormulario(false);
  };

  return (
    <div className="contenedor">
      <h1>Buscador de Usuarios de GitHub</h1>
      <div className="contenedor-busqueda">
        <input
          type="text"
          id="busqueda"
          placeholder="Buscar usuario..."
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
        />
        <button className="boton-buscar" onClick={buscarUsuarios}>
          Buscar
        </button>
      </div>
      <div id="resultados">
        {usuarios.map((usuario) => (
          <div key={usuario.login} className="usuario">
            <img src={usuario.avatar_url} alt={usuario.login} />
            <h2>{usuario.name || usuario.login}</h2>
            <p>@{usuario.login}</p>
            <p>Empresa: {usuario.company || "N/A"}</p>
            <p>Repositorios: {usuario.public_repos}</p>
            <a
              href={usuario.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Perfil
            </a>
            <div className="contenedor-edicion">
              <input
                type="text"
                placeholder="Nuevo nombre"
                value={nombresEditados[usuario.login] || ""}
                onChange={(e) =>
                  setNombresEditados({
                    ...nombresEditados,
                    [usuario.login]: e.target.value,
                  })
                }
              />
              <button
                className="boton-editar"
                onClick={() =>
                  actualizarUsuario(
                    usuario.login,
                    nombresEditados[usuario.login]
                  )
                }
              >
                ✎
              </button>
            </div>
            <button
              className="boton-eliminar"
              onClick={() => eliminarUsuario(usuario.login)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <button
        className="boton-agregar"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "Cancelar" : "Agregar Nuevo Usuario"}
      </button>
      {mostrarFormulario && (
        <div className="usuario nuevo-usuario">
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="input-file"
          />
          <img
            src={nuevoUsuario.avatar_url}
            alt="Avatar"
            className="avatar-preview"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoUsuario.name}
            onChange={(e) =>
              setNuevoUsuario((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Empresa"
            value={nuevoUsuario.company}
            onChange={(e) =>
              setNuevoUsuario((prev) => ({ ...prev, company: e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Número de repositorios"
            value={nuevoUsuario.public_repos}
            onChange={(e) =>
              setNuevoUsuario((prev) => ({
                ...prev,
                public_repos: parseInt(e.target.value),
              }))
            }
          />
          <button onClick={agregarNuevoUsuario} className="boton-crear">
            Crear Usuario
          </button>
        </div>
      )}
      <button id="cambiar-tema" onClick={() => setModoOscuro(!modoOscuro)}>
        Cambiar Tema
      </button>
      <footer>
        <img
          src="./logoUVM.png"
          alt="Logo de la Universidad"
          className="footer-logo"
        />
        <div className="footer-content">
          <h3>Universidad Valle del Momboy</h3>
          <p>Profesor: Yerson González</p>
          <p>Integrantes:</p>
          <p>Sarahy Ocanto - CI: 30.140.127</p>
          <p>Norlys Castañeda - CI: 20.597.586</p>
          <p>María Molina - CI: 27.229.410</p>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
