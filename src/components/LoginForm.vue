<template>
  <div class="card">
    <div class="card-header">
      <h2 class="title is-3">🔐 Login</h2>
      <p class="subtitle">Sign in to your account</p>
    </div>
    <div class="card-content">
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label class="label">Username or Email</label>
          <input v-model="form.username" class="input" type="text" required>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <input v-model="form.password" class="input" type="password" required>
        </div>
        <div class="field">
          <button type="submit" class="button is-primary is-fullwidth" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits(['success', 'error']);

const { login, setAuth } = useAuth();
const loading = ref(false);

const form = reactive({
  username: '',
  password: ''
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const response = await login(form);
    setAuth(response.token, response.user);
    emit('success', `Welcome back, ${response.user.username}!`);
  } catch (error) {
    emit('error', error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card {
  max-width: 400px;
  margin: 2rem auto;
}
.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}
.field {
  margin-bottom: 1rem;
}
</style>