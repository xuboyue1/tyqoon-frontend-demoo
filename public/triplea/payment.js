window.onload = async () => {
  // const response = await fetch("/create-payment-intent", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ items }),
  // });
  const elem = document.querySelector('#payment')
  elem.setAttribute('payment-reference', 123)
  elem.setAttribute('access-token', 123)
}