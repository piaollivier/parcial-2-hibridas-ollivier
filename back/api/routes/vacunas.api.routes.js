import express from "express";
import * as controllers from "../controllers/vacunas.api.controller.js";
import { tokenValidate } from "../../middleware/tokenValidate.js";

import { vacunasValidate } from "../../middleware/vacunasValidate.js";
import { vacunasValidatePatch } from "../../middleware/vacunasValidatePatch.js";

const route = express.Router();

route.get("/", controllers.getVacunas);

route.get("/:id", tokenValidate, controllers.getVacunasById);

route.post("/", tokenValidate, vacunasValidate, controllers.crearVacuna);

route.put("/:id", tokenValidate, vacunasValidate, controllers.reemplazarVacuna);

route.patch("/:id", tokenValidate, vacunasValidatePatch, controllers.editarVacunaParcial);

route.delete("/:id", tokenValidate, controllers.deleteVacunaLogico);

export default route;