import Swal from 'sweetalert2';

// Configuración base para los botones (usando tus colores de Bootstrap)
const swalButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-warning mx-2 shadow-sm',
    cancelButton: 'btn btn-outline-secondary mx-2'
  },
  buttonsStyling: false // Esto permite que usemos las clases de Bootstrap
});

export const alerts = {
  // Alerta de éxito tipo Toast (la que sale arriba a la derecha)
  success: (title = 'Operación exitosa') => {
    return Swal.fire({
      icon: 'success',
      title,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  // Alerta de error
  error: (title = 'Error', text = 'Algo salió mal') => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#ffc107',
    });
  },

  // Alerta de confirmación (Para eliminar)
  confirm: async (title, text) => {
    return await swalButtons.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
  }
};