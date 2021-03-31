const API_URL_GOODS = "/goods";
const API_URL_ADDCART = "/addToCart";
const API_URL_CART = "/cart";
const API_URL_DELETE = "/deleteItem";

Vue.component('search', {
    template: '<input type="text" v-model="searchLine" @input="emitInput" class="header__search" id="search"></input>',
    data() {
        return {
            searchLine: ''
        }
    },
    methods: {
        emitInput() {
            this.$emit('search-input', this.searchLine);
        }
    }
})

Vue.component('cart-component', {
    template: '<div><h2 class="cart__title">Cart</h2><ul class="cart__item-list"><slot></slot></ul><p class="cart__total">{{total}}</p></div>',
    props: ['total'],
})

Vue.component('empty', {
    template: '<p class="cart__empty">Нет товаров</p>'
})

Vue.component('add-btn', {
    template: '<button @click="emitAdd" class="shop__add-button btn"><slot></slot></button>',
    methods: {
        emitAdd() {
            this.$emit('add-to-cart');
        }
    }
})

Vue.component('shop-item', {
    template: '<li class="shop__item"><div class="shop__content"><img :src="img"><h3 class="shop__content-title">{{title}}</h3><p class="shop__content-price">${{price}}</p><slot></slot> </div></li>',
    props: ['id', 'title', 'price', 'img']
})

Vue.component('cart-item', {
    template: '<li class="cart-item"><img class="cart-item__thumb" :src="img"><h3 class="cart-item__title">{{title}}</h3><p class="cart-item__price">{{price}}</p><p class="cart-item__quantity">{{quantity}}</p><button class="cart-item__inc" @click="emitInc">+</button><button class="cart-item__dec" @click="emitDec">-</button></li>',
    props: ['id', 'title', 'price', 'img', 'quantity'],
    methods: {
        emitInc() {
            this.$emit('add-to-cart');
        },

        emitDec() {
            this.$emit('dec');
        }
    }
})

const app = new Vue({
    el: '#app',
    data: {
        isVisibleCart: false,
        goods: [],
        filteredGoods: [],
        cart: [],
        itemsInCart: 0,
    },
    methods: {

        searchHandler(line) {
            if (line === '') {
                this.filteredGoods = this.goods;
            }
            const regexp = new RegExp(line, 'gi');
            this.filteredGoods = this.goods.filter((good) => regexp.test(good.title));
        },

        toggleCart() {
            this.getCart();
            this.isVisibleCart = !this.isVisibleCart;
        },

        addToCart(id) {
            let data = {'id': id}
            this.fetchPost(data, API_URL_ADDCART);
            this.getCart();
        },

        deleteFromCart(id) {
            let data = {'id': id}
            this.fetchPost(data, API_URL_DELETE);
            this.getCart();
        }, 

        fetchPost(data, url) {
            data = JSON.stringify(data);
            let xhr;

            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window / ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                       JSON.parse(xhr.responseText);
                    } else if (xhr.status > 400) {
                       console.log('Something is wrong');
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.send(data);
        },

        fetch(error, success, url) {

            let xhr;

            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window / ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        success(JSON.parse(xhr.responseText));
                    } else if (xhr.status > 400) {
                        error('Something is wrong');
                    }
                }
            }

            xhr.open('GET', url, true);
            xhr.send();
        },

        fetchPromise(url) {
            return new Promise((resolve, reject) => {
                this.fetch(reject, resolve, url);
            })
        },

        getCart() {
            this.fetchPromise(API_URL_CART)
            .then(data => {
                let arr = data.map(el => el.id);
                let newArr = [];
                let count = 0;
                arr.forEach(el => {
                    count ++;
                    if (newArr.findIndex(item => item.id === el) != -1) {
                        let item = newArr.find(good => good.id === el);
                        item.quantity++;

                    } else {
                        let item = this.goods.find(good => good.id === el);
                    item.quantity = 1;
                    newArr.push(item);
                    }
                });
                this.cart = newArr;
                this.itemsInCart = count;
            })
            .catch(err => {
                console.log(err);
            })
        }
    },

    computed: {
        getCartTotal: function() {
            return this.cart.reduce(
                (accumulator, item) => accumulator + item.price * item.quantity,
                0
            )
        },
    },

    mounted() {
        this.fetchPromise(API_URL_GOODS)
        .then(data => {
            this.goods = data;
            this.filteredGoods = data;
        })
        .then(() => {
            this.getCart();
        })
        .catch(err => {
            console.log(err);
        })
    }
});
