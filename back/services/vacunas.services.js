import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/"
);

const db = client.db("AH20232CP1");
const vacunas = db.collection("vacunas");

function normalizeQuery(query = {}) {
  const q = { ...query };

  // ✅ soportar perfilId como ObjectId
  if (q.perfilId) q.perfilId = new ObjectId(q.perfilId);

  // ✅ userId lo dejás como string porque hoy lo guardás como string
  // (si algún día lo querés ObjectId, ahí lo migramos)
  return q;
}

export async function getVacunas(query = {}) {
  await client.connect();
  const q = normalizeQuery(query);
  return vacunas.find(q).toArray();
}

export async function getVacunasById(id, userId, perfilId) {
  await client.connect();

  const filter = { _id: new ObjectId(id) };
  if (perfilId) filter.perfilId = new ObjectId(perfilId);
  else if (userId) filter.userId = userId;

  return vacunas.findOne(filter);
}

export async function guardarVacuna(vacuna) {
  await client.connect();
  await vacunas.insertOne(vacuna);
  return vacuna;
}

export async function editarVacuna(vacuna, id, userId, perfilId) {
  await client.connect();

  const filter = { _id: new ObjectId(id) };
  if (perfilId) filter.perfilId = new ObjectId(perfilId);
  else filter.userId = userId;

  const result = await vacunas.findOneAndReplace(filter, vacuna, {
    returnDocument: "after",
  });
  return result;
}

export async function editarVacunaParcial(id, userId, perfilId, datos) {
  await client.connect();

  const filter = { _id: new ObjectId(id) };
  if (perfilId) filter.perfilId = new ObjectId(perfilId);
  else filter.userId = userId;

  const result = await vacunas.findOneAndUpdate(
    filter,
    { $set: datos },
    { returnDocument: "after" }
  );
  return result;
}

export async function eliminarVacunaLogico(id, userId, perfilId) {
  await client.connect();

  const filter = { _id: new ObjectId(id) };
  if (perfilId) filter.perfilId = new ObjectId(perfilId);
  else filter.userId = userId;

  return vacunas.updateOne(filter, { $set: { deleted: true } });
}
