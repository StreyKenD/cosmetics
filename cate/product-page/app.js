const sizes = document.querySelectorAll('.size');
const options1 = document.querySelectorAll('.option1');
const options2 = document.querySelectorAll('.option2');
const options3 = document.querySelectorAll('.option3');
const options4 = document.querySelectorAll('.option4');
const options5 = document.querySelectorAll('.option5');
const options6 = document.querySelectorAll('.option6');
const options7 = document.querySelectorAll('.option7');
const options8 = document.querySelectorAll('.option8-c');
const options9 = document.querySelectorAll('.option9');
const colors = document.querySelectorAll('.color');
const shoes = document.querySelectorAll('.shoe');
const gradients = document.querySelectorAll('.gradient');
const shoeBg = document.querySelector('.shoeBackground');
const price = document.querySelector('.price');
const product = document.querySelector('.big');
const buyButton = document.querySelector('.buy')
const form = document.getElementById('form');

let prevColor = "blue";
let animationEnd = true;

function changeSize(){
    sizes.forEach(size => size.classList.remove('active'));
    this.classList.add('active');
}

function changeOption1(){
    options1.forEach(option1 => option1.classList.remove('active'));
    this.classList.add('active');
}

function changeOption2(){
    options2.forEach(option2 => option2.classList.remove('active'));
    this.classList.add('active');
}

function changeOption3(){
    options3.forEach(option3 => option3.classList.remove('active'));
    this.classList.add('active');
}

function changeOption4(){
    options4.forEach(option4 => option4.classList.remove('active'));
    this.classList.add('active');
}

function changeOption5(){
    options5.forEach(option5 => option5.classList.remove('active'));
    this.classList.add('active');
}

function changeOption6(){
    options6.forEach(option6 => option6.classList.remove('active'));
    this.classList.add('active');
}

function changeOption7(){
    options7.forEach(option7 => option7.classList.remove('active'));
    this.classList.add('active');
}

function changeOption8(){
    const spans = Array.from(document.querySelectorAll('.option8'));
    let actual = spans.find(el => el.innerText === this.id);
    if ($('input[type=checkbox]:checked').length > 5 && !actual.classList.contains('active')) {
        actual.classList.remove('active');
        alert("Somente 5 podem ser selecionados");
        this.checked = false;
    } else {
        if (actual.classList.length > 1) {
            actual.classList.remove('active');
        } else {
            actual.classList.add('active');
        }
    }
}

function changeOption9(){
    options9.forEach(option9 => option9.classList.remove('active'));
    this.classList.add('active');
}

function changeColor(){
    if(!animationEnd) return;
    let primary = this.getAttribute('primary');
    let color = this.getAttribute('color');
    let shoe = document.querySelector(`.shoe[color="${color}"]`);
    let gradient = document.querySelector(`.gradient[color="${color}"]`);
    let prevGradient = document.querySelector(`.gradient[color="${prevColor}"]`);

    if(color == prevColor) return;

    colors.forEach(c => c.classList.remove('active'));
    this.classList.add('active');

    document.documentElement.style.setProperty('--primary', primary);
    
    shoes.forEach(s => s.classList.remove('show'));
    shoe.classList.add('show');

    gradients.forEach(g => g.classList.remove('first', 'second'));
    gradient.classList.add('first');
    prevGradient.classList.add('second');

    prevColor = color;
    animationEnd = false;

    gradient.addEventListener('animationend', () => {
        animationEnd = true;
    })
}

function submitForm() {
    let formData = new FormData(form);
    let data = {};
    for (let newData of formData.entries()) {
        if (newData[0] === 'effect') {
            if (data[newData[0]] !== undefined && data[newData[0]] !== null) {
                data[newData[0]].push(newData[1]);
            } else {
                data[newData[0]] = [newData[1]];
            }
        } else {
            data[newData[0]] = newData[1];
        }
    }

    data.product = product.innerText;
    if (data.product === "Shampoo Natural") {
        let name = document.getElementById('name');
        data.name = name.value;
    }

    let priceData = price.getElementsByTagName("h1");
    let priceFormated = parseFloat(priceData[0].innerText.split('R$')[1].replace(',', '.'));
    data.price = priceFormated;
    
    data.quantity = 1;
    
    let orders = JSON.parse(localStorage.getItem("cart")) || [];

    const valueExist = orders.find(o => valueExists(o, data));
    if (valueExist) {
        valueExist.quantity += 1;
    } else {
        if (orders.length >= 1) {
            console.log(orders.length);
            data.id = orders[orders.length - 1].id + 1;
        } else {
            data.id = orders.length + 1;
        }
        orders.push(data);
    }
    
    localStorage.setItem("cart", JSON.stringify(orders));

    form.submit();
}

sizes.forEach(size => size.addEventListener('click', changeSize));
colors.forEach(c => c.addEventListener('click', changeColor));
options1.forEach(option1 => option1.addEventListener('click', changeOption1));
options2.forEach(option2 => option2.addEventListener('click', changeOption2));
options3.forEach(option3 => option3.addEventListener('click', changeOption3));
options4.forEach(option4 => option4.addEventListener('click', changeOption4));
options5.forEach(option5 => option5.addEventListener('click', changeOption5));
options6.forEach(option6 => option6.addEventListener('click', changeOption6));
options7.forEach(option7 => option7.addEventListener('click', changeOption7));
options8.forEach(option8 => option8.addEventListener('change', changeOption8));
options9.forEach(option9 => option9.addEventListener('click', changeOption9));
buyButton.addEventListener('click', submitForm)

function valueExists(o, data){
    if (data.product === "KIT VERÃO") {
        if (data.scent === o.scent) {
            return true;
        } else {
            return false;
        }
    }
}

let x = window.matchMedia("(max-width: 1000px)");

function changeHeight(){
    if(x.matches){
        let shoeHeight = shoes[0].offsetHeight;
        shoeBg.style.height = `${shoeHeight * 0.9}px`;
    }
    else{
        shoeBg.style.height = "475px";
    }
}

changeHeight();

window.addEventListener('resize', changeHeight);