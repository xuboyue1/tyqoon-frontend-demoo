
const platformCode = {
  "default": "TRIPLE",
}

initialize();

async function initialize() {
  const res = await getPaymentOrder(platformCode.default)
  const clientJson = res.clientJson
  // const elem = document.querySelector('#payment')
  // elem.setAttribute('payment-reference', clientJson.paymentReference)
  // elem.setAttribute('access-token', clientJson.accessToken)
  document.querySelector('#payment-form').innerHTML = `
  
  <triplea-ecommerce-payment-v1
  id="payment"
  payment-reference="${clientJson.paymentReference}"
  access-token="${clientJson.accessToken}"
>
</triplea-ecommerce-payment-v1>
  `
}