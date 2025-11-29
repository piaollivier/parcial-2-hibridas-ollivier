import express from "express"
import { createDashboard } from "../views/dashboard.view.js"

const route = express.Router()

route.get("/", (req, res) => {
  res.send(createDashboard())
})

export default route
