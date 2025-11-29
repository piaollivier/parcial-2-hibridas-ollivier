import express from "express";
import * as controllers from "../controllers/userApp.api.controller.js";
import { validateUserApp } from "../../middleware/userAppValidate.js";

const route = express.Router();

route.post("/", validateUserApp, controllers.createUserApp);
route.post("/login", controllers.login);

export default route;
