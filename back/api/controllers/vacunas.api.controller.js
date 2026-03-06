import * as service from "../../services/vacunas.services.js";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/");
const db = client.db("AH20232CP1");
const perfiles = db.collection("perfiles");

async function validarAccesoPerfil(perfilId, userId) {
  if (!perfilId) return false;

  const perfil = await perfiles.findOne({
    _id: new ObjectId(perfilId),
    miembros: new ObjectId(userId),
  });

  return !!perfil;
}

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

    const vacunas = await service.getVacunas(query);
    res.json(vacunas);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}


export async function getVacunasById(req, res) {
  try {
    const id = req.params.id;
    const perfilId = req.query.perfilId;
    const userId = req.user?._id; 

    if (perfilId) {
      const ok = await validarAccesoPerfil(perfilId, userId);
      if (!ok) return res.status(403).json({ error: "No tenés acceso a este perfil" });

      const vacuna = await service.getVacunasById(id, null, perfilId); 
      if (!vacuna) return res.status(404).json({ error: "No encontrada" });
      return res.json(vacuna);
    }

    const vacuna = await service.getVacunasById(id, null, null); 
    if (!vacuna) return res.status(404).json({ error: "No encontrada" });

    res.json(vacuna);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error interno" });
  }
}

export async function crearVacuna(req, res) {
  try {
    const vacuna = {
      ...req.body,
      fecha_colocacion: req.body.fecha_colocacion || null,
    };

    if (req.body.perfilId) {
      vacuna.perfilId = new ObjectId(req.body.perfilId);
      delete vacuna.userId;
    } else {
      vacuna.userId = req.body.userId;
    }

    const nueva = await service.guardarVacuna(vacuna);
    res.status(201).json(nueva);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error interno" });
  }
}

export async function reemplazarVacuna(req, res) {
  try {
    const id = req.params.id;
    const perfilId = req.query.perfilId;
    const userId = req.user?._id; 

    if (perfilId) {
      const ok = await validarAccesoPerfil(perfilId, userId);
      if (!ok) return res.status(403).json({ error: "No tenés acceso a este perfil" });
    }

    const datos = {
      nombre: req.body.nombre,
      previene: req.body.previene,
      edad_aplicacion: req.body.edad_aplicacion,
      dosis: req.body.dosis,
      grupo: req.body.grupo,
      obligatoria: !!req.body.obligatoria,
      fecha_colocacion: req.body.fecha_colocacion || null,
    };

    const editada = await service.editarVacunaParcial(
      id,
      userId,
      perfilId,
      datos
    );

    const value = editada?.value ?? editada;

    if (!value) return res.status(404).json({ error: "No encontrada" });

    res.json(value);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "No se pudo editar" });
  }
}

export async function editarVacunaParcial(req, res) {
  try {
    const id = req.params.id;
    const perfilId = req.query.perfilId;
    const userId = req.user?._id;

    if (perfilId) {
      const ok = await validarAccesoPerfil(perfilId, userId);
      if (!ok) return res.status(403).json({ error: "No tenés acceso a este perfil" });
    }

    const editada = await service.editarVacunaParcial(id, userId, perfilId, req.body);
    const value = editada?.value ?? editada;

    if (!value) return res.status(404).json({ error: "No encontrada" });

    res.json(value);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

export async function deleteVacunaLogico(req, res) {
  try {
    const id = req.params.id;
    const perfilId = req.query.perfilId;
    const userId = req.user?._id;

    if (perfilId) {
      const ok = await validarAccesoPerfil(perfilId, userId);
      if (!ok) return res.status(403).json({ error: "No tenés acceso a este perfil" });
    }

    await service.eliminarVacunaLogico(id, userId, perfilId);
    res.json({ message: "Eliminada" });
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}