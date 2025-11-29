import * as service from "../../services/grupos.services.js";

export async function getGrupos(req, res) {
  try {
    const lista = await service.getGrupos();
    res.json(lista);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function getGrupoById(req, res) {
  try {
    const { id } = req.params;
    const grupo = await service.getGrupoById(id);

    if (!grupo) return res.status(404).json({ error: "No encontrado" });

    res.json(grupo);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function createGrupo(req, res) {
  try {
    const nuevo = await service.createGrupo(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateGrupo(req, res) {          
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre del grupo es obligatorio" });
    }

    const editado = await service.editarGrupo(id, { nombre });

    const grupo = editado?.value ?? editado;

    if (!grupo) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    res.json(grupo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
}

export async function deleteGrupo(req, res) {
  try {
    const { id } = req.params;
    await service.deleteGrupo(id);
    res.json({ message: "Grupo eliminado" });
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}
