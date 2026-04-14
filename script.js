// Carregar despesas do localStorage
function carregarDespesas() {
    const categorias = ['alimentacao', 'transporte', 'contas', 'outros'];
    let totalGeral = 0;

    categorias.forEach(categoria => {
        const despesas = JSON.parse(localStorage.getItem(categoria) || '[]');
        const lista = document.querySelector(`#${categoria} .lista-despesas`);
        const totalElemento = document.querySelector(`#${categoria} .total-categoria`);
        let total = 0;

        lista.innerHTML = '';
        despesas.forEach((despesa, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${despesa.descricao} - R$ ${despesa.valor.toFixed(2)}</span>
                <button onclick="removerDespesa('${categoria}', ${index}); carregarDespesas();">Remover</button>
            `;
            lista.appendChild(li);
            total += despesa.valor;
        });

        totalElemento.textContent = `Total: R$ ${total.toFixed(2)}`;
        totalGeral += total;
    });

    document.getElementById('total-geral').textContent = `Total: R$ ${totalGeral.toFixed(2)}`;

    // Populate the global remove list
    const listaTodas = document.getElementById('lista-todas-despesas');
    listaTodas.innerHTML = '';
    categorias.forEach(categoria => {
        const despesas = JSON.parse(localStorage.getItem(categoria) || '[]');
        despesas.forEach((despesa, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" value="${categoria}-${index}">
                <span>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}: ${despesa.descricao} - R$ ${despesa.valor.toFixed(2)}</span>
            `;
            listaTodas.appendChild(li);
        });
    });
}

// Adicionar despesa
function adicionarDespesa(categoria, descricao, valor) {
    const despesas = JSON.parse(localStorage.getItem(categoria) || '[]');
    despesas.push({ descricao, valor: parseFloat(valor) });
    localStorage.setItem(categoria, JSON.stringify(despesas));
    carregarDespesas();
}

// Remover despesa
function removerDespesa(categoria, index) {
    const despesas = JSON.parse(localStorage.getItem(categoria) || '[]');
    despesas.splice(index, 1);
    localStorage.setItem(categoria, JSON.stringify(despesas));
    // Removed carregarDespesas() from here
}

// Event listener para o formulário
document.addEventListener('DOMContentLoaded', () => {
    carregarDespesas();

    const form = document.getElementById('form-despesa');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let categoria = document.getElementById('categoria').value;
        const descricao = document.getElementById('descricao').value;
        const valor = document.getElementById('valor').value;

        if (!categoria) {
            categoria = 'outros';
        }

        if (categoria && descricao && valor) {
            adicionarDespesa(categoria, descricao, valor);
            form.reset();
        }
    });

    const removerBtn = document.getElementById('remover-selecionadas');
    removerBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#lista-todas-despesas input[type="checkbox"]:checked');
        const checkedValues = Array.from(checkboxes).map(cb => cb.value.split('-')).sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
        checkedValues.forEach(([categoria, index]) => {
            removerDespesa(categoria, parseInt(index));
        });
        carregarDespesas();
    });
});