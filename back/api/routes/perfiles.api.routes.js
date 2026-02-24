import { Router } from "express";
import * as controller from "../controllers/perfiles.api.controller.js";
import { tokenValidate } from "../../middleware/tokenValidate.js";

const route = Router();

route.get("/", tokenValidate, controller.getPerfiles);
route.post("/", tokenValidate, controller.createPerfil);
route.post("/:id/invitar", tokenValidate, controller.invitar);

export default route;
