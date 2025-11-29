import * as service from "../../services/usuarios.services.js"


export function getUsuarios(req, res) {
    service.getUsuarios(req.query)
        .then(usuarios => res.status(200).json(usuarios))
        .catch(() => res.status(500).json({ error: "Error interno" }))
}


export function getUsuariosById(req, res) {
    const id = req.params.id
    service.getUsuariosById(id)
        .then(usuario => {
            if (usuario) {
                res.status(200).json(usuario)
            } else {
                res.status(404).json({ error: "Usuario no encontrada" })
            }
        })
        .catch(error => res.status(500).json({ error: "Error interno" }))   
}


export function crearUsuario(req, res) {

    service.guardarUsuario(req.body)
        .then(usuarioGuardado => res.status(201).json(usuarioGuardado))
        .catch(error => res.status(500).json({ error: "Error interno" }))
}


export function deleteUsuario(req, res) {
    const id = req.params.id
    service.eliminarUsuarioLogico(id)
        .then((id) => res.status(202).json({ message: `Usuario con id ${id} eliminado` }))
        .catch(error => res.status(500).json({ error: "Error interno" }))
}


export function reemplazarUsuario(req, res) {
    const id = req.params.id

    service.editarUsuario(req.body, id)
        .then(usuarioEditado => res.status(202).json(usuarioEditado))
        .catch(error => res.status(500).json({ error: "No se pudo editar la usuario" }))
}


export function editarUsuario(req, res) {
    const id = req.params.id
    service.editarUsuarioParcial( id, req.body)
        .then(usuarioEditado => {
            if (usuarioEditado) {
                res.status(200).json(usuarioEditado)
            } else {
                res.status(404).json({ error: "Usuario no encontrado" })
            }
        })
        .catch(error => res.status(500).json({ error: "Error interno" }))
}

export function agregarVacunaColocada(req, res) {
    const idCliente = req.params.idUsuario
    const vacuna = req.body
    service.agregarVacunaColocada(idCliente, vacuna)
        .then(usuarioActualizado => res.status(202).json(usuarioActualizado))
        .catch(error => res.status(500).json({ error: "Error interno" }))   
}