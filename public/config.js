const base_url = "http://47.57.236.213:11111"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzaG9wIiwiZXhwIjoxNzE2MjYyODIxLCJpYXQiOjE3MDg0ODY4MjEsImp0aSI6IjE5MDQwZWE1Y2I0MDg2YTg1NzIxNTJjNmZlMzIwOThjIn0.FjHvv0VBRjjbnJq-ekx4SWCbVgqpPu6nnsoY823bLSY"


async function getPlatform() {
    const response = await fetch(`${base_url}` + "/payment/queryPlatformList", {
        method: "GET",
        headers: {"Content-Type": "application/json", "token": token},
        // body: JSON.stringify(req),
    });
    const {code, data} = await response.json();
    return data
}

async function getBalanceOrder(amount) {
    if (!amount) {
        amount = 100
    }
    const req = {
        "actualAmountPaid": amount
    }
    const response = await fetch(`${base_url}` + "/user/basic/recharge", {
        method: "POST",
        headers: {"Content-Type": "application/json", "token": token},
        body: JSON.stringify(req),
    });
    const {code, data} = await response.json();
    console.log("business: ", data)
    return {
        "businessType": 2,
        "businessId": data.id
    }
}

async function getPaymentOrder(platformCode, business, paymentType) {
    if (!business) {
        business = await getBalanceOrder()
    }
    const req = {
        "platformCode": platformCode,
        "businessType": business.businessType,
        "businessId": business.businessId,
        "paymentType": paymentType
    }
    const response = await fetch(`${base_url}` + "/payment/payV2", {
        method: "POST",
        headers: {"Content-Type": "application/json", "token": token},
        body: JSON.stringify(req),
    });
    let {code, data} = await response.json();
    console.log(code, data)
    const clientJson = JSON.parse(data.clientJson)
    data.clientJson = clientJson
    return data
}