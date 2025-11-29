import express from "express"
import * as controller from "../controllers/vacunas.controllers.js"

const route = express.Router()

route.get("/", controller.getVacunas)                   
route.get("/:id", controller.getVacunasById)          

export default route
