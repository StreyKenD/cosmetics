const table = document.getElementById('table');
const rows = table.getElementsByTagName("tr");
const totalPrice = document.querySelector('.total');
const frete = document.getElementById('frete');
const fretePrice = document.getElementById('frete-price');
const freteDate = document.getElementById('frete-date');
const freteData = document.querySelector('.frete-data');

function beforePageLoad(){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartDiv = document.querySelector('cart');
    for (const product of cart) {
        var productDiv = document.createElement("div")

        let productName = product.product
        if (product.product === 'KIT VERÃO') {
            productName += '(' + product.scent + ')'
        } else if (product.product === 'Shampoo Natural') {
            productName += '(' + product.name + ')'
        }

        let priceCell = newRow.insertCell();
        let priceText = document.createTextNode(product.price);
        priceCell.appendChild(priceText);

        let quantCell = newRow.insertCell();
        if (typeof product.quantity === 'number' && product.quantity >= 1 && product.quantity <= 99) {
            quantCell.innerHTML =  '<a><i class="fa fa-plus"></i></a><label id="quant">' + product.quantity + '</label><a><i class="fa fa-minus"></i></a>';
        }

        let actionCell = newRow.insertCell();
        actionCell.innerHTML = '<a><i location='+ product.id +' class="fa fa-trash"></i></a>';
    }
    updatePrice();
}

function add(row){
    let quant = row.getElementsByTagName("label");
    if (quant.length > 0) {
        quant[0].innerText = parseInt(quant[0].innerText) + 1;
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
    if (quant.length > 0 && quant[0].innerText > 1) {
        quant[0].innerText = parseInt(quant[0].innerText) - 1;
        
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
    for (const row of rows) {
        const data = row.getElementsByTagName('td');
        if (data.length > 0) {
            const quant = data[2].innerText;
            const price = data[1].innerText;
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
    var row = row.parentNode.parentNode.parentNode;
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

for (const row of rows) {
    if (row.getElementsByTagName('i').length > 1) {
        let buttons = row.getElementsByTagName('i');
        buttons[0].addEventListener('click', function() { add(row); });
        buttons[1].addEventListener('click', function() { sub(row); });
        buttons[2].addEventListener('click', function() { remove(buttons[2]); } );
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
            freteData.style.display = "block";
            fretePrice.innerText = frete.data[0].Valor;
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
