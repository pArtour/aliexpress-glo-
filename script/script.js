document.addEventListener('DOMContentLoaded',  () => {
  
  const search = document.querySelector('.search'),
        cartBtn = document.getElementById('cart'),
        wishListBtn = document.getElementById('wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart');


        
        
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
    goods.forEach(({id, title, price, imgMin}) => {
      goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
    });
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
    fetch('db/db.json')
        .then(responce => responce.json())
        .then(filter)
        .then(handler)
  };
  
  //Рандомная ортировка
  const randomSort = item => {
    return item.sort(() => Math.random() - 0.5);
  }



  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCard);
  
  getGoods(renderCard, randomSort);
});