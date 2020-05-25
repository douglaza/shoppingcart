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

// const cartItemClickListener = () => {
//   const shopCart = document.getElementsByClassName('.cart__items');
//   const clickedProd = event.target;
//   shopCart.removeChild(clickedProd);
// };


function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function emptyCart() { // limpa lista de compras
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    const shopCart = document.querySelector('.cart__items');
    shopCart.innerHTML = '';
  });
}

function cartItemClickListener(event) {  // remove item clicado
  event.target.remove();  // https://bit.ly/2AZWIJv
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const putOnCart = (data) => {
  const prod = { sku: data.id, name: data.title, salePrice: data.price };
  const shopCart = document.querySelector('.cart__items');
  shopCart.appendChild(createCartItemElement(prod));
};

const putOnCartListener = () => {
  const sectionItems = document.querySelectorAll('.item');
  sectionItems.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => {  // https://mzl.la/2TzuhZ1
      fetch(`https://api.mercadolibre.com/items/${element.firstElementChild.innerHTML}`)  // https://bit.ly/2WXSavJ
        .then(response => response.json())
        .then(data => putOnCart(data))
        .catch(error => console.log(error));
    });
  });
};

const returnedProduct = (arrayResults) => {
  arrayResults.forEach((results) => {
    const sku = results.id;
    const name = results.title;
    const image = results.thumbnail;
    const itemsList = document.querySelector('.items');
    itemsList.appendChild(createProductItemElement({ sku, name, image }));
  });
  putOnCartListener();
};

const firstRequirement = () => {
  const QUERY = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then(response => response.json())
    .then(data => returnedProduct(data.results))
    .catch((err) => {
      console.log('Erro no requisito #1', err);
    });
};

window.onload = function onload() {
  firstRequirement();
  emptyCart();
  setTimeout(() => {
    (document.querySelector('.loading').remove());
  }, 1500);
};
