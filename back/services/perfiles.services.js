import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/");
const db = client.db("AH20232CP1");
const perfiles = db.collection("perfiles");
const userApps = db.collection("userApps");

export async function getPerfilesByUser(userId) {
  await client.connect();
  return perfiles.find({ miembros: new ObjectId(userId) }).toArray();
}

export async function createPerfil({ nombre }, userId) {
  await client.connect();

  const doc = {
    nombre,
    ownerId: new ObjectId(userId),
    miembros: [new ObjectId(userId)],
    createdAt: new Date(),
  };

  const r = await perfiles.insertOne(doc);
  return { ...doc, _id: r.insertedId };
}

export async function updatePerfil(id, data, userId) {
  await client.connect();

  // Solo si es miembro (mínimo)
  const perfil = await perfiles.findOne({
    _id: new ObjectId(id),
    miembros: new ObjectId(userId),
  });
  if (!perfil) throw new Error("Sin acceso al perfil");

  await perfiles.updateOne(
    { _id: new ObjectId(id) },
    { $set: { nombre: data.nombre } }
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
