import * as service from "../../services/userApp.services.js";

export async function createUserApp(req, res) {
  try {
    const userApp = await service.createUserApp(req.body);
    return res.status(201).json(userApp);
  } catch (err) {
    console.error("ERROR REGISTER >>>", err.message);

    // si el error viene del mail duplicado
    if (err.message.includes("Email existente")) {
      return res.status(400).json({ error: err.message });
    }

    // otro error inesperado
    return res.status(500).json({ error: "Error interno al crear usuario" });
  }
}

export function login(req, res) {
  console.log("BODY LOGIN >>>", req.body);
  service.login(req.body)
    .then((userApp) => res.status(200).json(userApp))
    .catch((err) => res.status(400).json({ error: err.message }));
}
