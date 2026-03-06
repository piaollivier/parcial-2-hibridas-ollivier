import { Router } from "express";
import * as controller from "../controllers/perfiles.api.controller.js";
import { tokenValidate } from "../../middleware/tokenValidate.js";

const route = Router();

route.get("/", tokenValidate, controller.getPerfiles);
route.post("/", tokenValidate, controller.createPerfil);

// ✅ compartir
route.post("/:id/invitar", tokenValidate, controller.invitar);

// ✅ eliminar
route.delete("/:id", tokenValidate, controller.deletePerfil);

route.get("/mios", tokenValidate, controller.getPerfilesCreados);
route.get("/compartidos", tokenValidate, controller.getPerfilesCompartidos);

// ✅ detalle
route.get("/:id", tokenValidate, controller.getPerfilById);

route.put("/perfiles/:id", tokenValidate, controller.updatePerfil);


export default route;