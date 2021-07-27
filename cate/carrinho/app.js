const table = document.getElementById('table');
const totalPrice = document.querySelector('.total');
const frete = document.getElementById('frete');
const fretePrice = document.getElementById('frete-price');
const freteDate = document.getElementById('frete-date');
let items = null

function beforePageLoad(){
    const cartDiv = document.querySelector('.cart');
    let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
    for (const product of cartProducts) {

        let item = document.createElement("div")
        item.classList.add("item")

        let row1 = document.createElement("div")
        row1.classList.add("row")

        let row2 = document.createElement("div")
        row2.classList.add("row")

        let productDiv = document.createElement("div")
        productDiv.classList.add("col-75")

        let removeDiv = document.createElement("div")
        removeDiv.classList.add("col-25")

        let priceDiv = document.createElement("div")
        priceDiv.classList.add("col-75")

        let quantityDiv = document.createElement("div")
        quantityDiv.classList.add("col-25")

        let productName = product.product
        if (product.product === 'KIT VERÃO') {
            productName += '(' + product.scent + ')'
        } else if (product.product === 'Shampoo Natural') {
            productName += '(' + product.name + ')'
        }

        productDiv.innerText = productName
        if (typeof product.id === 'number') {
            removeDiv.innerHTML = '<a><i location='+ product.id +' class="fa fa-trash"></i></a>';
        }

        if (typeof product.price === 'number') {
            priceDiv.innerHTML = '<label id="quant">R$ ' + product.price + '</label>'
        }
        if (typeof product.quantity === 'number' && product.quantity >= 1 && product.quantity <= 99) {
            quantityDiv.innerHTML = '<a><i class="fa fa-plus"></i></a><label id="quant">' + product.quantity + '</label><a><i class="fa fa-minus"></i></a>';
        }

        const hr = document.createElement("hr")
        hr.classList.add("solid");

        row1.appendChild(productDiv)
        row1.appendChild(removeDiv)
        row2.appendChild(priceDiv)
        row2.appendChild(quantityDiv)

        item.appendChild(row1)
        item.appendChild(row2)
        item.appendChild(hr)

        cartDiv.appendChild(item)
    }
    items = document.querySelectorAll('.item');
    updatePrice();
}

function add(row){
    let quant = row.getElementsByTagName("label");
    if (quant.length > 0) {
        quant[1].innerText = parseInt(quant[1].innerText) + 1;
    }
    let orders = JSON.parse(localStorage.getItem('cart'));
    const location = row.querySelector('.fa-trash');
    const id = parseInt(location.getAttribute('location'));
    let product = orders.find(order => order.id === id);
    product.quantity += 1;

    localStorage.setItem("cart", JSON.stringify(orders));
    updatePrice();
}

function sub(row){
    let quant = row.getElementsByTagName("label");
    let orders = JSON.parse(localStorage.getItem('cart'));
    if (quant.length > 0 && quant[1].innerText > 1) {
        quant[1].innerText = parseInt(quant[1].innerText) - 1;
        
        const location = row.querySelector('.fa-trash');
        const id = parseInt(location.getAttribute('location'));
        let product = orders.find(order => order.id === id);
        product.quantity -= 1;
    }

    localStorage.setItem("cart", JSON.stringify(orders));
    updatePrice();
}

function updatePrice(){
    let total = null;
    for (const item of items) {
        const data = item.getElementsByTagName('label');
        if (data.length > 0) {
            const quant = data[1].innerText;
            const price = data[0].innerText.split(' ')[1];
            total += quant * price;
        }
    }
    if (total !== null) {
        totalPrice.innerText = 'Total: R$' + parseFloat(total).toFixed(2) ;
    } else {
        totalPrice.innerText = 'Total: R$ 0,00';
    }
    if (fretePrice.innerText !== '') {
        totalPrice.innerText = 'Total: R$' + parseFloat(total + parseFloat(fretePrice.innerText)).toFixed(2);
    }
}

function remove(row){
    var row = row.parentNode.parentNode.parentNode.parentNode;
    row.parentNode.removeChild(row);

    let orders = JSON.parse(localStorage.getItem('cart'));
    const location = row.querySelector('.fa-trash');
    const id = parseInt(location.getAttribute('location'));
    const index = orders.indexOf(orders.find(order => order.id === id));

    if (index > -1) {
        orders.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(orders));
}

beforePageLoad();

for (const item of items) {
    if (item.getElementsByTagName('i').length > 1) {
        let buttons = item.getElementsByTagName('i');
        buttons[1].addEventListener('click', function() { add(item); });
        buttons[2].addEventListener('click', function() { sub(item); });
        buttons[0].addEventListener('click', function() { remove(buttons[2]); } );
    }
};

frete.addEventListener('keyup', function() { getFreteData(); } );

function getFreteData(){
    let cepRegExp = /^[0-9]{5}-[0-9]{3}$/;
    const isValidCep = cepRegExp.test(frete.value);
    if (isValidCep) {
        fetch("http://127.0.0.1:3333/frete", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(frete) {
            fretePrice.innerText = frete.data[0].Valor.replace(',', '.');
            freteDate.innerText = frete.data[0].PrazoEntrega;
            updatePrice();
        })
        .catch(function(e) {
            console.log(e);
            alert("Unexpected error");
            $('#checkout-btn').attr("disabled", false);
        });
    }
}
