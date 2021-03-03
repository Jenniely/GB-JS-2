const goods = [
    { title: 'Shirt', price: 150, img: "./img/man.jpg" },
    { title: 'Socks', price: 50, img: "./img/man.jpg" },
    { title: 'Jacket', price: 350, img: "./img/man.jpg" },
    { title: 'Shoes', price: 250, img: "./img/man.jpg" },
    { title: 'Shoes', price: 250, img: "./img/man.jpg" },
    { title: 'Shoes', price: 250, img: "./img/man.jpg" },
];

const cart = document.querySelector('.cart__item-list');
  
const renderCartItem = ({ title = "Item", price = 0, img = "#" }) => {
    return `<li class="cart__item"><div class="cart__content"><img src=${img}><h3 class="cart__content-title">${title}</h3><p  class="cart__content-price">$${price}</p></div></li>`;
};
  
const renderCart = (list = goods) => {
    cart.insertAdjacentHTML('beforeend', list.map(
        item => renderCartItem(item)
    ).join(''));
}

window.onload = renderCart();