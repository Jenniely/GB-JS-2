class RenderOption {
    constructor(options, type, name) {
        this.options = options;
        this.type = type;
        this.name = name;
    }

    getHtml() {
        let fields = this.options.map((option) => `<input type="${this.type}" name="${this.name}" id="${option.name}" value="${option.name}" class="burger-form__select"/><label class="burger-form__select-label" for="${option.name}">${option.name}</label>`).join('');
        return `<fieldset class="burger-form__${this.name}">
    <legend class="burger-form__legend">Choose ${this.name}</legend>
    ${fields}
</fieldset>`
    }
}

class Burger {

    constructor() {
        this.container = document.querySelector('.burger-form');
        this.sizes = [
            {
                'name': 'big',
                'price': 100,
                'calories': 40,
                'selected': 0,
            },
            {
                'name': 'small',
                'price': 50,
                'calories': 20,
                'selected': 0,
            },
        ];
        this.fillings = [{
            'name': 'cheese',
            'price': 10,
            'calories': 20,
            'selected': 0,
        },
        {
            'name': 'salad',
            'price': 20,
            'calories': 5,
            'selected': 0,
        },
        {
            'name': 'fries',
            'price': 15,
            'calories': 10,
            'selected': 0,
        },
        ];
        this.additions = [{
            'name': 'spice',
            'price': 15,
            'calories': 0,
            'selected': 0,
        },
        {
            'name': 'mayo',
            'price': 20,
            'calories': 5,
            'selected': 0,
        },
        ];

    }

    renderForm() {
        this.container.textContent = '';
        const renderSize = new RenderOption(this.sizes, 'radio', 'sizes');
        const renderFillings = new RenderOption(this.fillings, 'checkbox', 'fillings');
        const renderAdditions = new RenderOption(this.additions, 'checkbox', 'additions');

        let formHtml = `${renderSize.getHtml()} ${renderFillings.getHtml()} ${renderAdditions.getHtml()} <p class="burger__price "> </p><p class="burger__nutrition"> </p>`;
        this.container.insertAdjacentHTML('beforeend', formHtml);
        let inputs = document.querySelectorAll('.burger-form__select');
        inputs.forEach(input => input.addEventListener('change', handleChange));
    }


    getPrice() {
        let selectedSize = this.sizes.filter(item => item.selected);
        let selectedFillings = this.fillings.filter(item => item.selected);
        let selectedAdditions = this.additions.filter(item => item.selected);
        return selectedSize.reduce(
            (accumulator, size) => accumulator + size.price,
            0
        ) +
        selectedFillings.reduce(
            (accumulator, filling) => accumulator + filling.price,
            0
        ) +
        selectedAdditions.reduce(
            (accumulator, addition) => accumulator + addition.price,
            0
        );
    }

    getNutrition() {
       let selectedSize = this.sizes.filter(item => item.selected);
        let selectedFillings = this.fillings.filter(item => item.selected);
        let selectedAdditions = this.additions.filter(item => item.selected);
        return selectedSize.reduce(
            (accumulator, size) => accumulator + size.calories,
            0
        ) +
        selectedFillings.reduce(
            (accumulator, filling) => accumulator + filling.calories,
            0
        ) +
        selectedAdditions.reduce(
            (accumulator, addition) => accumulator + addition.calories,
            0
        );
    }
}

function handleChange(e) {
    console.log(e.target.checked);
    let i = burgerInstance[e.target.name].findIndex(el => el.name == e.target.value);
    if (this.checked) {
    burgerInstance[e.target.name][i].selected = 1;
    } else {
        burgerInstance[e.target.name][i].selected = 0;
    }
    
    if (e.target.name == 'sizes') {
        burgerInstance[e.target.name].map((el, index) => {
            if (index !== i) {
                el.selected = 0;
            }
        });
    }
    let price = document.querySelector('.burger__price');
    let nutrition = document.querySelector('.burger__nutrition');

    price.innerHTML = `Cost: ${burgerInstance.getPrice()} `;
    nutrition.innerHTML = `Calories: ${burgerInstance.getNutrition()} `;
}
const burgerInstance = new Burger;
window.onload = () => {
    burgerInstance.renderForm();
}
