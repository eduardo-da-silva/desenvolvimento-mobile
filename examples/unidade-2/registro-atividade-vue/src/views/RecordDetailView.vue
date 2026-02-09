<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppButton from '@/components/forms/AppButton.vue';
import { useRecords } from '@/composables/useRecords';

const router = useRouter();
const route = useRoute();
const { getRecord, deleteRecord } = useRecords();

const record = ref(null);

onMounted(() => {
  record.value = getRecord(route.params.id);
  if (!record.value) {
    router.push('/records');
  }
});

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function handleEdit() {
  router.push(`/records/${route.params.id}/edit`);
}

function handleDelete() {
  if (confirm('Deseja realmente excluir este registro?')) {
    deleteRecord(route.params.id);
    router.push('/records');
  }
}
</script>

<template>
  <div v-if="record">
    <AppHeader title="Detalhes" show-back @back="router.back()" />

    <div class="page">
      <div class="card">
        <h1 class="title">{{ record.title }}</h1>

        <div class="info">
          <div class="info-item">
            <span class="label">⏱️ Duração:</span>
            <span class="value">{{ record.duration }} minutos</span>
          </div>
          <div class="info-item">
            <span class="label">📅 Data:</span>
            <span class="value">{{ formatDate(record.createdAt) }}</span>
          </div>
        </div>

        <div v-if="record.notes" class="notes">
          <h3>Observações</h3>
          <p>{{ record.notes }}</p>
        </div>

        <div class="actions">
          <AppButton @click="handleEdit"> Editar </AppButton>
          <AppButton variant="danger" @click="handleDelete">
            Excluir
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.info {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #111;
}

.notes {
  margin-bottom: 24px;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
}

.notes h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

.notes p {
  line-height: 1.6;
  color: #111;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
