<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger
  },
  disabled: Boolean,
});
</script>

<template>
  <button :type="type" :disabled="disabled" :class="['app-button', `variant-${variant}`]">
    <slot></slot>
  </button>
</template>

<style scoped>
.app-button {
  width: 100%;
  min-height: 48px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
}

.app-button:active {
  transform: scale(0.98);
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.variant-primary {
  background: #0b5cff;
  color: white;
}

.variant-secondary {
  background: #f0f0f0;
  color: #333;
}

.variant-danger {
  background: #ff4444;
  color: white;
}
</style>
