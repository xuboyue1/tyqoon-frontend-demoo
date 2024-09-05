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
  document.getElementById("payment-select").setAttribute("hidden", true)
  document.getElementById("payment-form").removeAttribute("hidden")
  const order =await buyVip()
  const res = await getPaymentOrder(code,order)

  const clientJson = res.clientJson
  const { clientSecret, pubKey,successUri } = clientJson
  stripe = Stripe(pubKey);
  return_url = successUri

  const options = {
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    // appearance: {/*...*/},
  };

// Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 5
  elements = stripe.elements(options);

// Create and mount the Payment Element
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');


  setLoading(false);
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);


  const {error} = await stripe.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url: return_url,
    }
  });

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
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
    // document.querySelector("#spinner").classList.remove("hidden");
    // document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    // document.querySelector("#spinner").classList.add("hidden");
    // document.querySelector("#button-text").classList.remove("hidden");
  }
}
