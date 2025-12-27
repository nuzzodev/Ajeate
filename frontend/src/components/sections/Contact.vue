<template>
  <section id="contacto" class="py-5 bg-white">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="display-5 fw-bold">Realiza tu Pedido:</h2>
        <p class="lead text-muted">¿Tienes alguna pregunta? Escríbenos</p>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <form class="card border-0 shadow-lg p-4">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre" required>
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="asunto" class="form-label">Asunto</label>
              <input type="text" class="form-control" id="asunto" required>
            </div>
            
            <div class="mb-3">
              <label for="mensaje" class="form-label">Mensaje</label>
              <textarea class="form-control" id="mensaje" rows="4" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-warning btn-lg w-100">Enviar Mensaje</button>
          </form>
          
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
  name: 'Contact'
}
</script>