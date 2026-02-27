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

export default route;