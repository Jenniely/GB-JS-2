class Cart {

    constructor() {
        this.container = document.querySelector('.cart__item-list');
        this.items = [];
        this.totalContainer = document.querySelector('.cart__total');
        this.header = new Header();

        this.header.setButtonHandler((event) => {
            this.toggleCart(event);
        })

    }

    showCart() {
        let cartContainer = document.querySelector('.cart');
        let button = document.querySelector('.header__cart-show');
        cartContainer.classList.remove('hidden');
        button.innerText = 'Hide cart';
    }

    hideCart() {
        let cartContainer = document.querySelector('.cart');
        let button = document.querySelector('.header__cart-show');
        cartContainer.classList.add('hidden');
        button.innerText = 'Show cart'
    }

    toggleCart(event) {
        let cartContainer = document.querySelector('.cart');
        cartContainer.classList.toggle('hidden');
        cartContainer.classList.contains('hidden') ? event.target.innerText = 'Show cart' : event.target.innerText = 'Hide cart';
        this.render();
    }

    getTotal() {
        return this.items.reduce(
            (accumulator, item) => accumulator + item.price * item.quantity,
            0
        )
    }

    render() {
        this.container.textContent = '';
        let empty = document.querySelector('.cart__empty');
        empty.classList.add('hidden');
        if (this.items.length === 0) {
            empty.classList.remove('hidden');
        }

        this.items.forEach(
            item => {
                this.container.insertAdjacentHTML('beforeend', item.getHtml());
            }
        )
        let incButtons = document.querySelectorAll('.cart-item__inc ');
        incButtons.forEach(button => button.addEventListener('click', (e) => this.addToCart(e.target.value)));
        let decButtons = document.querySelectorAll('.cart-item__dec ');
        decButtons.forEach(button => button.addEventListener('click', (e) => this.decrement(e.target.value)));

        this.totalContainer.innerHTML = `Your total: ${this.getTotal()}`;
    }

    addToCart(idToAdd) {
        idToAdd = parseInt(idToAdd);
        try {
            if (this.items.some(good => good.id === idToAdd)) {
                let index = this.items.findIndex(item => item.id === idToAdd);
                this.items[index].quantity++;
            } else {
                let { id, title, price, img } = list.goods.find(item => item.id === idToAdd);
                this.items.push(new CartItem(id, title, price, img));
            }
            this.render();
            this.showCart();
        } catch (error) {
            console.log(error);
        }
    }

    decrement(idToDec) {
        idToDec = parseInt(idToDec);
        try {
            let index = this.items.findIndex(item => item.id === idToDec);
            this.items[index].quantity--;

            if (this.items[index].quantity === 0) {
                this.delFromCart(idToDec)
            }
            this.render();
        } catch (error) {
            console.log(error);
        }
    }

    delFromCart(idToDel) {
        idToDel = parseInt(idToDel);
        try {
            let index = this.items.findIndex(item => item.id === idToDel);
            this.items.splice(index, 1);
            this.render();
        } catch (error) {
            console.log(error);
        }
    }
}

class CartItem {

    constructor(id, title, price, img) {
        this.id = id;
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
        <p class="cart-item__quantity">${this.quantity}</p>
        <button class="cart-item__inc" value="${this.id}">+</button>
        <button class="cart-item__dec" value="${this.id}">-</button>
        </div>
        </li>`;
    }
}

class Good {
    constructor(id, title, price, img) {
        this.id = id;
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
        <button class="shop__add-button btn" value=${this.id}>Add to cart</button>
        </div>
        </li>`;
    }
}

class Api {

    constructor() {
        this.url = "./goods.json";
    }

    fetch(error, success) {

        let xhr;

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window / ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    success(xhr.responseText);
                } else if (xhr.status > 400) {
                    error('Something is wrong');
                }
            }
        }

        xhr.open('GET', this.url, true);
        xhr.send();
    }

    fromJSON(data) {
        return new Promise((resolve) => {
            resolve(JSON.parse(data));
        })
    }

    fetchPromise() {
        return new Promise((resolve, reject) => {
            this.fetch(reject, resolve)
        })
    }
}

class Header {
    constructor() {
        this.search = document.querySelector('.header__search');
        this.button = document.querySelector('.header__cart-show');
    }

    setSearchHandler(callback) {
        this.search.addEventListener('input', callback);
    }

    setButtonHandler(callback) {
        this.button.addEventListener('click', callback);
    }
}

class GoodsList {

    constructor() {
        this.api = new Api();
        this.header = new Header();
        this.container = document.querySelector('.shop__item-list');
        this.goods = [];
        this.filteredGoods = [];

        this.header.setSearchHandler((event) => {
            this.search(event.target.value);
        })

        this.api.fetchPromise()
            .then((response) => this.api.fromJSON(response))
            .then((data) => { this.onFetchSuccess(data) })
            .catch((err) => { this.onFetchError(err) });
    }

    onFetchSuccess(data) {
        this.goods = data.map(({ id, title, price, img }) => new Good(id, title, price, img));
        this.filteredGoods = this.goods;
        this.render();
    }

    onFetchError(err) {
        this.container.insertAdjacentHTML('beforeend', `<h3>${err}</h3>`)
    }

    getTotal() {
        return this.goods.reduce(
            (accumulator, good) => accumulator + good.price,
            0
        )
    };

    search(str) {
        if (str === '') {
            this.filteredGoods = this.goods;
        }
        const regexp = new RegExp(str, 'gi');
        this.filteredGoods = this.goods.filter((good) => regexp.test(good.title));
        this.render();
    }


    render() {
        this.container.textContent = '';
        this.filteredGoods.forEach(
            good => this.container.insertAdjacentHTML('beforeend', good.getHtml())
        )

        let buttons = document.querySelectorAll('.shop__add-button');
        buttons.forEach(button => button.addEventListener('click', (e) => cartInstance.addToCart(e.target.value)));
    }
}
const cartInstance = new Cart;
const list = new GoodsList;
const app = new Vue({
    el: '#app',
    data: {
        searchLine: '',
        isVisibleCart: false,
        goods: [
            { "id": 1, "title": "Shirt", "price": 150, "img": "./img/man.jpg" },
            { "id": 2, "title": "Socks", "price": 50, "img": "./img/man.jpg" },
            { "id": 3, "title": "Jacket", "price": 350, "img": "./img/man.jpg" },
            { "id": 4, "title": "Shoes", "price": 250, "img": "./img/man.jpg" }
        ]
    },
    methods: {
        add() {
            this.goods.push();
        }
    }
});
