<script setup>
import { RouterLink, useRouter } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import RecordCard from '@/components/records/RecordCard.vue';
import { useRecords } from '@/composables/useRecords';

const router = useRouter();
const { records } = useRecords();

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pt-BR');
}
</script>

<template>
  <div>
    <AppHeader title="Meus Registros" show-back @back="router.push('/')" />

    <div class="page">
      <div v-if="records.length > 0" class="list">
        <RouterLink v-for="record in records" :key="record.id" :to="`/records/${record.id}`" class="link">
          <RecordCard :title="record.title" :duration="record.duration" :date="formatDate(record.createdAt)" />
        </RouterLink>
      </div>

      <div v-else class="empty">
        <p>📭</p>
        <p>Nenhum registro ainda</p>
        <RouterLink to="/records/new/edit" class="btn">
          Criar primeiro registro
        </RouterLink>
      </div>

      <RouterLink to="/records/new/edit" class="fab"> + </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link {
  text-decoration: none;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty p:first-child {
  font-size: 48px;
  margin-bottom: 16px;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: #0b5cff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #0b5cff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.fab:active {
  transform: scale(0.9);
}
</style>
