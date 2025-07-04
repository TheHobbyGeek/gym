<template>
  <div id="app">
    <nav class="navbar is-dark" v-if="isAuthenticated">
      <div class="navbar-brand">
        <span class="navbar-item">
          <strong>{{ user.username }}</strong>
        </span>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <button @click="showProfile = !showProfile" class="button is-light">
              {{ showProfile ? 'Hide Profile' : 'Show Profile' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="main-content">
      <AuthManager v-if="!isAuthenticated || showProfile" />
      <div v-else class="container">
        <div class="section">
          <h1 class="title">Welcome, {{ user.username }}!</h1>
          <p class="subtitle">Your application is ready to use.</p>
          <div class="content">
            <p>You are now authenticated and can start building your application features.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from './composables/useAuth';
import AuthManager from './components/AuthManager.vue';

const { isAuthenticated, user } = useAuth();
const showProfile = ref(false);
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}
.main-content {
  padding: 2rem 1rem;
}
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>