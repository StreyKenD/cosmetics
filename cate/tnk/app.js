let params = new URLSearchParams(window.location.href);

// todo: criptografar o localstorage ou utilizar cookies?
console.log(params.get('payment_id'));
console.log(params.get('status'));
console.log(params.get('payment_type'));
console.log(params.get('merchant_order_id'));

async function sendEmail() {
  if (params.get('status') === 'approved') {
    let data = {}
    data.checkout = JSON.parse(localStorage.getItem('checkout'))
    data.cart = localStorage.getItem('cart')
    
    data.payment_type = params.get('payment_type')
    // todo: alterar para o seu mail
    // 'me' seria para quem o email vai ser enviado quando for realizado uma compra
    // sendo que é para notificar ao vendedor uma compra
    // daria para fazer um historico de compras pelo back-end
    // onde ficaria salva todas as informações importantes
    data.me = 'vitor.22sk@gmail.com'
    
    await emailjs.send('service_95rf9qb', 'template_r43wi4r', data, 'user_zZvaLT48Hr1dzazfyBM8i')
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
        console.log('FAILED...', error);
      });

    await emailjs.send('service_95rf9qb', 'template_qnx5e8f', data, 'user_zZvaLT48Hr1dzazfyBM8i')
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
        console.log('FAILED...', error);
      });
  }
}

sendEmail()