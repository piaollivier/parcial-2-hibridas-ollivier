import { grupoSchema } from "../schemas/grupo.js";

export async function validateGrupo(req, res, next) {
  try {
    const data = await grupoSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.body = data;
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }
}
