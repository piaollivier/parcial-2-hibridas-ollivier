import * as service from "../../services/vacunas.services.js";

export async function getVacunas(req, res) {
  try {
    const query = { ...req.query };

    if (query.obligatoria !== undefined) {
      query.obligatoria = query.obligatoria === "true";
    }

    if (query.grupo) {
      query.grupo = query.grupo;
    }

    if (query.edad) {
      query.edad_aplicacion = query.edad;
      delete query.edad;
    }

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

    const vacuna = await service.getVacunasById(id, userId);
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
      userId: req.body.userId,
      fecha_colocacion: req.body.fecha_colocacion || null,
    };

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
    const vacuna = {
      nombre: req.body.nombre,
      previene: req.body.previene,
      edad_aplicacion: req.body.edad_aplicacion,
      dosis: req.body.dosis,
      grupo: req.body.grupo,
      obligatoria: req.body.obligatoria,
      userId
    };

    const editada = await service.editarVacuna(vacuna, id, userId);
    res.json(editada);
  } catch {
    res.status(500).json({ error: "No se pudo editar" });
  }
}

export async function editarVacunaParcial(req, res) {
  try {
    const id = req.params.id;
    const userId = req.query.userId;

    const editada = await service.editarVacunaParcial(id, userId, req.body);
    res.json(editada);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function deleteVacunaLogico(req, res) {
  try {
    const id = req.params.id;
    const userId = req.query.userId;

    await service.eliminarVacunaLogico(id, userId);
    res.json({ message: "Eliminada" });
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}