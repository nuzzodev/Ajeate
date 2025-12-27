<template>
  <section id="ubicacion" class="py-5 bg-light">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <h2 class="display-5 fw-bold mb-4">Visítanos</h2>
          <h4 class="text-warning mb-3">AJEATE</h4>
          
          <p class="mb-4">CARRERA 15 CON CALLE 58, BARQUISIMETO</p>
          
          <div class="mb-4">
            <h5><i class="bi bi-clock me-2"></i>Horarios</h5>
            <ul class="list-unstyled">
              <li>Martes a Domingo: 05:00PM - 11:00PM</li>
            </ul>
          </div>
          
          <div class="mb-4">
            <h5><i class="bi bi-telephone me-2"></i>Teléfono</h5>
            <p class="fs-5">0412-9080626</p>
          </div>
          
          <button class="btn btn-warning btn-lg">
            <i class="bi bi-arrow-right-circle me-2"></i>Como Llegar
          </button>
        </div>
        
        <div class="col-lg-6">
          <div class="card border-0 shadow-lg">
            <div class="card-body p-0">
              <!-- Google Maps Embed -->
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d992.2425256189065!2d-69.3497793!3d10.0597057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDAzJzM0LjkiTiA2OcKwMjAnNTkuMiJX!5e0!3m2!1sen!2s!4v1643316273427"
                width="100%" 
                height="400" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
                class="rounded"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Location'
}
</script>