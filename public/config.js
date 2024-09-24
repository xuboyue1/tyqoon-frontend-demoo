// const base_url = "http://127.0.0.1:41111"
const base_url = "http://47.57.236.213:41111"
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzaG9wIiwiZXhwIjoxNzM0ODM0MDkyLCJpYXQiOjE3MjcwNTgwOTIsImp0aSI6IjUwNDMyM2YzZDIwZDU1NDZlNThiZmQzMzUxYTEwZjljIn0.aCsT_lgfakf966maGCL0qP5Lo4KP6VTC9ZIljvHH7Pw"


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

async function buyVip() {
    const req = {
        "vipConfigId": "5",
        "currency": "CNY",
        "num": 1
    }
    const response = await fetch(`${base_url}` + "/user/order/buyVip", {
        method: "POST",
        headers: {"Content-Type": "application/json", "token": token},
        body: JSON.stringify(req),
    });
    const {code, data} = await response.json();
    console.log("business: ", data)
    return {
        "businessType": 5,
        "businessId": data
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
    const response = await fetch(`${base_url}` + "/payment/subscriptionPay", {
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
