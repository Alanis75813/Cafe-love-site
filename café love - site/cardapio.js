document.addEventListener("DOMContentLoaded", () => {
  // --- CARROSSEL ---
  const images = document.querySelectorAll('.carousel img');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
  let index = 0;

  function showImage(i) {
    images.forEach(img => img.classList.remove('active'));
    images[i].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % images.length;
    showImage(index);
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
  });

  // --- CHATBOT ---
  const chatBody = document.getElementById('chat-body');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  let total = 0;

  const menu = {
    "expresso tradicional": 7.00,
    "expresso duplo": 10.00,
    "expresso com leite": 10.00,
    "cafe americano": 7.70,
    "cappuccino italiano": 12.00,
    "mocha": 14.00,
    "latte classico": 11.00,
    "macchiato": 9.00,
    "cafe com creme": 11.00,
    "cafe com canela": 11.00,
    "cafe gelado classico": 10.00,
    "mocha gelado": 13.00,
    "misto quente": 10.00,
    "pao com ovo": 16.00,
    "pao com mortadela": 16.00,
    "pao na chapa": 10.00,
    "natural de frango": 14.00,
    "natural de presunto": 11.00,
    "omelete": 9.00,
    "coxinha de frango": 11.50,
    "mini dog alemao": 11.50,
    "pao frances": 10.00,
    "croissant": 2.50,
    "pao com manteiga": 3.00,
    "pao doce": 4.00,
    "baguete": 6.00,
    "broa": 12.00,
    "bisnaga": 3.50,
    "pao de leite": 10.50,
    "sonhos": 8.00,
    "bolo de cenoura": 10.00,
    "bolo de chocolate": 14.50,
    "bolo de mandioca": 13.00,
    "torta de morango": 16.00,
    "bolo bem-casado": 20.00,
    "torta de abacaxi": 18.00,
  };

  // Mapeia palavras numéricas para números
  const numeros = {
    "um": 1, "uma": 1,
    "dois": 2, "duas": 2,
    "tres": 3, "três": 3,
    "quatro": 4,
    "cinco": 5,
    "seis": 6,
    "sete": 7,
    "oito": 8,
    "nove": 9,
    "dez": 10,
  };

  // Carrinho (estrutura)
  const carrinho = {};

  // --- EVENTOS ---
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const text = userInput.value.trim().toLowerCase();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = "";

    const pedidosEncontrados = [];

    for (let item in menu) {
      // tenta encontrar quantidades tipo "2 cappuccinos" ou "dois cappuccinos"
      const regexNumero = new RegExp(`(\\d+|${Object.keys(numeros).join("|")})\\s+${item}s?`, "gi");
      let match;
      let encontrou = false;

      while ((match = regexNumero.exec(text)) !== null) {
        let qtd = match[1];
        if (isNaN(qtd)) qtd = numeros[qtd] || 1;
        else qtd = parseInt(qtd);

        const price = menu[item];
        addToCart(item, price, qtd);
        pedidosEncontrados.push(`${qtd}x ${item} (R$${(price * qtd).toFixed(2)})`);
        encontrou = true;
      }

      // Se não tiver número explícito, mas o item está na frase
      if (!encontrou && text.includes(item)) {
        const price = menu[item];
        addToCart(item, price, 1);
        pedidosEncontrados.push(`1x ${item} (R$${price.toFixed(2)})`);
      }
    }

    let response = "";
    if (pedidosEncontrados.length > 0) {
      response = `Adicionei ao seu carrinho: ${pedidosEncontrados.join(", ")}. 🛒 Total: R$${total.toFixed(2)}.`;
    } else {
      response = "Desculpe, não encontrei nenhum item do cardápio nessa mensagem. 😕";
    }

    setTimeout(() => addMessage(response, 'bot'), 500);
  }

  // Função para adicionar mensagem ao chat
  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Função para adicionar item ao carrinho (com quantidade)
  function addToCart(item, price, qtd = 1) {
    if (!carrinho[item]) {
      carrinho[item] = { price: price, qtd: 0 };
    }
    carrinho[item].qtd += qtd;

    renderCart();
  }

  // Renderiza o carrinho e atualiza o total
  function renderCart() {
    cartItems.innerHTML = "";
    total = 0;

    for (let item in carrinho) {
      const subtotal = carrinho[item].price * carrinho[item].qtd;
      const li = document.createElement('li');
      li.textContent = `${carrinho[item].qtd}x ${item} - R$${subtotal.toFixed(2)}`;
      cartItems.appendChild(li);
      total += subtotal;
    }

    cartTotal.textContent = total.toFixed(2);
  }

  // Finalizar compra
  checkoutBtn.addEventListener('click', () => {
    if (total === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let resumo = "🧾 Pedido Finalizado:\n\n";
    for (let item in carrinho) {
      resumo += `${carrinho[item].qtd}x ${item} - R$${(carrinho[item].price * carrinho[item].qtd).toFixed(2)}\n`;
    }
    resumo += `\nTotal: R$${total.toFixed(2)}\n\nObrigado! ☕`;

    alert(resumo);
    cartItems.innerHTML = "";
    cartTotal.textContent = "0.00";
    total = 0;
    for (let i in carrinho) delete carrinho[i];
  });
});
