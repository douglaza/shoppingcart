// função nativa
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função nativa
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// função nativa
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// a função armazena o conteúdo da lista que possui a classe 'cart__items', armazena em uma
// constante, e salva esta constante no local storage via método setItem().
const saveOnStorage = () => {
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_List', cartList);
};

// função que atualiza o preço do carrinho de compras: seta uma variável para armazenar o
// somatório; armazena em uma constante todos os itens do carrinho(criados com a classe cart__item
// pela função nativa creatCartItemElement()); a string referente a cada produto da list é dividida
// em duas pelo método split, então a segunta metade, o preço, é convertido para número e
// incrementado; o resultado é impresso no elemento HTML criado com classe 'tota-price'.
const priceUpdate = async () => {
  let sumItems = 0;
  try {
    const cartItems = await document.querySelectorAll('.cart__item');
    cartItems.forEach(
      prod => (sumItems += Number(prod.innerText.split('$')[1])),
    );
    document.querySelector('.total-price').innerText = sumItems;
  } catch (err) { console.log('Erro no requisito #5', err); }
};

// função que esvazia o carrinho de compras: o botão HTML criado com a classe 'empty-cart' é
// atribuído a uma constante; um listener é adicionado à referida constante para que, quando
// clicado, seja chamada a função que irá, primeiro atribuir o carrinho de compras a uma variável
// shopCart, e então atribuir ao seu conteúdo uma string vazia; a função de atualizar o preço do
// carrinho é chamada para zerar seu valor e por último a função saveOnStorage é também chamada
// para atualizar o conteúdo do local storage (para um conteúdo vazio)
const emptyCart = () => {
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    const shopCart = document.querySelector('.cart__items');
    shopCart.innerHTML = '';
    priceUpdate();
    saveOnStorage();
  });
};

// função que remove o ítem clicado: o elemento 'alvo' (target) do click é removido e as funções de
// atualizar preço e salvar o status do carrinho no local storage são acionadas.
function cartItemClickListener(event) {
  event.target.remove();  // https://bit.ly/2AZWIJv
  priceUpdate();
  saveOnStorage();
}

// função nativa
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// função nativa
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// função que inclui os produtos no carrinho de compras: inicialmente é criado um objeto 'prod' com
// as propriedades do objeto 'data' passado como parâmetro (com suas respectivas propriedades); o
// elemento HTML lista é atribuído a uma constante 'shopcart' e nesta constante então são apensados
// filhos através da função nativa createCartItemElement (que basicamente cria itens de lista com o
// objeto 'prod' passado como parâmetro); o preço total do carrinho de compras é atualizado e a
// lista atualizada é salva no local storage
const putOnCart = (data) => {
  const prod = { sku: data.id, name: data.title, salePrice: data.price };
  const shopCart = document.querySelector('.cart__items');
  shopCart.appendChild(createCartItemElement(prod));
  priceUpdate();
  saveOnStorage();
};

// função que inclui um listener nos itens da lista de compras: todos os itens (classe 'item') da
// lista de compras são armazenados em uma constante sectionItems; para cada elemento desta nova
// constante é adicionado ao seu último filho (botão <Adicionar Carrinho!>) um listener que, ao ser
// acionado, fará então a requisão à API através do parâmetro SKU recebido pela função nativa
// getSkuFromProductItem; em caso de sucesso, o produto recuperado é passado como parâmetro pra ser
// incluído no carrinho (função putOnCart()).
const putOnCartListener = () => {
  const sectionItems = document.querySelectorAll('.item');
  sectionItems.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(element)}`)
        // fetch(`https://api.mercadolibre.com/items/${element.firstElementChild.innerHTML}`) // forma alternativa
        .then(response => response.json())
        .then(data => putOnCart(data))
        .catch(error => console.log(error));
    });
  });
};

// função que cria a lista de compras com o resultado da consulta à API: para cada item do array de
// produtos recebido como parâmetro é criado um objeto com as propriedades requeridas; a seção que
// receberá os objetos criados é atribuída a uma constante gridItems e nesta constante são
// apensados como filhos cada produto recém-criado; por último é chamada a função que incluirá um
// listener aos produtos da lista.
const returnedProduct = (results) => {
  results.forEach((item) => {
    const obj = { sku: item.id, name: item.title, image: item.thumbnail };
    const prod = createProductItemElement(obj);
    const gridItems = document.querySelector('.items');
    gridItems.appendChild(prod);
  });
  putOnCartListener();
};

// função que carrega status do carrinho de compras ao abrir o navegador: os dados da chave
// cart_List são acessados e armazenados em uma constante storagedList; esta constante é impressa
// no elemento HTML referente ao carrinho de compras (classe 'cart__items); os itens do carrinho
// retornado recebem a condição de poder ser excluídos por um listener que chama a função
// cartItemClickListener para fazê-lo; por fim, o preço do carrinho recuperado é atualizado.
const loadCartSaved = () => {
  const storagedList = localStorage.getItem('cart_List');
  document.querySelector('.cart__items').innerHTML = storagedList;
  const cartItems = document.querySelector('.cart__items');
  cartItems.addEventListener('click', cartItemClickListener);
  priceUpdate();
};

// função que faz requisição à API do mercado livre: através do método fetch() é feita uma
// requisição à API do mercado livre tendo como parâmetro para este caso a string 'computador'
// (atribuída à constante QUERY); em caso de sucesso é chamada a função returnedProduct() passando
// como parâmetro o array de resultados da requisição (esta função irá montar uma lista de itens na
// tela em seguida); em caso de insucesso, um erro é lançado.
const apiInit = () => {
  const QUERY = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then(response => response.json())
    .then(data => returnedProduct(data.results))
    .catch((err) => {
      console.log('Erro no requisito #1', err);
    });
};

// função onload que é chamada após o carregamento da página HTML: primeiro é chamada a função que
// fará a requisição à API do Mercado Livre; a função de limpar o carrinho é iniciada; uma mensagem
// de Loading.. é carregada no carrinho de compras e removida após 1234ms; o carrinho de compras é
// restaurado do local storage.
window.onload = function onload() {
  apiInit();
  emptyCart();
  setTimeout(() => {
    (document.querySelector('.loading').remove());
  }, 1234);
  loadCartSaved();
};
