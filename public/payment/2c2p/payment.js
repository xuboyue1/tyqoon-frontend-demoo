const platformGroup = "2C2P"

const platformCode = [
    "2C2P-CARD",  // CARD
    "2C2P-ALIPAY", // ALIPAY
    "2C2P-WECHAT_PAY", // WECHAT PAY
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
    document.getElementById("pgw-ui-container").removeAttribute("hidden")
    const order = await getBalanceOrder(amount)
    const res = await getPaymentOrder(code, order, "url")

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