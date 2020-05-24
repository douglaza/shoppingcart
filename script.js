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

const cartItemClickListener = () => {
  const shopCart = document.getElementsByClassName('.cart__items');
  const clickedProd = event.target;
  shopCart.removeChild(clickedProd);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const putOnCart = (brand) => {
  const itemCart = document.querySelector('.cart__items');
  const { id, title, price } = brand;
  const prod = { sky: id, name: title, salePrice: price };
  itemCart.appendChild(createCartItemElement(prod));
  //   fetch(`https://api.mercadolibre.com/items/${brand}`)
  //     .then(response => response.json())
  //     .then(({ id, title, price }) => {
  //       shopCart.append(createCartItemElement({ sku: id, name: title, salePrice: price }));
  //     })
  //     .catch((err) => {
  //       console.log('Erro no resquisito #2', err);
  //     });
};

// const auxTarget = (event) => {
//   const brand = event.target.parentNode.firstChild.innerText;
//   putOnCart(brand);
// }

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (event) => {
    const choosedItem = event.target.parentNode.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${choosedItem}`)
      .then(response => response.json())
      .then(data => putOnCart(data));
    // .then(({ id, title, price }) => {
    //   shopCart.append(createCartItemElement({ sku: id, name: title, salePrice: price }))
    // })
    // .catch((err) => {
    //   console.log(`Erro no requisito #2`, err)
    // })
  });
  // button.addEventListener('click', auxTarget);
  section.appendChild(button);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

const returnedProduct = (arrayResults) => {
  const itemsList = document.getElementsByClassName('items');
  arrayResults.forEach(({ id, title, thumbnail }) => {
    // arrayResults.forEach(results) => {
    // const { id, title, thumbnail } = results;
    const item = { sku: id, name: title, image: thumbnail };
    itemsList[0].appendChild(createProductItemElement(item));
  });
};

const firstRequirement = () => {  // https://bit.ly/2TA3mML
  const QUERY = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then(response => response.json())
    .then(data => returnedProduct(data.results))
    .catch((err) => {
      console.log('Erro no requisito #1', err);
    });
};

firstRequirement();
