


const platformGroup = "TRIPLE"
const platformCode = [
  "TRIPLE",  // All payment methods included
  "TRIPLE-BTC", // Btc
  "TRIPLE-ETH", // ETH
  "TRIPLE-USDT", // USDT
  "TRIPLE-USDC", // USDC
  "TRIPLE-LIGHTNING_BITCOIN", // Lightning Bitcoin
  "TRIPLE-BINANCE", // Binance
  "TRIPLE-USDT_TRON", // USDT TRON
  "TRIPLE-USDC_TRON", // USDT TRON
  "TRIPLE-TEST_BTC",// TestBtc (Use only in test environments)
]

initialize()

async function initialize() {
  const platformList = await getPlatform()
  for (const platform of platformList) {
    if (platformGroup == platform.platformGroup) {
      const elem= document.getElementById(platform.platformCode)
      if (elem!=null){
        elem.removeAttribute("hidden")
      }
    
    }
  }
}



async function pay(code) {
  const amount = document.getElementById("payment-amount").value

  document.getElementById("payment-select").setAttribute("hidden", true)
  document.getElementById("payment-form").removeAttribute("hidden")
  const order =await getBalanceOrder(amount)
  const res = await getPaymentOrder(code,order)

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