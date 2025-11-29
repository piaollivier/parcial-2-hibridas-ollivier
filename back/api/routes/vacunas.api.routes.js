import express from "express";
import * as controllers from "../controllers/vacunas.api.controller.js";

import { vacunasValidate } from "../../middleware/vacunasValidate.js";
import { vacunasValidatePatch } from "../../middleware/vacunasValidatePatch.js";

const route = express.Router();

route.get("/", controllers.getVacunas);

route.get("/:id", controllers.getVacunasById);

route.post("/", vacunasValidate, controllers.crearVacuna);

route.put("/:id", vacunasValidate, controllers.reemplazarVacuna);

route.patch("/:id", vacunasValidatePatch, controllers.editarVacunaParcial);

route.delete("/:id", controllers.deleteVacunaLogico);

export default route;
