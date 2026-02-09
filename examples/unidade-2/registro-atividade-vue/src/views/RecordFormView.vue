  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import AppInput from '@/components/forms/AppInput.vue';
  import AppButton from '@/components/forms/AppButton.vue';
  import { useRecords } from '@/composables/useRecords';

  const router = useRouter();
  const route = useRoute();
  const { addRecord, getRecord, updateRecord } = useRecords();

  const isEditMode = computed(() => route.params.id !== 'new');

  const form = ref({
    title: '',
    duration: '',
    notes: '',
  });

  onMounted(() => {
    if (isEditMode.value) {
      const record = getRecord(route.params.id);
      if (record) {
        form.value = {
          title: record.title,
          duration: record.duration,
          notes: record.notes || '',
        };
      } else {
        router.push('/records');
      }
    }
  });

  function handleSubmit() {
    if (!form.value.title || !form.value.duration) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    if (isEditMode.value) {
      updateRecord(route.params.id, form.value);
    } else {
      addRecord(form.value);
    }

    router.push('/records');
  }
</script>

<template>
  <div>
    <AppHeader :title="isEditMode ? 'Editar Registro' : 'Novo Registro'" show-back @back="router.back()" />

    <div class="page">
      <form @submit.prevent="handleSubmit" class="form">
        <AppInput v-model="form.title" label="Título" placeholder="Ex: Estudar Vue.js" required />

        <AppInput v-model.number="form.duration" label="Duração (minutos)" type="number" placeholder="Ex: 60"
          required />

        <div class="textarea-group">
          <label class="label">Observações</label>
          <textarea v-model="form.notes" rows="4" class="textarea"
            placeholder="Adicione observações sobre a atividade..."></textarea>
        </div>

        <AppButton type="submit">
          {{ isEditMode ? 'Salvar alterações' : 'Criar registro' }}
        </AppButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.textarea-group {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.textarea:focus {
  outline: none;
  border-color: #0b5cff;
}
</style>
