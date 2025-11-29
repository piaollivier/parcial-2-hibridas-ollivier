import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/"
);

const db = client.db("AH20232CP1");
const grupos = db.collection("grupos");

export async function getGrupos() {
  await client.connect();
  return grupos.find().toArray();
}

export async function getGrupoById(id) {
  await client.connect();
  return grupos.findOne({ _id: new ObjectId(id) });
}

export async function createGrupo(data) {
  await client.connect();

  if (!data.nombre) {
    throw new Error("El nombre es obligatorio");
  }

  const nuevoGrupo = {
    nombre: data.nombre,
    creado: new Date(),
  };

  await grupos.insertOne(nuevoGrupo);
  return nuevoGrupo;
}

export async function editarGrupo(id, datos) {       
  await client.connect();
  const result = await grupos.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: datos },
    { returnDocument: "after" }
  );

  return result;
}

export async function deleteGrupo(id) {
  await client.connect();
  return grupos.deleteOne({ _id: new ObjectId(id) });
}
