import { createPage } from "../pages/ultils.js"

export function createVacunaPage(vacunas) {
    let html = `
        <div class="mb-3 d-flex gap-2">
            <a href="/" class="btn btn-outline-secondary">← Volver</a>
        </div>

        <ul class="list-group">
    `;

    vacunas.forEach(vacuna => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${vacuna.nombre}
                <a href="/vacunas/${vacuna._id}" class="btn btn-link text-secondary">Ver</a>
            </li>
        `;
    });

    html += `</ul>`;
    return createPage("Vacunas", html);
}


export function createVacunaDetail(vacuna) {
  if (!vacuna) {
    return createPage("Vacuna no encontrada", `
      <div class="alert alert-danger" role="alert">
        No se encontró la vacuna.
      </div>
      <a href="/vacunas" class="btn btn-secondary mt-3">Volver al listado de vacunas</a>
    `);
  }

  const contenido = `
  <div class="container my-5">
    <div class="card shadow-lg">
      <div class="row g-0 align-items-center">
        <div class="col-md-5 text-center p-3">
          <img src="${vacuna.imagen}" alt="Imagen de ${vacuna.nombre}" 
              class="img-fluid rounded" style="max-width:300px;">
        </div>

        <div class="col-md-7">
          <div class="card-body">
            <h3 class="card-title mb-4">${vacuna.nombre}</h3>
            <ul class="list-group list-group-flush mb-3">
              <li class="list-group-item"><strong>Previene:</strong> ${vacuna.previene}</li>
              <li class="list-group-item"><strong>Edad de aplicación:</strong> ${vacuna.edad_aplicacion}</li>
              <li class="list-group-item"><strong>Dosis:</strong>  ${vacuna.dosis}</li>
              <li class="list-group-item"><strong>Grupo:</strong> ${vacuna.grupo}</li>
              <li class="list-group-item"><strong>Obligatoria:</strong> ${vacuna.obligatoria ? "Sí" : "No"}</li>
            </ul>
            <a href="/vacunas" class="btn btn-secondary mt-3">Volver al listado de vacunas</a>
            <a href="${vacuna.link}" target="_blank" class="btn btn-primary mt-3 ms-2">Más información</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  return createPage("Detalle", contenido);
}