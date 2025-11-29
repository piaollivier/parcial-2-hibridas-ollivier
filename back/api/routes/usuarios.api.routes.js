import express from "express"
import * as controllers from "../controllers/usuarios.api.controller.js"

const route = express.Router()

route.get("/", controllers.getUsuarios)
route.get("/:id", controllers.getUsuariosById)
route.post("/", controllers.crearUsuario)
route.delete("/:id", controllers.deleteUsuario)
route.put("/:id", controllers.reemplazarUsuario)
route.patch("/:id", controllers.editarUsuario)

route.post("/:idUsuario", controllers.agregarVacunaColocada)

export default route