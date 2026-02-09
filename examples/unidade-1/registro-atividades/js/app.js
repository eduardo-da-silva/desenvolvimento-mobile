// Array em memória para armazenar registros
const records = [];

// Elementos do DOM
const recordsList = document.getElementById('records');
const btnAdd = document.getElementById('btnAdd');

// Função para renderizar a lista na tela
function render() {
  // Limpa a lista
  recordsList.innerHTML = '';

  // Para cada registro, cria um elemento <li>
  records.forEach((r, index) => {
    const li = document.createElement('li');
    li.className = 'record';
    li.textContent = `${r.title} — ${r.duration} min`;
    recordsList.appendChild(li);
  });
}

// Ao clicar em adicionar, pede informações simples e atualiza a lista
btnAdd.addEventListener('click', () => {
  const title = prompt('Título da atividade:');
  if (!title) return; // cancela se vazio

  const duration = prompt('Duração em minutos (ex: 30):');
  if (!duration) return;

  // Adiciona no array
  records.push({ title: title.trim(), duration: duration.trim() });

  // Re-renderiza a lista
  render();
});

// Render inicial (lista vazia)
render();
