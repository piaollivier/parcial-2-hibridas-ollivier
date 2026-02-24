import * as service from "../../services/perfiles.services.js";

export async function getPerfiles(req, res) {
  try {
    const data = await service.getPerfilesByUser(req.user._id);
    return res.status(200).json(data);
  } catch (err) {
    console.error("ERROR GET PERFILES >>>", err.message);
    return res.status(500).json({ error: "Error interno al obtener perfiles" });
  }
}

export async function createPerfil(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    const perfil = await service.createPerfil({ nombre }, req.user._id);
    return res.status(201).json(perfil);
  } catch (err) {
    console.error("ERROR CREATE PERFIL >>>", err.message);
    return res.status(400).json({ error: err.message });
  }
}

export async function invitar(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const r = await service.invitarPerfil(req.params.id, email, req.user._id);
    return res.status(200).json(r);
  } catch (err) {
    console.error("ERROR INVITAR PERFIL >>>", err.message);
    return res.status(400).json({ error: err.message });
  }
}
