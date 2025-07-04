<template>
  <div class="auth-container">
    <SetupForm v-if="needsSetup" @success="handleSuccess" @error="handleError" />
    <LoginForm v-else-if="!isAuthenticated" @success="handleSuccess" @error="handleError" />
    <UserProfile v-else @success="handleSuccess" @error="handleError" />
    
    <div v-if="message" class="notification" :class="messageClass">
      <button @click="clearMessage" class="delete"></button>
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import SetupForm from './SetupForm.vue';
import LoginForm from './LoginForm.vue';
import UserProfile from './UserProfile.vue';

const { isAuthenticated, checkSetup, checkAuth } = useAuth();
const needsSetup = ref(false);
const message = ref('');
const messageClass = ref('');

const handleSuccess = (msg) => {
  message.value = msg;
  messageClass.value = 'is-success';
  setTimeout(clearMessage, 3000);
};

const handleError = (msg) => {
  message.value = msg;
  messageClass.value = 'is-danger';
  setTimeout(clearMessage, 5000);
};

const clearMessage = () => {
  message.value = '';
  messageClass.value = '';
};

onMounted(async () => {
  try {
    const setupCheck = await checkSetup();
    needsSetup.value = setupCheck.setupNeeded;
    
    if (!needsSetup.value) {
      await checkAuth();
    }
  } catch (error) {
    handleError('Failed to initialize authentication');
  }
});
</script>

<style scoped>
.auth-container {
  padding: 1rem;
}
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
}
@media (max-width: 768px) {
  .notification {
    position: static;
    margin-top: 1rem;
  }
}
</style>