import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const client = new MongoClient(
  "mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/"
);

const db = client.db("AH20232CP1");
const tokens = db.collection("tokens");

const SECRET_KEY = "DWM4AV_HIBRIDAS_2025";

export async function createToken(userApp) {
  await client.connect();

  const payload = {
    _id: userApp._id.toString(),
    email: userApp.email,
    username: userApp.username,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

  await tokens.updateOne(
    { userAppId: userApp._id },
    { $set: { token, userAppId: userApp._id } },
    { upsert: true }
  );

  return token;
}

export async function validateToken(token) {
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    return payload;
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
}


