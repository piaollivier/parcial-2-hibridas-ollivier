import { createPage } from "../pages/ultils.js"

export function createDashboard() {
    const contenido = `
<div class="row g-4 dashboard-cards">
<div class="col-md-4">
    <a href="/vacunas" class="text-decoration-none">
    <div class="card h-100 shadow-sm">
        <img src="/img/flia_vacuna.png" class="card-img-top"  style="filter: grayscale(20%);" alt="Todas las vacunas">
        <div class="card-body text-center">
        <h5 class="card-title">Todas las Vacunas</h5>
        </div>
    </div>
    </a>
</div>
<div class="col-md-4">
    <a href="/vacunas?obligatoria=true" class="text-decoration-none">
    <div class="card h-100 shadow-sm">
        <img src="/img/calendario.png" class="card-img-top" style="filter: grayscale(20%);"  alt="Calendario Obligatorio">
        <div class="card-body text-center">
        <h5 class="card-title">Calendario Obligatorio</h5>
        </div>
    </div>
    </a>
</div>
<div class="col-md-4">
    <a href="/vacunas?obligatoria=false" class="text-decoration-none">
    <div class="card h-100 shadow-sm">
        <img src="/img/recomendadas.png" class="card-img-top" style="filter: grayscale(20%);"  alt="Opcionales">
        <div class="card-body text-center">
        <h5 class="card-title">Vacunas Opcionales</h5>
        </div>
    </div>
    </a>
</div>
<div class="col-md-4">
    <a href="/vacunas?grupo=Niños" class="text-decoration-none">
    <div class="card h-100 shadow-sm">
        <img src="/img/niño_vacuna.png" class="card-img-top" style="filter: grayscale(20%);"  alt="Niños">
        <div class="card-body text-center">
        <h5 class="card-title">Vacunas para Niños</h5>
        </div>
    </div>
    </a>
</div>
<div class="col-md-4">
    <a href="/vacunas?grupo=Adultos" class="text-decoration-none">
    <div class="card h-100 shadow-sm">
        <img src="/img/adulto_vacuna.png" class="card-img-top" style="filter: grayscale(20%);"  alt="Adultos">
        <div class="card-body text-center">
        <h5 class="card-title">Vacunas para Adultos</h5>
        </div>
    </div>
    </a>
</div>
<div class="col-md-4">
    <a href="/vacunas?grupo=Adolescentes%20y%20embarazadas" class="text-decoration-none">
    <div class="card h-100 shadow-sm">
        <img src="/img/embarazada_vacuna.png" class="card-img-top" style="filter: grayscale(20%);"  alt="Adolescentes y Embarazadas">
        <div class="card-body text-center">
        <h5 class="card-title">Embarazadas</h5>
        </div>
    </div>
    </a>
</div>
</div>
`
    return createPage("Dashboard de Vacunas", contenido)
}
