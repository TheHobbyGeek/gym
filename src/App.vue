<template>
  <div id="app">
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <i class="fas fa-chart-line mr-2"></i>
          <strong>Crypto Trading Assistant</strong>
        </a>
      </div>
      
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item" href="/">
            <i class="fas fa-home mr-2"></i>
            Dashboard
          </a>
          <a class="navbar-item">
            <i class="fas fa-wallet mr-2"></i>
            Portfolio
          </a>
          <a class="navbar-item">
            <i class="fas fa-bell mr-2"></i>
            Alerts
          </a>
        </div>
      </div>
    </nav>

    <main class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <div class="box">
              <div class="has-text-centered">
                <h1 class="title is-2">
                  <i class="fas fa-rocket mr-3"></i>
                  Welcome to Crypto Trading Assistant
                </h1>
                <p class="subtitle is-4">
                  Your professional cryptocurrency trading companion
                </p>
              </div>
              
              <div class="content">
                <div class="columns is-multiline">
                  <div class="column is-4">
                    <div class="card">
                      <div class="card-content has-text-centered">
                        <div class="content">
                          <i class="fas fa-chart-area fa-3x mb-3 has-text-success"></i>
                          <h4 class="title is-4">Portfolio Tracking</h4>
                          <p>Monitor your cryptocurrency investments in real-time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="column is-4">
                    <div class="card">
                      <div class="card-content has-text-centered">
                        <div class="content">
                          <i class="fas fa-bell fa-3x mb-3 has-text-warning"></i>
                          <h4 class="title is-4">Price Alerts</h4>
                          <p>Get notified when prices reach your target levels</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="column is-4">
                    <div class="card">
                      <div class="card-content has-text-centered">
                        <div class="content">
                          <i class="fas fa-signal fa-3x mb-3 has-text-info"></i>
                          <h4 class="title is-4">Trading Signals</h4>
                          <p>Receive intelligent trading recommendations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr>
              
              <div class="has-text-centered">
                <button @click="testConnection" class="button is-primary is-large">
                  <i class="fas fa-plug mr-2"></i>
                  Test API Connection
                </button>
              </div>
              
              <div v-if="apiStatus" class="notification mt-4" :class="apiStatus.type">
                <button class="delete" @click="apiStatus = null"></button>
                <strong>{{ apiStatus.title }}</strong><br>
                {{ apiStatus.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Crypto Trading Assistant</strong> - Built with Vue.js, Bulma, and Express.js
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      apiStatus: null
    }
  },
  methods: {
    async testConnection() {
      try {
        const response = await fetch('/api/crypto/status');
        const data = await response.json();
        
        this.apiStatus = {
          type: 'is-success',
          title: 'Connection Successful!',
          message: `${data.message} - Features: ${data.features.join(', ')}`
        };
      } catch (error) {
        this.apiStatus = {
          type: 'is-danger',
          title: 'Connection Failed',
          message: 'Unable to connect to the API. Please check if the server is running.'
        };
      }
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.card {
  height: 100%;
}

.notification {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>