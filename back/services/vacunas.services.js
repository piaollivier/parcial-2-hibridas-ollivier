import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/"
);

const db = client.db("AH20232CP1");
const vacunas = db.collection("vacunas");

export async function getVacunas(query = {}) {
  await client.connect();
  return vacunas.find(query).toArray();
}

export async function getVacunasById(id, userId) {
  await client.connect();
  return vacunas.findOne({ 
    _id: new ObjectId(id),
    userId 
  });
}

export async function guardarVacuna(vacuna) {
  await client.connect();
  await vacunas.insertOne(vacuna);
  return vacuna;
}

export async function editarVacuna(vacuna, id, userId) {
  await client.connect();
  const result = await vacunas.findOneAndReplace(
    { _id: new ObjectId(id), userId },
    vacuna,
    { returnDocument: "after" }
  );
  return result;
}

export async function editarVacunaParcial(id, userId, datos) {
  await client.connect();
  const result = await vacunas.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: datos },
    { returnDocument: "after" }
  );
  return result;
}

export async function eliminarVacunaLogico(id, userId) {
  await client.connect();
  return vacunas.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { deleted: true } }
  );
}