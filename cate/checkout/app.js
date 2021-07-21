const orders = JSON.parse(localStorage.getItem('cart'));
const button = document.querySelector('.cho-container');

// Todo: alterar quando for para producao
const mp = new MercadoPago('TEST-7ebe3293-81b4-418f-bfba-8c6b3970278e', {
    locale: 'pt-BR'
});

function checkout(){

    let orderDatas = [];
    for (const order of orders) {
        let orderData = {};
        orderData.description = order.product;
        orderData.price = order.price;
        orderData.quantity = order.quantity;
        orderDatas.push(orderData);
    }
      
    fetch("http://127.0.0.1:3333/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderDatas),
      })
        .then(function(response) {
            console.log(response);
            return response.json();
        })
        .then(function(preference) {
            console.log(preference);
            createCheckoutButton(preference.id);
            $(".shopping-cart").fadeOut(500);
            setTimeout(() => {
                $(".container_payment").show(500).fadeIn();
            }, 500);
        })
        .catch(function(e) {
            console.log(e);
            alert("Unexpected error");
            $('#checkout-btn').attr("disabled", false);
        });
  }
  
//Create preference when click on checkout button
function createCheckoutButton(preference) {
    
    mp.checkout({
        preference: {
            id: preference
        },
        autoOpen: true, // Habilita a abertura automática do Checkout Pro
      });
  }

document.getElementById("checkout-btn").addEventListener("click", checkout);
