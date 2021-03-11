class Cart {

    constructor() {
        this.container = document.querySelector('.cart__item-list');
        this.items = [];
        this.totalContainer = document.querySelector('.cart__total');
    }

    showCart() {
        let cartContainer = document.querySelector('.cart');
        cartContainer.classList.remove('hidden');
        cartShowButton.innerText = 'Hide cart';
    }

    hideCart() {
        let cartContainer = document.querySelector('.cart');
        cartContainer.classList.add('hidden');
        cartShowButton.innerText = 'Show cart'
    }

    toggleCart(event) {
        let cartContainer = document.querySelector('.cart');
        cartContainer.classList.toggle('hidden');
        cartContainer.classList.contains('hidden') ? event.target.innerText = 'Show cart' : event.target.innerText = 'Hide cart';
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

        if(this.items[index].quantity === 0) {
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
        this.url = "../goods.json";
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

class GoodsList {

    constructor() {
        this.api = new Api();
        this.container = document.querySelector('.shop__item-list');
        this.goods = [];

        this.api.fetchPromise()
            .then((response) => this.api.fromJSON(response))
            .then((data) => { this.onFetchSuccess(data) })
            .catch((err) => { this.onFetchError(err) });
    }

    onFetchSuccess(data) {
        this.goods = data.map(({ id, title, price, img }) => new Good(id, title, price, img));
        this.render();
    }

    onFetchError(err) {
        this.container.insertAdjacentHTML('beforeend', '<h3>${err}</h3>')
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

        let buttons = document.querySelectorAll('.shop__add-button');
        buttons.forEach(button => button.addEventListener('click', (e) => cartInstance.addToCart(e.target.value)));
    }
}

const cartInstance = new Cart;
cartInstance.render();
const list = new GoodsList;
const cartShowButton = document.querySelector('.shop__cart-show');
cartShowButton.addEventListener('click', (event) => cartInstance.toggleCart(event));

