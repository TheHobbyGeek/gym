<template>
  <div class="card">
    <div class="card-header">
      <h2 class="title is-3">🚀 Setup</h2>
      <p class="subtitle">Create your account</p>
    </div>
    <div class="card-content">
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label class="label">Username</label>
          <input v-model="form.username" class="input" type="text" required>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <input v-model="form.email" class="input" type="email" required>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <input v-model="form.password" class="input" type="password" minlength="8" required>
        </div>
        <div class="field">
          <label class="label">Full Name (Optional)</label>
          <input v-model="form.fullName" class="input" type="text">
        </div>
        <div class="field">
          <label class="label">Phone (Optional)</label>
          <input v-model="form.phone" class="input" type="tel">
        </div>
        <div class="field">
          <button type="submit" class="button is-primary is-fullwidth" :disabled="loading">
            {{ loading ? 'Setting up...' : 'Complete Setup' }}
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

const { setup, setAuth } = useAuth();
const loading = ref(false);

const form = reactive({
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: ''
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const response = await setup(form);
    setAuth(response.token, response.user);
    emit('success', 'Setup completed successfully!');
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