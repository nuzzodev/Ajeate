<template>
  <section id="contacto" class="py-5 bg-white">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="fw-bold mb-4">¡Pide por WhatsApp!</h2>
              <p class="text-muted mb-4">Escanea el código para chatear con nosotros directamente.</p>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <section class="qr-section py-5 bg-white text-center">
            <div class="container">
              <div class="qr-container p-4 d-inline-block shadow rounded bg-light border border-warning border-3">
                <img :src="qrUrl" alt="QR WhatsApp" class="img-fluid" style="max-width: 200px;">
              </div>
              
              <div class="mt-4">
                <a :href="whatsappLink" target="_blank" class="btn btn-success btn-lg">
                  <i class="bi bi-whatsapp"></i> Chatear ahora
                </a>
              </div>
            </div>
          </section>
          
          <div class="row text-center mt-5">
            <div class="col-md-4 mb-3">
              <div class="card border-0 bg-light p-4 h-100">
                <i class="bi bi-telephone fs-1 text-warning mb-3"></i>
                <h5>Teléfono</h5>
                <p class="mb-0">0412-9080626</p>
              </div>
            </div>
            
            <div class="col-md-4 mb-3">
              <div class="card border-0 bg-light p-4 h-100">
                <i class="bi bi-instagram fs-1 text-warning"></i>
                <h5>Instagram</h5>
                <p class="mb-0"><a href="https://www.instagram.com/ajeate_58/" class="link-underline-opacity-0 link-dark link-underline-opacity-75-hover"> AJEATE_58</a></p>
              </div>
            </div>
            
            <div class="col-md-4 mb-3">
              <div class="card border-0 bg-light p-4 h-100">
                <i class="bi bi-geo-alt fs-1 text-warning mb-3"></i>
                <h5>Dirección</h5>
                <p class="mb-0">CARRERA 15 CON CALLE 58, BARQUISIMETO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    const telefono = "584129080626"; // <--- Tu número aquí
    const mensaje = encodeURIComponent("Hola Ajeate, ¡quiero pedir empanadas!");
    const link = `https://wa.me/${telefono}?text=${mensaje}`;

    return {
      whatsappLink: link,
      // Usamos una API externa que genera el QR pasándole el link como dato
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`
    }
  }
}

  

</script>