'use strict'

// const Mail = use('Mail')
const emailjs = require('emailjs-com')

// SDK do Mercado Pago
const mercadopago = require ('mercadopago');
// Adicione as credenciais
mercadopago.configure({
  access_token: 'TEST-1921516331386303-071823-3258e0b98ff541b47d27791f26ff401f-793311618'
});

const {calcularPrecoPrazo} = require('correios-brasil');

class CheckoutController {
  async store({request, response}) {
    let datas = Object.values(request.body);
    console.log(datas);
    
    let preference = {
      // Example:
      // payer: {
      //   name: "TETE5933132",
      //   surname: "TETE5933132",
      //   email: "test_user_42261136@testuser.com",
      //   date_created: "2015-06-02T12:58:41.425-04:00",
      //   phone: {
      //     area_code: "11",
      //     number: 4444-4444
      //   },
        
      //   identification: {
      //     type: "CPF",
      //     number: "19119119100"
      //   },
        
      //   address: {
      //     street_name: "Street",
      //     street_number: 123,
      //     zip_code: "06233200"
      //   }
      // },
      items: [
        // Example:
        // {
          // title: request.body,
          // unit_price: Number(request.body),
          // quantity: Number(request.body),
          // title: request.body.description,
          // unit_price: Number(request.body.price),
          // quantity: Number(request.body.quantity),
          // }
      ],
      back_urls: {
        "success": "https://affectionate-boyd-6948e4.netlify.app/tnk/obrigado.html",
        // "success": "https://cosmetics-main.netlify.app/tnk/obrigado.html",
        "failure": "http://localhost:8080/feedback",
        "pending": "http://localhost:8080/feedback"
      },
      auto_return: 'approved',
    };

    for (const data of datas) {
      let newData = {
        title: data.description,
        unit_price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
      }
      preference.items.push(newData)
    }
    let id = null
    await mercadopago.preferences.create(preference)
      .then(function(res){
        // console.log(response);
        // console.log(res);
        // Este valor substituirá a string "<%= global.id %>" no seu HTML
        // response.send({id: res.body.id})
        console.log(res.body.id);
        id = res.body.id
      }).catch(function(error){
        console.log(error);
      });
    return {id: id}
  }

  async approved({request, response}) {
    let data = request.body;

    // await emailjs.send('service_95rf9qb', 'template_r43wi4r', data, 'user_zZvaLT48Hr1dzazfyBM8i')
    //   .then(function(response) {
    //     console.log('SUCCESS!', response.status, response.text);
    //   }, function(error) {
    //     console.log('FAILED...', error);
    //   });
    // await Mail.send('purchase-client', { data: data }, (message) => {
    //   message
    //     .to(data.checkout.email)
    //     .from('vitor.22sk@gmail.com')
    //     .subject('Pedido confirmado')
    // })
  }

  async get({request, response}) {
    response.json({
      Payment: request.query.payment_id,
      Status: request.query.status,
      MerchantOrder: request.query.merchant_order_id
    })
  }

  async frete({request, response}) {

    let args = {
      // Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
      sCepOrigem: '81200100',
      sCepDestino: '89253428',
      nVlPeso: '1',
      nCdFormato: '1',
      nVlComprimento: '25',
      nVlAltura: '9',
      nVlLargura: '15',
      nCdServico: ['04510'], //Array com os códigos de serviço
      nVlDiametro: '1',
    };
    
    let data = null
    await calcularPrecoPrazo(args).then((response) => {
      data = response
    });

    return {data}
  }
}

module.exports = CheckoutController
