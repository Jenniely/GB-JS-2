const str = "He said 'I'll never forget you.' It was the best moment of my life. Yogi Berra famously said, 'A nickel ain't worth a dime anymore.' ";
const regex = /\s[']|[']\s|[']$/g;
const newStr = str.replace(regex, '"');
console.log(newStr);

class Form {
    constructor() {
        this.form = document.querySelector('form');
        this.formData = {
            name : '',
            email : '',
            phone : '',
            message : '',
        }
        this.inputs = document.querySelectorAll('fieldset input');
        this.submit = document.querySelector('button');
        this.errors = document.querySelectorAll('.form__error');
        this.inputs.forEach(input => input.addEventListener('change', (e) => this.handleChange(e)));
        this.submit.addEventListener('click', (e) => this.handleSubmit(e));
    }

    handleChange(e) {
        e.target.classList.remove('warning');
        const { target: { name, value } } = e;
        this.formData[name] = value;
    }

    handleSubmit(e) {

        e.preventDefault();

        let patterns = {
            name : new RegExp('[A-Za-z ]+', 'g'),
            phone : new RegExp('^[\+][7][(][0-9]{3}[)][0-9]{3}[-]?[0-9]{4}$', 'g'),
            email : new RegExp('[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+', 'g'),
        }
        let pass = true;

        Object.keys(patterns).forEach((key, index) => {
            if (patterns[key].exec(this.formData[key]) === null) {
                this.inputs[index].classList.add('warning');
                this.errors[index].classList.remove('hidden');
                pass = false;
            } else {
                this.errors[index].classList.add('hidden');
            }
        })

        if (pass) {
            console.log('pass');
        }
    }
}

let check = new Form();


