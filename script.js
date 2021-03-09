class Good {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
    }

    getHtml = () => {
        return `<li class="shop__item">
        <div class="shop__content">
        <img src=${this.img}>
        <h3 class="shop__content-title">${this.title}</h3>
        <p  class="shop__content-price">$${this.price}</p>
        <button class="shop__add-button btn">Add to cart</button>
        </div>
        </li>`;
    }
}

class ApiMock {

    constructor() {
        this.names = ['Shirt', 'Jacket', 'Shoes', 'Socks', 'Hat'];
        this.colors = ['Red', 'White', 'Yellow', 'Black', 'Blue'];
    }

    getNumber(max) {
        return Math.floor(Math.random() * (max));
    };

    getRandomName() {
        return `${this.colors[this.getNumber(this.colors.length)]} ${this.names[this.getNumber(this.names.length)]}`
    };

    fetch() {
        return Array(this.getNumber(10)).fill('').map(() => ({title: this. getRandomName(), price: this.getNumber(999), img: './img/man.jpg'}))
    }

}

class GoodsList {

    constructor() {
        this.api = new ApiMock();
        this.container = document.querySelector('.shop__item-list');
        this.goods = [];
    }

    fetchGoods() {
        this.goods = this.api.fetch().map(({ title, price, img }) => new Good(title, price, img));
    }

    getTotal() {
        return this.goods.reduce(
            (accumulator, good) => accumulator + good.price,
            0
        )
    };

    render() {
        this.container.textContent = '';
        this.goods.forEach(
            good => this.container.insertAdjacentHTML('beforeend', good.getHtml())
        )
    }
}

class Cart {

    constructor() {
        this.container = document.querySelector('.cart');
        this.items = [];
    }

    toggleCart() {
        cartInstance.container.classList.toggle('hidden');
        cartInstance.container.classList.contains('hidden') ? this.innerText = 'Show cart' : this.innerText = 'Hide cart';
    }

    render() {
        this.container.textContent = '';
        this.items.forEach(
            item => this.container.insertAdjacentHTML('beforeend', item.getHtml())
        )
    }
}

class CartItem {

    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.quantity = 1;
    }

    getHtml = () => {
        return `<li class="cart-item">
        <img class="cart-item__thumb" src=${this.img}>
        <h3 class="cart-item__title">${this.title}</h3>
        <p class="cart-item__price">$${this.price}</p>
        <p class="cart-item__quantity">$${this.quantity}</p>
        <button class="cart-item__inc">+</button>
        <button class="cart-item__inc">-</button>
        </div>
        </li>`;
    }

}

const list = new GoodsList;
const cartInstance = new Cart;
const cartShowButton = document.querySelector('.shop__cart-show');
cartShowButton.addEventListener('click', cartInstance.toggleCart);

window.onload = () => {
    list.fetchGoods();
    list.render();
}

