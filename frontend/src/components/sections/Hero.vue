<template>
  <section class="hero-section bg-light py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <h1 class="display-4 fw-bold mb-3">
             <span class="text-warning">Ajeate</span>
          </h1>
          <h3 class="mb-4 text-muted">EN EL SABOR</h3>
          <p class="lead mb-4">
            Especialistas en empanadas artesanales con más de 3 años de experiencia. 
            Cada empanada es una obra maestra de sabor y tradición.
          </p>
          <div class="d-flex gap-3">
            <a href="#productos" class="col-lg-3 btn btn-warning btn-lg">Ver Menú</a>
            <a href="#ubicacion" class="col-lg-3 btn btn-dark btn-hover btn-lg">Pedir ahora</a>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="card border-0 shadow-lg">
            <img src="../../assets/Ajeate/colombian-beef-and-pork-empanadas.webp" 
                 class="card-img-top rounded" 
                 alt="Empanadas"
                 style="height: 300px; object-fit: cover;">
            <div class="card-body text-center">
              <h5 class="card-title">Nuestra Especialidad</h5>
              <p class="card-text">Empanadas 100% artesanales, fritas al momento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero'
}
</script>