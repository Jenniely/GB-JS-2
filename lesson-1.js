const goods = [
    { title: 'Shirt', price: 150, img: "./img/man.jpg" },
    { title: 'Socks', price: 50, img: "./img/man.jpg" },
    { title: 'Jacket', price: 350, img: "./img/man.jpg" },
    { title: 'Shoes', price: 250, img: "./img/man.jpg" },
    { title: 'Shoes', price: 250, img: "./img/man.jpg" },
    { title: 'Shoes', price: 250, img: "./img/man.jpg" },
];

const cartItems = [];

const shop = document.querySelector('.shop__item-list');
const cart = document.querySelector('.cart');
const cartShowButton = document.querySelector('.shop__cart-show');

const toggleCart = () => {
    cart.classList.toggle('hidden');
}
  
const renderGoodsItem = ({ title = "Item", price = 0, img = "#" }) => {
    return `<li class="shop__item">
    <div class="shop__content">
    <img src=${img}>
    <h3 class="shop__content-title">${title}</h3>
    <p  class="shop__content-price">$${price}</p>
    <button class="shop__add-button">Add to cart</button>
    </div>
    </li>`;
};
  
const renderGoodsList = (list = []) => {
    shop.insertAdjacentHTML('beforeend', list.map(renderGoodsItem).join(''));
}

function updateCart() {

    let totalSpan = document.getElementById('cart-total');
    let total = 0;

    if (cartItems.length == 0) {
        empty.classList.remove('hidden');
    } else empty.classList.add('hidden');

    cartItems.forEach(cartItem => {
        let product = products.find(product => product.id == cartItem.id);

        total += product.price*cartItem.count;
        quantity += cartItem.count;

        let row = document.createElement('li');
        row.classList.add('cart-items-item');
        list.appendChild(row);

        let rowName = document.createElement('p');
        rowName.classList.add('cart-items-item-name');
        row.appendChild(rowName);

        let itemQuantity = document.createElement('p');
        itemQuantity.classList.add('cart-items-item-quantity');
        row.appendChild(itemQuantity);

        let btnGroup = document.createElement('div');
        row.appendChild(btnGroup);

        let inc = document.createElement('button');
        inc.classList.add('cart-items-increment');
        inc.value = product.id;
        inc.innerHTML = '+';
       

        let dec = document.createElement('button');
        dec.classList.add('cart-items-decrement');
        dec.value = product.id;
        dec.innerHTML = '-';

        btnGroup.appendChild(inc);
        btnGroup.appendChild(dec);

   inc.addEventListener('click', function () {
    addToCart(event.target.value);
});
        dec.addEventListener('click', function () {
            delFromCart(event.target.value);
        });

        rowName.innerHTML = product.title;
        itemQuantity.innerHTML = cartItem.count;
    })
    totalSpan.innerHTML = total;
    quantitySpan.innerHTML = quantity;
}


function addToCart(id) {
    let ind = cartItems.findIndex(el => el.id === id);
    if (ind == -1) {
        cartItems.push({id: id, count: 1});
    } else {
        cartItems[ind].count += 1;
    }
    updateCart();
}

function delFromCart(id) {
    let ind = cartItems.findIndex(el => el.id == id);
    if (cartItems[ind].count == 1) {
        cartItems.splice(ind, 1);
    } else {
        cartItems[ind].count -= 1;
    }
    updateCart();
}

cartShowButton.addEventListener('click', toggleCart);

window.onload = renderGoodsList(goods);