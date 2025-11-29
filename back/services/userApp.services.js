import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { createToken } from "./token.services.js";

const client = new MongoClient(
  "mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/"
);
const db = client.db("AH20232CP1");

export async function createUserApp(userApp) {
  await client.connect()
  const existingUser = await db.collection("userApps").findOne({ email: userApp.email })
  if (existingUser) {
      throw new Error("Email existente, no se puede crear el usuario")
  }

  const newUser = { email: userApp.email, password: userApp.password }
  if (userApp.username) 
      newUser.username = userApp.username

  newUser.password = await bcrypt.hash(newUser.password, 10)

  await db.collection("userApps").insertOne(newUser)
  return { ...newUser, password: undefined }
}


export async function login(userApp) {
  await client.connect();

  const user = await db.collection("userApps").findOne({ email: userApp.email });
  if (!user) throw new Error("Credenciales inválidas");

  const ok = await bcrypt.compare(userApp.password, user.password);
  if (!ok) throw new Error("Credenciales inválidas");

  const token = await createToken(user);

  return { ...user, token, password: undefined };
}
