let Socket = null
let setIntervalWebsocketPush = null
let url = "wss://ws.icool.world/ws"
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzaG9wIiwiZXhwIjoxNzIxMTk3MzI2LCJpYXQiOjE3MTM0MjEzMjYsImp0aSI6IjU0NDYwOWM4OGUxNTBiNDZkNWZlYzhkZDQwOTdkZjkxIn0.GbYiBy533oy3BLq02dNgLWaPBRogaD0vaKSodvIR3o0"

createSocket()

/**
 * 建立websocket连接
 *
 */
function createSocket() {
    Socket && Socket.close()
    if (!Socket) {
        console.log('建立websocket连接')
        Socket = new WebSocket(url, ['token', token])
        Socket.onopen = onopenWS
        Socket.onmessage = onmessageWS
        Socket.onerror = onerrorWS
        Socket.onclose = oncloseWS
    } else {
        console.log('websocket已连接')
    }
}

/**打开WS之后发送心跳 */
function onopenWS() {
    sendPing()
}

/**连接失败重连 */
function onerrorWS() {
    Socket.close()
    clearInterval(setIntervalWebsocketPush)
    console.log('连接失败重连中')
    if (Socket.readyState !== 3) {
        Socket = null
        createSocket()
    }
}

/**WS数据接收统一处理 */
function onmessageWS(e) {
    window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
            data: e.data
        }
    }))
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
function connecting(message) {
    setTimeout(() => {
        if (Socket.readyState === 0) {
            connecting(message)
        } else {
            Socket.send(message)
        }
    }, 1000)
}

/**
 * 发送数据
 * @param {any} type 拉取的消息类型
 */
function sendWSPush(id, type, data = {}) {
    let msg = JSON.stringify({
        "id": id,
        "type": type,
        "data": data
    })
    if (Socket === null) {
        createSocket()
    } else if (Socket.readyState === 3) {
        Socket.close()
        createSocket()
    } else if (Socket.readyState === 0) {
        connecting(msg)
    } else if (Socket.readyState === 1) {
        Socket.send(msg)
    }
}

/**断开重连 */
function oncloseWS() {
    clearInterval(setIntervalWebsocketPush)
    console.log('websocket已断开....正在尝试重连')
    if (Socket.readyState !== 2) {
        Socket = null
        createSocket()
    }
}

/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
function sendPing(time = 5000) {
    let data = JSON.stringify({
        "id": "1",
        "type": "Ping",
        "data": {
            "ts": parseInt(new Date().getTime() / 1000)
        }
    })
    clearInterval(setIntervalWebsocketPush)
    Socket.send(data)
    setIntervalWebsocketPush = setInterval(() => {
        Socket.send(data)
    }, time)
}