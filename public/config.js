const base_url = "http://47.57.236.213:41111"
const token = "\n" +
    "\n" +
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzaG9wIiwiZXhwIjoxNzMyNzYwODk3LCJpYXQiOjE3MjQ5ODQ4OTcsImp0aSI6IjFkOWU3MzI3MGQyMjRlY2JhZWIxNDcyYzk5NzlhZjdjIn0._Zvumh8F9tSc3La_q7ad2umuE95nsrFzpPOF7zJhY0w"


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
