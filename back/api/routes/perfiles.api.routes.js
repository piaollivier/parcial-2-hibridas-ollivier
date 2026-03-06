import { Router } from "express";
import * as controller from "../controllers/perfiles.api.controller.js";
import { tokenValidate } from "../../middleware/tokenValidate.js";

const route = Router();

route.get("/", tokenValidate, controller.getPerfiles);
route.post("/", tokenValidate, controller.createPerfil);

route.post("/:id/invitar", tokenValidate, controller.invitar);

route.delete("/:id", tokenValidate, controller.deletePerfil);

route.get("/mios", tokenValidate, controller.getPerfilesCreados);
route.get("/compartidos", tokenValidate, controller.getPerfilesCompartidos);

route.get("/:id", tokenValidate, controller.getPerfilById);

route.put("/:id", tokenValidate, controller.updatePerfil);

route.post("/:id/dejar-compartir", tokenValidate, controller.dejarDeCompartir);


export default route;