const API_URL = "./goods.json";

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
    template: '<button @click="emitAdd" class="shop__add-button btn">Add to cart</button>',
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
            this.$emit('inc');
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
    },
    methods: {

        searchHandler(line) {
            if (line === '') {
                this.filteredGoods = this.goods;
            }
            const regexp = new RegExp(line, 'gi');
            this.filteredGoods = this.goods.filter((good) => regexp.test(good.title));
        },

        addToCart(id) {

           if (this.cart.some(good => good.id === id)) {

                this.increment(id);

            } else { 

                let item = this.filteredGoods.find(good => good.id === id);
            item.quantity = 1;
            this.cart.push(item);

            }

        },

        removeFromCart(id) {
            const goodIndex = this.cart.findIndex((item) => item.id == id);
            this.cart.splice(goodIndex, 1);
        },

 
        toggleCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },

        increment(id) {
            const goodIndex = this.cart.findIndex((item) => item.id == id);
            let newValue = this.cart[goodIndex];
            newValue.quantity ++;
            Vue.set(this.cart, goodIndex, newValue);
        }, 

        decrement(id) {
            const goodIndex = this.cart.findIndex((item) => item.id == id);
            let newValue = this.cart[goodIndex];
            newValue.quantity --;
            Vue.set(this.cart, goodIndex, newValue);

            if (this.cart[goodIndex].quantity === 0) {
                this.removeFromCart(id);
            }
        }, 

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
                        success(JSON.parse(xhr.responseText));
                    } else if (xhr.status > 400) {
                        error('Something is wrong');
                    }
                }
            }

            xhr.open('GET', API_URL, true);
            xhr.send();
        },

        fetchPromise() {
            return new Promise((resolve, reject) => {
                this.fetch(reject, resolve)
            })
        },


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
        this.fetchPromise()
        .then(data => {
            this.goods = data;
            this.filteredGoods = data;
            console.log(this.filteredGoods);
        })
        .catch(err => {
            console.log(err);
        })
    }
});
