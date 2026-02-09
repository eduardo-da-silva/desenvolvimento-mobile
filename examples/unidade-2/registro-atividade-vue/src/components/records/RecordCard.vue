<script setup>
defineProps({
  title: String,
  duration: Number,
  date: String,
});
</script>

<template>
  <div class="record-card">
    <h3 class="title">{{ title }}</h3>
    <div class="meta">
      <span class="duration">⏱️ {{ duration }} min</span>
      <span class="date">📅 {{ date }}</span>
    </div>
  </div>
</template>

<style scoped>
.record-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.1s;
  cursor: pointer;
}

.record-card:active {
  transform: scale(0.98);
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111;
}

.meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}
</style>
