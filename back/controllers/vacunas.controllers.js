import * as service from "../services/vacunas.services.js"
import * as view from "../views/vacunas.view.js"

export function getVacunas(req, res) {
    service.getVacunas(req.query)
        .then(vacunas => res.send(view.createVacunaPage(vacunas)))
        .catch(error => {
            console.error(error);
            res.status(500).send("Error interno");
        });
}


export function getVacunasById(req, res) {
    console.log("Entró a getVacunasById, id:", req.params.id);
    const id = req.params.id
    service.getVacunasById(id)
        .then(vacuna => res.send(view.createVacunaDetail(vacuna)))
}
