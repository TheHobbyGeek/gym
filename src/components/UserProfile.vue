<template>
  <div class="card">
    <div class="card-header">
      <h2 class="title is-4">👤 Profile</h2>
    </div>
    <div class="card-content">
      <div class="content">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Full Name:</strong> {{ user.fullName || 'Not set' }}</p>
        <p><strong>Phone:</strong> {{ user.phone || 'Not set' }}</p>
      </div>
      
      <div class="buttons">
        <button @click="showEditForm = !showEditForm" class="button is-info">
          {{ showEditForm ? 'Cancel' : 'Edit Profile' }}
        </button>
        <button @click="showPasswordForm = !showPasswordForm" class="button is-warning">
          {{ showPasswordForm ? 'Cancel' : 'Change Password' }}
        </button>
        <button @click="handleLogout" class="button is-danger">Logout</button>
      </div>

      <!-- Edit Profile Form -->
      <div v-if="showEditForm" class="mt-4">
        <form @submit.prevent="updateProfile">
          <div class="field">
            <label class="label">Full Name</label>
            <input v-model="editForm.fullName" class="input" type="text">
          </div>
          <div class="field">
            <label class="label">Phone</label>
            <input v-model="editForm.phone" class="input" type="tel">
          </div>
          <div class="field">
            <button type="submit" class="button is-primary" :disabled="loading">
              {{ loading ? 'Updating...' : 'Update Profile' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Change Password Form -->
      <div v-if="showPasswordForm" class="mt-4">
        <form @submit.prevent="changePassword">
          <div class="field">
            <label class="label">Current Password</label>
            <input v-model="passwordForm.currentPassword" class="input" type="password" required>
          </div>
          <div class="field">
            <label class="label">New Password</label>
            <input v-model="passwordForm.newPassword" class="input" type="password" minlength="8" required>
          </div>
          <div class="field">
            <button type="submit" class="button is-warning" :disabled="loading">
              {{ loading ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits(['success', 'error']);

const { user, updateProfile: updateUserProfile, changePassword: changeUserPassword, logout } = useAuth();
const loading = ref(false);
const showEditForm = ref(false);
const showPasswordForm = ref(false);

const editForm = reactive({
  fullName: '',
  phone: ''
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: ''
});

const updateProfile = async () => {
  loading.value = true;
  try {
    await updateUserProfile(editForm);
    Object.assign(user, editForm);
    showEditForm.value = false;
    emit('success', 'Profile updated successfully');
  } catch (error) {
    emit('error', error.message);
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  loading.value = true;
  try {
    await changeUserPassword(passwordForm);
    Object.assign(passwordForm, { currentPassword: '', newPassword: '' });
    showPasswordForm.value = false;
    emit('success', 'Password changed successfully');
  } catch (error) {
    emit('error', error.message);
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  await logout();
  emit('success', 'Logged out successfully');
};

onMounted(() => {
  editForm.fullName = user.fullName || '';
  editForm.phone = user.phone || '';
});
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: 0 auto;
}
.field {
  margin-bottom: 1rem;
}
.buttons {
  margin: 1rem 0;
}
.button {
  margin-right: 0.5rem;
}
</style>