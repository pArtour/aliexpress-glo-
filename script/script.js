document.addEventListener('DOMContentLoaded',  () => {
  
  const search = document.querySelector('.search'),
        cartBtn = document.getElementById('cart'),
        wishListBtn = document.getElementById('wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart'),
        category = document.querySelector('.category');

  let wishList = [];

  const loading = () => {
    goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading">
    <div><div><div></div>
    </div><div><div></div></div>
    <div><div></div></div><div>
    <div></div></div></div></div></div>`
  };
  
  const createCardGoods = (id, title, price, img) => {
    
    const card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = `<div class="card">
                  <div class="card-img-wrapper">
                  <img class="card-img-top" src="${img}" alt="">
                    <button class="card-add-wishlist" data-goods-id="${id}"></button>
                  </div>
                  <div class="card-body justify-content-between">
                  <a href="#" class="card-title">${title}</a>
                  <div class="card-price">${price} ₽</div>
                    <div>
                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                    </div>
                  </div>
                  </div>`;
                
    return card;
  };
  
  const renderCard = goods => {
    goodsWrapper.textContent = '';
    if (goods.length) {
      goods.forEach(({id, title, price, imgMin}) => {
        goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = '☠ Товаров по вашему запросу нет';
    } 
  };

  const closeCard = event => {
    const target = event.target;
    if (target === cart || target.classList.contains('cart-close') || event.keyCode === 27) {
      cart.style.display = '';  
      document.removeEventListener('keyup', closeCard);
    }
  };
  
  const openCart = event => {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCard);
  };
  
  const getGoods = (handler, filter) => {
    loading();
    fetch('db/db.json')
        .then(responce => responce.json())
        .then(filter)
        .then(handler);
  };
  
  //Рандомная ортировка
  const randomSort = item => item.sort(() => Math.random() - 0.5);

  const chooseCategory = event => {
    const target  = event.target;
    event.preventDefault();
    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
    }
  };
  const searchGoods = event => {
    event.preventDefault();

    const input  = event.target.elements.searchGoods,
          inputValue = input.value.trim();
    if (inputValue !== '') {
      const searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
    } else {
      search.classList.add('error');
      setTimeout(() => {
        search.classList.remove('error');
      }, 2000);
    }
    input.value = '';
  };


  const toggleWishList = (id, elem) => {
    if (wishList.indexOf(id) + 1) {
      wishList.splice(wishList.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishList.push(id);
      elem.classList.add('active');
    }
  };

  const handlerGoods = event => {
    const target = event.target;
    if (target.classList.contains('card-add-wishlist')) {
      toggleWishList(target.dataset.goodsId, target);
    } 
  };

  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCard);
  category.addEventListener('click', chooseCategory);
  search.addEventListener('submit', searchGoods);
  goodsWrapper.addEventListener('click', handlerGoods);

  getGoods(renderCard, randomSort);
});