let stripe;
let elements;
let return_url;
document.querySelector("#payment-form").addEventListener("submit", handleSubmit);


const platformGroup = "STRIPE"

const platformCode = [
  "STRIPE",   // All payment methods included
  "STRIPE-CARD",  // Card payment
  "STRIPE-WECHAT_PAY", // Wechat Pay
  "STRIPE-ALIPAY"  // Alipay
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
  setLoading(true);

  const amount = document.getElementById("payment-amount").value
  document.getElementById("payment-select").setAttribute("hidden", true)
  document.getElementById("payment-form").removeAttribute("hidden")
  const order =await getBalanceOrder(amount)
  const res = await getPaymentOrder(code,order)
  
  const clientJson = res.clientJson
  const { clientSecret, pubKey,successUri } = clientJson
  stripe = Stripe(pubKey);
  return_url = successUri
  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  setLoading(false);
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url:return_url,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}


// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}