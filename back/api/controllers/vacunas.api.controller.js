import * as service from "../../services/vacunas.services.js";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/");
const db = client.db("AH20232CP1");
const perfiles = db.collection("perfiles");

// ✅ helper: valida si el user logueado es miembro del perfil
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

    // ✅ si viene perfilId lo convierte a ObjectId en el service (ya lo tenés)
    const vacunas = await service.getVacunas(query);
    res.json(vacunas);
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
}

// export async function getVacunasById(req, res) {
//   try {
//     const id = req.params.id;
//     const perfilId = req.query.perfilId;
//     const userId = req.user?._id; 
//     if (perfilId) {
//       const ok = await validarAccesoPerfil(perfilId, userId);
//       if (!ok) return res.status(403).json({ error: "No tenés acceso a este perfil" });
//     }

//     const vacuna = await service.getVacunasById(id, userId, perfilId);

//     if (!vacuna) return res.status(404).json({ error: "No encontrada" });

//     res.json(vacuna);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: "Error interno" });
//   }
// }
export async function getVacunasById(req, res) {
  try {
    const id = req.params.id;
    const perfilId = req.query.perfilId;
    const userId = req.user?._id; // viene del token

    // ✅ si viene perfilId, validar acceso
    if (perfilId) {
      const ok = await validarAccesoPerfil(perfilId, userId);
      if (!ok) return res.status(403).json({ error: "No tenés acceso a este perfil" });

      const vacuna = await service.getVacunasById(id, null, perfilId); // ✅ por perfil
      if (!vacuna) return res.status(404).json({ error: "No encontrada" });
      return res.json(vacuna);
    }

    // ✅ catálogo: NO filtrar por userId
    const vacuna = await service.getVacunasById(id, null, null); // ✅ solo por _id
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

    // ✅ Si te llega perfilId, lo guardamos como ObjectId
    if (req.body.perfilId) {
      vacuna.perfilId = new ObjectId(req.body.perfilId);
      delete vacuna.userId;
    } else {
      // compatibilidad vieja
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
    const userId = req.user?._id; // 👈 del token (owner o miembro)

    // ✅ si editás por perfil, validar acceso por miembros
    if (perfilId) {
      const ok = await validarAccesoPerfil(perfilId, userId);
      if (!ok) return res.status(403).json({ error: "No tenés acceso a este perfil" });
    }

    // ✅ UPDATE PARCIAL: solo campos editables
    const datos = {
      nombre: req.body.nombre,
      previene: req.body.previene,
      edad_aplicacion: req.body.edad_aplicacion,
      dosis: req.body.dosis,
      grupo: req.body.grupo,
      obligatoria: !!req.body.obligatoria,
      fecha_colocacion: req.body.fecha_colocacion || null,
    };

    // ✅ editar por perfil si viene perfilId, sino compatibilidad por userId
    const editada = await service.editarVacunaParcial(
      id,
      userId,
      perfilId,
      datos
    );

    // tu service devuelve `result` (no siempre .value). Lo normalizamos:
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