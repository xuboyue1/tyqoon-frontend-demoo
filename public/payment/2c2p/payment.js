const platformGroup = "2C2P"

async function pay() {
    const amount = document.getElementById("payment-amount").value

    document.getElementById("payment-select").setAttribute("hidden", true)
    document.getElementById("pgw-ui-container").removeAttribute("hidden")
    const order = await getBalanceOrder(amount)
    const res = await getPaymentOrder(platformGroup, order, "url")

    const uiRequestFull = {
        url: res.paymentUrl,
        templateId: "ikea",
        mode: "DropIn",
        cancelConfirmation: true
    };

    PGWSDK.paymentUI(uiRequestFull, function (response) {
        console.log(response);
        if (response.responseCode === "0003") {

            //User canceled transaction
        } else if (response.responseCode === "2000") {

            //Request payment inquiry API or redirect to your payment result page.
        } else {

            console.log("Response callback: " + response.paymentToken + " // " + response.responseCode + " // " + response.responseDescription);
        }
    });
}