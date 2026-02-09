<script setup>
import { RouterLink } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import { useRecords } from '@/composables/useRecords';

const { totalRecords, totalDuration } = useRecords();
</script>

<template>
  <div>
    <AppHeader title="Registro de Atividades" />

    <div class="page">
      <div class="hero">
        <h2>Bem-vindo!</h2>
        <p>Registre e acompanhe suas atividades diárias</p>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">{{ totalRecords }}</div>
          <div class="stat-label">Registros</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalDuration }}</div>
          <div class="stat-label">Minutos</div>
        </div>
      </div>

      <nav class="menu">
        <RouterLink to="/records" class="menu-item">
          📋 Ver registros
        </RouterLink>
        <RouterLink to="/records/new/edit" class="menu-item">
          ➕ Novo registro
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.hero p {
  color: #666;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #0b5cff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: block;
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.1s;
}

.menu-item:active {
  transform: scale(0.98);
}
</style>
