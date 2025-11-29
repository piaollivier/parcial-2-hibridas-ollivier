export function createPage(titulo, contenido) {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>${titulo}</title>
  </head>
  <body class="bg-secondary bg-opacity-10">
<header>
  <nav class="navbar navbar-expand-lg bg-dark bg-opacity-75 navbar-dark  shadow">
    <div class="container-fluid">

      <a class="navbar-brand d-flex align-items-center" href="/"> 
        <img src="/img/logo-misto.png" alt="logo mistomed" style="width:220px;" class="me-2">
      </a>


      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>


      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto">
          <a class="nav-link fs-5"text-white href="/">Home</a>
          <a class="nav-link fs-5"text-white href="/vacunas">Todas</a>
          <a class="nav-link fs-5"text-white href="/vacunas?obligatoria=true">Obligatorias</a>
          <a class="nav-link fs-5"text-white href="/vacunas?obligatoria=false">Opcionales</a>
          <a class="nav-link fs-5"text-white href="/vacunas?grupo=Niños">Niños</a>
          <a class="nav-link fs-5"text-white href="/vacunas?grupo=Adultos">Adultos</a>
          <a class="nav-link fs-5"text-white href="/vacunas?grupo=embarazadas">Embarazadas</a>
        </div>
      </div>
    </div>
  </nav>
</header>


    <main class="container py-5">
      <h1 class="text-center mb-5">${titulo}</h1>
      ${contenido}
    </main>

    <footer class="text-center py-4 bg-dark bg-opacity-75 text-white mt-5">
      <p>&copy; 2025 MistoMed - Proyecto de Vacunas</p>
    </footer>
  </body>
  </html>
  `;
}
