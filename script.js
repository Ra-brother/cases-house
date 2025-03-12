const produtos = [
    { id: 1, nome: 'Produto 1', preco: 10.00, imagem: 'imagens/produto1.webp' },
    { id: 2, nome: 'Produto 2', preco: 20.00, imagem: 'imagens/produto2.webp' },
    { id: 3, nome: 'Produto 3', preco: 30.00, imagem: 'imagens/produto3.webp' }
];

let carrinho = [];

// Renderiza os produtos na tela
function renderizarProdutos() {
    const container = document.getElementById('produtos');
    if (!container) {
        console.error('Elemento #produtos não encontrado!');
        return;
    }
    container.innerHTML = '';
    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button onclick="adicionarAoCarrinho(${produto.id})" aria-label="Adicionar ${produto.nome} ao carrinho">Adicionar ao Carrinho</button>
        `;
        container.appendChild(div);
    });
}

// Renderiza o carrinho
function renderizarCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');
    if (!lista || !totalCarrinho) {
        console.error('Elementos do carrinho não encontrados!');
        return;
    }
    lista.innerHTML = '';

    let total = 0;
    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" class="miniatura">
            <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
            <button onclick="removerDoCarrinho(${item.id})" aria-label="Remover ${item.nome} do carrinho">Remover</button>
        `;
        lista.appendChild(li);
        total += item.preco;
    });

    totalCarrinho.textContent = total.toFixed(2);
    salvarCarrinho(); // Salva o carrinho no localStorage
}

// Adiciona um produto ao carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        const produtoNoCarrinho = carrinho.find(item => item.id === id);
        if (produtoNoCarrinho) {
            mostrarMensagem(`${produto.nome} já está no carrinho!`, 'info');
        } else {
            carrinho.push(produto);
            renderizarCarrinho();
            mostrarMensagem(`${produto.nome} foi adicionado ao carrinho!`, 'success');
        }
    }
}

// Remove um produto do carrinho
function removerDoCarrinho(id) {
    const index = carrinho.findIndex(item => item.id === id);
    if (index !== -1) {
        const [itemRemovido] = carrinho.splice(index, 1);
        renderizarCarrinho();
        mostrarMensagem(`${itemRemovido.nome} foi removido do carrinho!`, 'warning');
    }
}

// Fecha o pedido
function fecharPedido() {
    if (carrinho.length === 0) {
        mostrarMensagem('Seu carrinho está vazio! Adicione produtos antes de fechar o pedido.', 'info');
    } else {
        const confirmacao = confirm('Tem certeza que deseja finalizar o pedido?');
        if (confirmacao) {
            mostrarMensagem('Pedido finalizado! Obrigado por comprar conosco.', 'success');
            limparCarrinho();
        }
    }
}

// Salva o carrinho no localStorage
function salvarCarrinho() {
    try {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    } catch (error) {
        console.error('Erro ao salvar o carrinho no localStorage:', error);
    }
}

// Carrega o carrinho do localStorage
function carregarCarrinho() {
    try {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
            console.log('Carrinho carregado:', carrinho); // Depuração
            renderizarCarrinho();
        }
    } catch (error) {
        console.error('Erro ao carregar o carrinho do localStorage:', error);
    }
}

// Limpa o carrinho
function limparCarrinho() {
    carrinho = [];
    localStorage.removeItem('carrinho');
    renderizarCarrinho();
}

// Mostra uma mensagem na tela
function mostrarMensagem(mensagem, tipo) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem ${tipo}`;
    mensagemDiv.textContent = mensagem;
    document.body.appendChild(mensagemDiv);

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        mensagemDiv.remove();
    }, 3000);
}

// Inicializa o carrinho e os produtos
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    renderizarProdutos();
});
