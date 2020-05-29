function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const saveOnStorage = () => {
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_List', cartList);
}

const priceUpdate = async () => { // Função que atualiza o preço do carrinho de compras
  let sumItems = 0;
  try {
    const cartItems = await document.querySelectorAll('.cart__item'); // Acesso ao elemento lista
    cartItems.forEach(  // converte o que está depois de $ na string para nº e incrementa o contador
      prod => (sumItems += Number(prod.innerText.split('$')[1])),
    );
    document.querySelector('.total-price').innerText = sumItems; // imprime o resultado no HTML
  } catch (err) { console.log('Erro no requisito #5', err); }
};

function emptyCart() { // limpa lista de compras
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    const shopCart = document.querySelector('.cart__items');
    shopCart.innerHTML = '';
    priceUpdate();
    saveOnStorage();
  });
}

function cartItemClickListener(event) {  // remove item clicado
  event.target.remove();  // https://bit.ly/2AZWIJv
  priceUpdate();
  saveOnStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const putOnCart = (data) => {
  // cria um objeto com as chaves do parâmetro passado
  const prod = { sku: data.id, name: data.title, salePrice: data.price };
  // acessa a lista <ol> do DOM
  const shopCart = document.querySelector('.cart__items');
  // chama a função pra incluir o objeto recebido como filho <li> da lista
  shopCart.appendChild(createCartItemElement(prod));
  priceUpdate();
  saveOnStorage();
};

const putOnCartListener = () => {
  const sectionItems = document.querySelectorAll('.item');
  sectionItems.forEach((element) => {
    // Adiciona um listener no último filho de cada elemento de classe .item (Adicionar ao Carrinho)
    element.lastElementChild.addEventListener('click', () => {
      // Faz requisição à API segundo o sku de cada elemento através da função getSkuFromProductItem
      fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(element)}`)
        // fetch(`https://api.mercadolibre.com/items/${element.firstElementChild.innerHTML}`) // forma alternativa
        .then(response => response.json())
        .then(data => putOnCart(data))  // chama a função putOnCart passando o JSON como parâmetro.
        .catch(error => console.log(error));
    });
  });
};

function returnedProduct(results) {
  results.forEach((item) => {
    // cria um objeto {sku, name, image } para cada um dos produtos da lista
    const obj = { sku: item.id, name: item.title, image: item.thumbnail };
    const prod = createProductItemElement(obj);
    const gridItems = document.querySelector('.items');
    gridItems.appendChild(prod);
    // gridItems.appendChild(createProductItemElement(obj));  // outra forma de fazer a mesma coisa
  });
  putOnCartListener();
}

const loadCartSaved = () => { // carrega o carrinho de compras do Local Storage
  const storagedList = localStorage.getItem('cart_List'); // recupera os dados da chave cart_List
  document.querySelector('.cart__items').innerHTML = storagedList;  // imprime os dados no carrinho
  const cartItems = document.querySelector('.cart__items'); // acessa a lista de produtos no HTML
  cartItems.addEventListener('click', cartItemClickListener); // itens recuperados 'excluíveis'
  priceUpdate();
  // emptyCart();  // limpa o valor das compras
}

const apiInit = () => {
  const QUERY = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then(response => response.json())
    .then(data => returnedProduct(data.results))
    .catch((err) => {
      console.log('Erro no requisito #1', err);
    });
};

window.onload = function onload() {
  apiInit();
  emptyCart();
  setTimeout(() => {
    (document.querySelector('.loading').remove());
  }, 1234);
  loadCartSaved();
};

// const returnedProduct = (arrayResults) => {
//   arrayResults.forEach((results) => {
//     const sku = results.id;
//     const name = results.title;
//     const image = results.thumbnail;
//     const itemsList = document.querySelector('.items');
//     itemsList.appendChild(createProductItemElement({ sku, name, image }));
//   });
//   putOnCartListener();
// };
