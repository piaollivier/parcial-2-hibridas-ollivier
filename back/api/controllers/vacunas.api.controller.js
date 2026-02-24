import * as service from "../../services/vacunas.services.js";

export async function getVacunas(req, res) {
  try {
    const query = { ...req.query };

    if (query.obligatoria !== undefined) {
      query.obligatoria = query.obligatoria === "true";
    }

    if (query.edad) {
      query.edad_aplicacion = query.edad;
      delete query.edad;
    }

    // ✅ si viene perfilId, lo dejamos para filtrar por perfil
    // ✅ si viene userId, sigue funcionando como antes

    const vacunas = await service.getVacunas(query);
    res.json(vacunas);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function getVacunasById(req, res) {
  try {
    const id = req.params.id;
    const userId = req.query.userId;
    const perfilId = req.query.perfilId;

    const vacuna = await service.getVacunasById(id, userId, perfilId);
    if (!vacuna) return res.status(404).json({ error: "No encontrada" });

    res.json(vacuna);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function crearVacuna(req, res) {
  try {
    const vacuna = {
      ...req.body,
      fecha_colocacion: req.body.fecha_colocacion || null,
    };

    // ✅ Si te llega perfilId, lo guardamos como ObjectId
    if (req.body.perfilId) {
      vacuna.perfilId = new (await import("mongodb")).ObjectId(req.body.perfilId);
      delete vacuna.userId; // opcional: para que “mis vacunas” sea por perfil
    } else {
      // compatibilidad vieja
      vacuna.userId = req.body.userId;
    }

    const nueva = await service.guardarVacuna(vacuna);
    res.status(201).json(nueva);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function reemplazarVacuna(req, res) {
  try {
    const id = req.params.id;
    const userId = req.query.userId;
    const perfilId = req.query.perfilId;

    const vacuna = {
      nombre: req.body.nombre,
      previene: req.body.previene,
      edad_aplicacion: req.body.edad_aplicacion,
      dosis: req.body.dosis,
      grupo: req.body.grupo,
      obligatoria: req.body.obligatoria,
    };

    // si editás por perfil, mantenelo
    if (perfilId) vacuna.perfilId = perfilId;
    else vacuna.userId = userId;

    const editada = await service.editarVacuna(vacuna, id, userId, perfilId);
    res.json(editada);
  } catch {
    res.status(500).json({ error: "No se pudo editar" });
  }
}

export async function editarVacunaParcial(req, res) {
  try {
    const id = req.params.id;
    const userId = req.query.userId;
    const perfilId = req.query.perfilId;

    const editada = await service.editarVacunaParcial(id, userId, perfilId, req.body);
    res.json(editada);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function deleteVacunaLogico(req, res) {
  try {
    const id = req.params.id;
    const userId = req.query.userId;
    const perfilId = req.query.perfilId;

    await service.eliminarVacunaLogico(id, userId, perfilId);
    res.json({ message: "Eliminada" });
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}
