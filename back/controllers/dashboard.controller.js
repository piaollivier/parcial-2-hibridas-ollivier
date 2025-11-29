import { createDashboard } from "../views/dashboard.view.js"

export function getDashboard(req, res) {
  res.send(createDashboard())
}
