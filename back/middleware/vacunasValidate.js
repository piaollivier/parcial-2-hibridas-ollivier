import { vacunaSchema } from "../schemas/vacuna.js";

export const vacunasValidate = (req, res, next) => {
  console.log("Validating vacuna data...");
  console.log("BODY RECIBIDO:", req.body); 

  vacunaSchema
    .validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })
    .then(() => next())
    .catch((err) => {
      console.log("ERROR DE VALIDACIÓN:", err.errors);
      return res.status(400).json({ message: err.errors });
    });
};