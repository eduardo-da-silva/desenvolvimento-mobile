<template>
    <div class="app">
        <h1 class="title">Calculadora de Gorjeta e Divisao</h1>

        <div class="layout">
            <div class="panel">
                <h2>Entradas</h2>
                <input v-model="bill" class="input" placeholder="Valor" />
                <input v-model="tip" class="input" placeholder="Porcentagem" />
                <input v-model="people" class="input" placeholder="Pessoas" />
                <button class="small-btn" @click="calculate">Calcular</button>
            </div>

            <div class="panel">
                <h2>Resultado</h2>
                <div class="result">Total: {{ total }}</div>
                <div class="result">Gorjeta: {{ tipValue }}</div>
                <div class="result">Por pessoa: {{ perPerson }}</div>
                <div class="result">{{ message }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const bill = ref('');
const tip = ref('');
const people = ref('');

const total = ref(0);
const tipValue = ref(0);
const perPerson = ref(0);
const message = ref('');

function calculate() {
    const billValue = Number(bill.value);
    const tipPercent = Number(tip.value);
    const peopleCount = Number(people.value);

    if (!billValue || !tipPercent || !peopleCount) {
        alert('Preencha os dados');
        message.value = 'Algo deu errado.';
        return;
    }

    tipValue.value = (billValue * tipPercent) / 100;
    total.value = billValue + tipValue.value;
    perPerson.value = total.value / peopleCount;
    message.value = 'Ok';
}
</script>
