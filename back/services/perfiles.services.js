import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/");
const db = client.db("AH20232CP1");
const perfiles = db.collection("perfiles");
const userApps = db.collection("userApps");

export async function getPerfilesByUser(userId) {
  await client.connect();

  const uid = new ObjectId(userId);

  const data = await perfiles
    .aggregate([
      {
        $match: {
          miembros: uid,
        },
      },
      {
        $lookup: {
          from: "userApps",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          ownerUsername: "$owner.username",
          ownerEmail: "$owner.email",
          ownerNombre: "$owner.nombre", // ✅ si lo tenés en userApps
        },
      },
      { $project: { owner: 0 } }, // opcional: sacamos el objeto owner completo
    ])
    .toArray();

  return data;
}

export async function createPerfil(data, userId) {
  await client.connect();

  const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    data.nombre || "perfil"
  )}`;

  const doc = {
    nombre: (data.nombre || "").trim(),
    apellido: (data.apellido || "").trim(),
    fechaNacimiento: data.fechaNacimiento || null,
    dni: data.dni ? String(data.dni).trim() : null,
    grupoSanguineo: data.grupoSanguineo || null,
    factor: data.factor || null,
    telefono: data.telefono ? String(data.telefono).trim() : null,

    avatar, 

    ownerId: new ObjectId(userId),
    miembros: [new ObjectId(userId)],
    createdAt: new Date(),
  };

  const r = await perfiles.insertOne(doc);
  return { ...doc, _id: r.insertedId };
}

export async function getPerfilById(id, userId) {
  await client.connect();

  const perfil = await perfiles.findOne({
    _id: new ObjectId(id),
  });

  if (!perfil) return null;

  // buscar usuarios miembros
  const miembrosUsuarios = await userApps
    .find(
      { _id: { $in: perfil.miembros } },
      { projection: { username: 1, nombre: 1, email: 1 } }
    )
    .toArray();

  return {
    ...perfil,
    miembrosUsuarios
  };
}

export async function updatePerfil(id, data, userId) {
  await client.connect();

  const perfil = await perfiles.findOne({
    _id: new ObjectId(id),
    miembros: new ObjectId(userId),
  });

  if (!perfil) throw new Error("Sin acceso al perfil");

  const datosActualizados = {
    nombre: (data.nombre || "").trim(),
    apellido: (data.apellido || "").trim(),
    fechaNacimiento: data.fechaNacimiento || null,
    dni: data.dni ? String(data.dni).trim() : null,
    grupoSanguineo: data.grupoSanguineo || null,
    factor: data.factor || null,
    telefono: data.telefono ? String(data.telefono).trim() : null,
  };

  await perfiles.updateOne(
    { _id: new ObjectId(id) },
    { $set: datosActualizados }
  );

  return { ok: true };
}

export async function deletePerfil(id, userId) {
  await client.connect();

  // Solo owner puede borrar
  const perfil = await perfiles.findOne({
    _id: new ObjectId(id),
    ownerId: new ObjectId(userId),
  });
  if (!perfil) throw new Error("Solo el creador puede eliminar el perfil");

  await perfiles.deleteOne({ _id: new ObjectId(id) });
  return { ok: true };
}

export async function invitarPerfil(id, email, userId) {
  await client.connect();

  // Solo owner invita (podés flexibilizar luego)
  const perfil = await perfiles.findOne({
    _id: new ObjectId(id),
    ownerId: new ObjectId(userId),
  });
  if (!perfil) throw new Error("Solo el creador puede invitar");

  const userInvitado = await userApps.findOne({ email });
  if (!userInvitado) throw new Error("No existe un usuario con ese email");

  await perfiles.updateOne(
    { _id: new ObjectId(id) },
    { $addToSet: { miembros: userInvitado._id } }
  );

  return { ok: true };
}

export async function getPerfilesCreadosPorMi(userId) {
  await client.connect();
  return perfiles.find({ ownerId: new ObjectId(userId) }).toArray();
}

export async function getPerfilesCompartidosConmigo(userId) {
  await client.connect();

  const uid = new ObjectId(userId);

  const data = await perfiles
    .aggregate([
      {
        $match: {
          miembros: uid,
          ownerId: { $ne: uid },
        },
      },
      {
        $lookup: {
          from: "userApps",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          ownerUsername: "$owner.username",
          ownerEmail: "$owner.email",
        },
      },
      { $project: { owner: 0 } }, // sacamos el objeto owner completo (opcional)
    ])
    .toArray();

  return data;
}

export async function dejarDeCompartirPerfil(id, email, userId) {
  await client.connect();

  const perfil = await perfiles.findOne({
    _id: new ObjectId(id),
    ownerId: new ObjectId(userId),
  });

  if (!perfil) {
    throw new Error("Solo el creador puede modificar los accesos");
  }

  const usuario = await userApps.findOne({ email });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  await perfiles.updateOne(
    { _id: new ObjectId(id) },
    { $pull: { miembros: usuario._id } }
  );

  return { ok: true };
}