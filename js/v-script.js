const API_URL = "./goods.json";

const app = new Vue({
    el: '#app',
    data: {
        searchLine: '',
        isVisibleCart: false,
        goods: [],
        filteredGoods: [],
        cart: [],
    },
    methods: {

        searchHandler() {
            if (this.searchLine === '') {
                this.filteredGoods = this.goods;
            }
            const regexp = new RegExp(this.searchLine, 'gi');
            this.filteredGoods = this.goods.filter((good) => regexp.test(good.title));
        },

        addToCart(id) {

            this.cart.push(this.filteredGoods.find(good => good.id === id));

        },

        removeFromCart(id) {
            const goodIndex = this.cart.findIndex((item) => item.id == id);
            this.cart.splice(goodIndex, 1);
        },
//TODO:
/*         increment(id) {
            const goodIndex = this.cart.findIndex((item) => item.id == id);
            Vue.set(this.cart[goodIndex], 'quantity', quantity + 1 );
            console.log(this.cart[goodIndex].quantity);
        }, 

        decrement(id) {
            const goodIndex = this.cart.findIndex((item) => item.id == id);
            Vue.set(this.cart[goodIndex], 'quantity', quantity - 1 );
            console.log(this.cart[goodIndex].quantity);

            if (this.cart[index].quantity === 0) {
                this.removeFromCart(id);
            }
        },  */

        toggleCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },

        getCartTotal() {
            return this.cart.reduce(
                (accumulator, item) => accumulator + item.price,
                0
            )
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
