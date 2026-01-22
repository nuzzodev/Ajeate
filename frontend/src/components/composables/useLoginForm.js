import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { empanadasService } from '@/api/empanadasApi';
import { useAuthStore } from '@/stores/auth';


export function useLoginForm() {
  const router = useRouter();
  const authStore = useAuthStore();

  const form = reactive({
    name: '',
    password: ''
  });
  const error = ref('');
  const loading = ref(false);

  const handleSubmit = async () => {
    loading.value = true;
    error.value = '';

    try {
      const data = await empanadasService.login(form.name, form.password);
      authStore.login(data);
      router.push({ name: 'dashboard' });
    } catch (err) {
      error.value = err.response?.status === 401 
        ? "Usuario o contraseña incorrectos" 
        : "Error de conexión con el servidor";
    } finally {
      loading.value = false;
    }
  };

  return { form, error, loading, handleSubmit };
}