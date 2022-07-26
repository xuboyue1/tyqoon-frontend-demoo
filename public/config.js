

const base_url = "http://localhost:11111"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzaG9wIiwiZXhwIjoxNjYzOTE3MzU1LCJpYXQiOjE2NTYxNDEzNTUsImp0aSI6IjQ3Njk4NjUifQ.hGd9CxGXQYTLbiHZQmEkcsBlEXGfa3LLTXK2xh-jzxs"


async function getPlatform(){
    const response = await fetch(`${base_url}` + "/payment/queryPlatformList", {
        method: "GET",
        headers: { "Content-Type": "application/json", "token": token },
        // body: JSON.stringify(req),
    });
    const { code, data } = await response.json();
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
        headers: { "Content-Type": "application/json", "token": token },
        body: JSON.stringify(req),
    });
    const { code, data } = await response.json();
    console.log("business: ",data)
    return {
        "businessType": 2,
        "businessId": data.id
    }
}

async function getPaymentOrder(platformCode, business) {
    if (!business) {
        business = await getBalanceOrder()
    }
    const req = {
        "platformCode": platformCode,
        "businessType": business.businessType,
        "businessId": business.businessId
    }
    const response = await fetch(`${base_url}` + "/payment/payV2", {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": token },
        body: JSON.stringify(req),
    });
    let { code, data } = await response.json();
    console.log(code,data)
    const clientJson = JSON.parse(data.clientJson)
    data.clientJson = clientJson
    return data
}