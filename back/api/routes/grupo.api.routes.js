import express from "express";
import * as controllers from "../controllers/grupo.api.controller.js";

const route = express.Router();

route.get("/", controllers.getGrupos);
route.get("/:id", controllers.getGrupoById);
route.post("/", controllers.createGrupo);

route.put("/:id", controllers.updateGrupo);

route.delete("/:id", controllers.deleteGrupo);

export default route;
