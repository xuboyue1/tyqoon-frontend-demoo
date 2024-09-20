var ClinkChatWeb = function () {
    "use strict";
    var t = function () {
        return t = Object.assign || function (t) {
            for (var e, n = 1, o = arguments.length; n < o; n++) for (var i in e = arguments[n]) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t
        }, t.apply(this, arguments)
    };
    "function" == typeof SuppressedError && SuppressedError;
    var e = {
        allScripts: document.scripts,
        trackJSReg: /\/webchat.js/,
        webSocketUrl: "",
        chatWebApiDomain: "",
        ready: !1,
        debug: !0,
        connected: !1,
        avaterUrl: "",
        tinetBtnContainer: null,
        model: navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) ? "app" : "pc",
        hasSourceFile: !1,
        tinetPopoverContainer: null,
        tinetImageContainer: null,
        tinetWebChat: null,
        tinetWebChatFrame: null,
        isOpen: !1,
        baseUrl: "http://127.0.0.1:8080",
        localChatUrl: "http://172.16.80.106:5050/",
        localImageUrl: "http://127.0.0.1:8080/resources/static",
        iframe: null,
        imageViewerIframe: null,
        trackWsDisabled: !1,
        trackDisabled: !1,
        pageViewDisabled: !1,
        colorConfig: [{name: "#1366DC", value: "10"}, {name: "#01825e", value: "1"}, {
            name: "#3370ff",
            value: "2"
        }, {name: "#8273ed", value: "3"}, {name: "#e25eaf", value: "4"}, {
            name: "#f69f36",
            value: "5"
        }, {name: "#fedc5c", value: "6"}, {name: "#fff", value: "7"}],
        inviteText: "",
        sessionOpenType: 1,
        chatting: !1,
        tinetChatBoxSize: {windowWidth: 350, windowHeight: 530},
        frameBorderRadius: 12,
        isFocusWindow: !1,
        currentSession: "",
        isSessionPage: !0,
        startSessionAfterInvite: 1,
        unReadCount: 0,
        unReadCallback: null,
        isClickOpen: !1,
        btnConfig: {},
        chatWebLoaded: !1,
        iframeLoadedNum: 0,
        ws: null,
        visitor: null,
        resourceItem: {}
    }, n = {
        LEVEL: {DEBUG: "", INFO: "blue", WARN: "orange", ERROR: "red"}, debug: function (t) {
            e.debug && this.print(t, this.LEVEL.DEBUG)
        }, info: function (t) {
            this.print(t, this.LEVEL.INFO)
        }, warn: function (t) {
            this.print(t, this.LEVEL.WARN)
        }, error: function (t) {
            this.print(t, this.LEVEL.ERROR)
        }, log: function (t, n) {
            e.debug && this.print(t, n)
        }, print: function (t, e) {
            e && (e = "color:" + e), window.console.log("%c[" + new Date + "] " + t, e)
        }
    }, o = {
        storeStorage: null, KEY: "webchat_app", store: function () {
            try {
                window.localStorage && (this.storeStorage ? window.localStorage.setItem(this.KEY, JSON.stringify(this.storeStorage)) : this.storeStorage = JSON.parse(window.localStorage.getItem(this.KEY) || "{}"))
            } catch (t) {
                console.log(t)
            }
        }, setItem: function (t, e, n) {
            n = n || Number.MAX_SAFE_INTEGER, this.storeStorage[t] = {
                value: e,
                duration: n,
                time: Date.now()
            }, this.store()
        }, getItem: function (t) {
            if (!this.has(t)) return !1;
            var e = this.storeStorage[t].value, n = this.storeStorage[t].duration, o = this.storeStorage[t].time;
            return Date.now() - o <= n ? e : (window.localStorage.removeItem(t), !1)
        }, has: function (t) {
            return Object.hasOwnProperty.call(this.storeStorage, t)
        }, clear: function () {
            this.storeStorage = {}, this.store()
        }
    }, i = function (t) {
        for (var e = t + "=", n = document.cookie.split(";"), o = 0; o < n.length; o++) {
            var i = n[o].trim();
            if (0 === i.indexOf(e)) return i.substring(e.length, i.length)
        }
        return ""
    }, r = function (t, e, n, o) {
        var i = new XMLHttpRequest;
        i.onreadystatechange = function () {
            4 === i.readyState && (200 === i.status ? e(JSON.parse(i.responseText)) : n && n())
        }, i.open("get", t, void 0 === o || o), i.send()
    }, s = function (t, e, n, o) {
        var i = new XMLHttpRequest;
        i.onreadystatechange = function () {
            4 === i.readyState && (200 === i.status ? n && n(JSON.parse(i.responseText)) : o && o(i.responseText))
        }, i.open("post", t), i.setRequestHeader("Content-Type", "application/json"), i.send(JSON.stringify(e))
    }, a = function () {
        function t(e) {
            this.language = "zh-CN";
            for (var n = 0, o = t.filedKeys; n < o.length; n++) {
                var i = o[n];
                "linkCard" === i ? e.linkCard && (this.linkCard = encodeURIComponent(JSON.stringify(e.linkCard || ""))) : "headImgUrl" === i ? this.headImgUrl = encodeURIComponent(e.headImgUrl || "") : this[i] = e[i] || ""
            }
            this.getVisitorId(e.accessId)
        }

        return t.prototype.getVisitorInfo = function (t) {
            return this[t]
        }, t.prototype.getAccessId = function () {
            return this.accessId
        }, t.prototype.getVisitorId = function (t) {
            var n = this;
            if (this.visitorId) return this.visitorId;
            t = t || this.accessId;
            var s = "clinkChatVisitorId:" + this.accessId;
            if (this.visitorId = i(s) || o.getItem(s), this.visitorId) return this.visitorId;
            var a = e.chatWebApiDomain + "/api/new_id?accessId=" + this.accessId;
            return r(a, (function (t) {
                n.visitorId = t.result, o.setItem(s, n.visitorId)
            }), null, !1), this.visitorId
        }, t.prototype.getVisitorParams = function () {
            for (var n = {}, o = 0, i = t.filedKeys; o < i.length; o++) {
                var r = i[o];
                this[r] && (n[r] = this[r])
            }
            return n.sessionOpenType = e.sessionOpenType, n
        }, t.prototype.getBtnSettingParams = function () {
            return {accessId: this.accessId, visitorId: this.visitorId, city: this.city, province: this.province}
        }, t.prototype.setVisitorInfo = function (t, e) {
            this[t] = e
        }, t.prototype.getQueryString = function () {
            var t = this.getVisitorParams(), e = [];
            for (var n in t) e.push("".concat(n, "=").concat(t[n]));
            return e.join("&")
        }, t.filedKeys = ["accessId", "visitorId", "visitorName", "tel", "externalId", "cno", "replyWelcome", "language", "city", "province", "initMsg", "visitorTag", "visitorExtraInfo", "capToken", "customerFields", "encryptedParams", "headImgUrl", "noncestr", "sign", "timestamp", "linkCard", "code", "appid", "componentAccessToken", "componentAppId", "headerDisplay"], t
    }();

    function c(t) {
        return "[object Function]" === Object.prototype.toString.call(t)
    }

    function l(t) {
        for (var e = ""; e.length < t;) e += Math.random().toString(36).substr(2);
        return e.substr(0, t)
    }

    function u(t) {
        return "7" === t || "#ffffff" === t || "#fff" === t || "#FFFFFF" === t || "#FFF" === t
    }

    function d(t, e) {
        var n = t[e];
        return null == n || "" === n
    }

    function h(t) {
        return decodeURIComponent(t) === t
    }

    var p = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/, f = /^rgb\((\d{1,3},){2}\d{1,3}\)$/,
        m = /^(rgba\((\d{1,3},){3})(0?\.\d+|1)\)$/;
    var g = {
        isFunction: c, loadScript: function t(o, i, r) {
            if (i === o.length) return n.debug("Util.loadScript: JS file is loaded [" + JSON.stringify(o) + "]"), c(r) && r(), c(window.clinkWebchatOptions.options.callback) && window.clinkWebchatOptions.options.callback(), void (e.ready = !0);
            var s = document.body, a = document.createElement("script");
            a.type = "text/javascript", window.tinetChatWebDev || window.tinetLocal ? a.src = e.baseUrl + o[i] : a.src = e.webSocketUrl + o[i], a.charset = "UTF-8", s.appendChild(a), a.readyState ? a.onreadystatechange = function () {
                "loaded" !== a.readyState && "complete" !== a.readyState || (a.onreadystatechange = null, t(o, i + 1, r))
            } : a.onload = function () {
                t(o, i + 1, r)
            }
        }, extend: function (t, e, n) {
            for (var o in e) !e.hasOwnProperty(o) || t.hasOwnProperty(o) && !n || (t[o] = e[o]);
            return t
        }, templateEngine: function (t, e) {
            for (var n, o = /<%([^%>]+)?%>/g, i = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, r = "var r=[];\n", s = 0, a = function (t, e) {
                return r += e ? t.match(i) ? t + "\n" : "r.push(" + t + ");\n" : "" != t ? 'r.push("' + t.replace(/"/g, '\\"') + '");\n' : "", a
            }; n = o.exec(t);) a(t.slice(s, n.index))(n[1], !0), s = n.index + n[0].length;
            return a(t.substr(s, t.length - s)), r += 'return r.join("");', new Function(r.replace(/[\r\t\n]/g, "")).apply(e)
        }, randomString: l, generateSessionId: function () {
            var t = l(10);
            return e.currentSession = t, t
        }, isWhite: u, setStyle: function (t, e) {
            for (var n in e) t.style[n] = e[n]
        }, offsetChatDom: function (t) {
            var n, o, i, r, s = document.documentElement.clientHeight, a = (n = e.tinetBtnContainer.dom, {
                width: (o = n.getBoundingClientRect()).width,
                height: o.height,
                top: o.top,
                right: o.right,
                bottom: o.bottom,
                left: o.left
            }), c = t.position.place;
            return 1 === c || 3 === c ? i = t.position.sideMargin + a.width : 2 !== c && 4 !== c || (r = t.position.sideMargin + a.width), {
                left: i,
                right: r,
                bottom: Math.ceil(s - a.bottom)
            }
        }, bindEvent: function (t) {
            var n = e.btnConfig, o = (u(n.color), "#646a73"), i = u(n.color) ? "#3370ff" : "#646a73";
            document.getElementById(t).onmouseover = function () {
                document.getElementsByClassName("actived")[0].style.color = i
            }, document.getElementById(t).onmouseout = function () {
                document.getElementsByClassName("actived")[0].style.color = o
            }, document.getElementById(t).onclick = function (t) {
                t.stopPropagation(), t.preventDefault(), e.tinetBtnContainer.openWindowByType(e.btnConfig.popStyle)
            }
        }, objectToQueryString: function (t) {
            for (var e = [], n = 0, o = Object.keys(t); n < o.length; n++) {
                var i = o[n];
                if (t.hasOwnProperty(i) && !d(t, i)) {
                    var r = i;
                    h(i) && (r = encodeURIComponent(i));
                    var s = t[i];
                    h(s) && (s = encodeURIComponent(s)), e.push("".concat(r, "=").concat(s))
                }
            }
            return e.join("&")
        }, appendStyle: function (t) {
            var e = document.createElement("style");
            e.innerHTML = t, document.head.appendChild(e)
        }, getIconUrl: function (t) {
            return e.webSocketUrl + "/api/icon/" + t.icon + "?accessId=" + t.accessId + "&visitorId=" + t.visitorId
        }, colorRgba: function (t, e) {
            if ("string" != typeof t || !t) return t;
            var n = t.toLowerCase().replace(/\s*/g, "") || "";
            if (n && p.test(n)) {
                if (4 === n.length) {
                    for (var o = "#", i = 1; i < 4; i += 1) o += n.slice(i, i + 1).concat(n.slice(i, i + 1));
                    n = o
                }
                var r = [];
                for (i = 1; i < 7; i += 2) r.push(parseInt("0x" + n.slice(i, i + 2)));
                return "rgba(".concat(r.join(","), ",").concat(e, ")")
            }
            return n && f.test(n) ? n.replace("rgb", "rgba").replace(")", ",".concat(e, ")")) : n && m.test(n) ? n = n.replace(m, (function (t, n, o, i) {
                return n + i * e + ")"
            })) : n
        }, adjustHexColor: function (t, e) {
            3 === (t = t.replace(/^#/, "")).length && (t = t.split("").map((function (t) {
                return t + t
            })).join(""));
            var n = parseInt(t.substring(0, 2), 16), o = parseInt(t.substring(2, 4), 16),
                i = parseInt(t.substring(4, 6), 16),
                r = e > 0 ? Math.min(Math.floor(n / (1 - e)), 255) : Math.max(Math.floor(n * (1 + e)), 0),
                s = e > 0 ? Math.min(Math.floor(o / (1 - e)), 255) : Math.max(Math.floor(o * (1 + e)), 0),
                a = e > 0 ? Math.min(Math.floor(i / (1 - e)), 255) : Math.max(Math.floor(i * (1 + e)), 0);
            return "#".concat(r.toString(16).padStart(2, "0")).concat(s.toString(16).padStart(2, "0")).concat(a.toString(16).padStart(2, "0"))
        }
    }, v = function (t, n) {
        var o = {accessId: t.accessId, visitorId: t.visitorId, city: t.city, province: t.province},
            i = g.objectToQueryString(o), s = "".concat(e.chatWebApiDomain, "/api/setting/button?").concat(i);
        r(s, n)
    }, b = function (t) {
        var n = {accessId: t.accessId, visitorId: t.visitorId, city: t.city, province: t.province};
        n.pageTitle = document.title, n.pageUrl = decodeURIComponent(location.href), n.refererUrl = decodeURIComponent(document.referrer), s(e.chatWebApiDomain + "/api/track/page_view", n)
    }, y = function (t) {
        var n = {accessId: t.accessId, visitorId: t.visitorId, city: t.city, province: t.province};
        n.pageUrl = location.href, n.mainUniqueId = t.mainUniqueId, s(e.chatWebApiDomain + "/api/track/open_session", n)
    }, w = function () {
        var t = {content: e.inviteText || "", createTime: (new Date).getTime(), event: "invite"};
        window.ClinkChatWeb.setWindowStatus("maximum"), S.setMaximun(), t.minimum = !1, S.postMessage("invite", t)
    }, C = function (t, e, n) {
        if (t) {
            var o = t.querySelector(".customize-badge");
            if (o) o.textContent = e > 99 ? "99+" : e; else {
                var i = document.createElement("div");
                i.textContent = e, i.setAttribute("class", "customize-badge"), g.setStyle(i, n), t.appendChild(i)
            }
        }
    }, x = function (t) {
        if (!t) return t;
        var n = t.querySelector(".customize-badge");
        t && n && t.removeChild(n), e.tinetBtnContainer && (e.tinetBtnContainer.isClearUnread = !1)
    }, S = {
        loadChatWindowIframe: function (t, n) {
            if (e.tinetWebChat || e.hasSourceFile || e.tinetWebChatFrame) n && n(); else if (!window.tinetWebChatType) {
                e.tinetWebChatFrame = document.createElement("div"), e.tinetWebChatFrame.setAttribute("id", "TinetWebChatFrame");
                var o = window.tinetChatWebDev || window.tinetLocal ? e.localChatUrl : "".concat(e.webSocketUrl, "/chat.html"),
                    i = "".concat(o, "?").concat(e.visitor.getQueryString(), "&tinetWebChatType=tinetFrame&isJsEmbed=1");
                e.iframe = S.createIframe("tinet-chat-iframe", i, "100%", "100%", (function () {
                    e.hasSourceFile = !0, n && n()
                }), 1e4, (function () {
                })), e.tinetWebChatFrame.appendChild(e.iframe), e.tinetWebChatFrame.style.display = "none", document.body.appendChild(e.tinetWebChatFrame), S.loadImageViewerIframe(), "app" === e.model ? (e.tinetWebChatFrame.style.width = "100%", e.tinetWebChatFrame.style.height = "90%", e.tinetWebChatFrame.style.position = "fixed", e.tinetWebChatFrame.style.right = "0", e.tinetWebChatFrame.style.bottom = "0", e.tinetWebChatFrame.style.overflow = "hidden", e.tinetWebChatFrame.style.boxShadow = "0px 2px 16px 0px rgba(0, 0, 0, 0.15)", e.tinetWebChatFrame.style.borderRadius = e.frameBorderRadius + "px", e.tinetWebChatFrame.style.zIndex = "2147483646") : (e.tinetWebChatFrame.style.width = e.tinetChatBoxSize.windowWidth + "px", e.tinetWebChatFrame.style.height = e.tinetChatBoxSize.windowHeight + "px", e.tinetWebChatFrame.style.position = "fixed", e.tinetWebChatFrame.style.right = e.tinetChatBoxSize.windowSideMargin + "px", e.tinetWebChatFrame.style.bottom = -e.tinetChatBoxSize.windowHeight + "px", e.tinetWebChatFrame.style.overflow = "hidden", e.tinetWebChatFrame.style.boxShadow = "0px 2px 16px 0px rgba(0, 0, 0, 0.15)", e.tinetWebChatFrame.style.borderRadius = e.frameBorderRadius + "px", e.tinetWebChatFrame.style.zIndex = "2147483646", e.tinetWebChatFrame.style.transition = "bottom 0.3s ease 0s", window.setTimeout((function () {
                    e.tinetWebChatFrame.style.bottom = e.tinetChatBoxSize.windowBottomMargin + "px"
                }), 200))
            }
        }, loadImageViewerIframe: function () {
            var t = "".concat(window.tinetChatWebDev || window.tinetLocal ? e.localImageUrl : e.webSocketUrl, "/image-viewer/index.html?tinetWebChatType=tinetImageViewer"),
                n = S.createIframe("TinetImageViewer", t, "100%", "100%", (function () {
                }), 1e4, (function () {
                }));
            n.style.display = "none", n.style.position = "fixed", n.style.left = "0", n.style.right = "0", n.style.top = "0", n.style.bottom = "0", n.style.zIndex = "2147483648", e.imageViewerIframe = n, document.body.appendChild(n)
        }, createIframe: function (t, e, n, o, i, r, s) {
            var a = setTimeout((function () {
                clearTimeout(a), s.apply(this, arguments)
            }), r), c = document.createElement("iframe");
            return c.id = t, c.width = n, c.height = o, c.src = e, c.style.border = "none", c.allow = "geolocation; microphone; camera; midi; encrypted-media;", c.allowFullscreen = !0, c.attachEvent ? c.attachEvent("onload", (function () {
                clearTimeout(a), i.apply(this, arguments)
            })) : c.onload = function () {
                clearTimeout(a), i.apply(this, arguments)
            }, c
        }, setMaximun: function () {
            e.tinetWebChatFrame && ("app" === e.model ? (e.tinetWebChatFrame.style.width = "100%", e.tinetWebChatFrame.style.height = "90%") : (e.tinetWebChatFrame.style.width = e.tinetChatBoxSize.windowWidth + "px", e.tinetWebChatFrame.style.height = e.tinetChatBoxSize.windowHeight + "px"))
        }, setMininumStyle: function () {
            e.tinetWebChatFrame.style.height = "40px", e.tinetWebChatFrame.style.width = "200px"
        }, closeChatWindow: function () {
            var t = document.getElementById("TinetWebChatFrame");
            t && 1 === t.nodeType && (t.style.display = "none"), e.tinetBtnContainer && e.tinetBtnContainer.show(), e.isOpen = !1
        }, kickOutWindow: function (t) {
            var n;
            if (e.currentSession !== t) {
                e.isSessionPage = !1, e.isFocusWindow = !1;
                S.postMessage("continueStatus", {event: "continueStatus"}), null === (n = e.ws) || void 0 === n || n.disconnect()
            } else e.isSessionPage = !0
        }, openSessionWindow: function (t, n) {
            var o = !1;
            if (1 === arguments.length && "function" == typeof t || (o = t), e.isClickOpen = !t, "minimum" === S.getWindowStatus() || "close" === S.getWindowStatus()) {
                var i = {type: "event", event: "maximum", minimum: !1};
                this.setMaximun(), S.setWindowStatus("maximum"), S.postMessage("maximum", i)
            }
            if (!e.isOpen) {
                if (e.btnConfig.popStyle > 1) return 0 === e.btnConfig.type ? e.tinetBtnContainer.openWindowByType(e.btnConfig.popStyle) : void 0;
                !e.btnConfig.type && document.getElementById("TinetWebChatFrame") && x(document.getElementById("TinetWebChatFrame")), this.loadChatWindowIframe({}, (function () {
                    var t = {type: "event", event: "openSessionWindow"};
                    "minimum" === S.getWindowStatus() && (this.setMininumStyle(), t.minimum = !0), t.isClickOpen = e.isClickOpen, S.postMessage("openSessionWindow", t);
                    var n = document.getElementById("TinetWebChatFrame");
                    e.tinetBtnContainer && e.tinetBtnContainer.hide(), e.tinetPopoverContainer && e.tinetPopoverContainer.hide(), n && ("close" === S.getWindowStatus() && o ? (n.style.display = "none", S.closeChatWindow()) : n.style.display = "block")
                }))
            }
        }, openChatWindow: function (t) {
            var n = {type: "event", event: "openSessionWindow"};
            n.isClickOpen = e.isClickOpen, e.isClickOpen = !1, n.isConnectWs = t, "minimum" === S.getWindowStatus() ? (this.setMininumStyle(), n.minimum = !0) : (this.setMaximun(), n.minimum = !1), S.postMessage("maximum", n)
        }, iframeLoaded: function () {
            e.isOpen = !0, 1 !== e.startSessionAfterInvite ? e.chatWebLoaded && w() : this.openChatWindow()
        }, postImageViewerMsg: function (t, n) {
            e.imageViewerIframe && (e.imageViewerIframe.style.display = "block", e.imageViewerIframe.contentWindow.postMessage({
                id: "tinet-image-viewer",
                type: t,
                data: n
            }, window.tinetChatWebDev || window.tinetLocal ? e.localImageUrl : e.webSocketUrl + "/image-viewer/index.html"))
        }, postMessage: function (t, n) {
            var o = Object.assign({}, n, {type: t}, {id: "tinet-chat-web"});
            e.iframe && e.iframe.contentWindow.postMessage(o, window.tinetChatWebDev || window.tinetLocal ? e.localChatUrl : e.webSocketUrl)
        }, setWindowStatus: function (t) {
            window.sessionStorage.setItem("tinetWindowStatus", t)
        }, getWindowStatus: function () {
            return window.sessionStorage.getItem("tinetWindowStatus")
        }
    }, I = function () {
        function n(t) {
            this.hasDom = !1, this.isClearUnread = !1, this.def = g.extend({
                content: "",
                color: "",
                tmpId: null,
                tmpHtml: ""
            }, t, !0), this.tpl = this._htmlParseTpl(this.def.tmpHtml), this.dom = this._parseToDom(this.tpl)[0], this.hasDom = !1, this.listeners = [], this.handlers = {}
        }

        return n.prototype._parseTpl = function (t) {
            var e = this.def, n = document.getElementById(t).innerHTML.trim();
            return g.templateEngine(n, e)
        }, n.prototype._htmlParseTpl = function (t) {
            var e = this.def, n = t.trim();
            return g.templateEngine(n, e)
        }, n.prototype._parseToDom = function (t) {
            var e = document.createElement("div");
            return "string" == typeof t && (e.innerHTML = t), e.childNodes
        }, n.prototype.openWindowByType = function (n, o) {
            var i = t(t({}, o), {tinetWebChatType: "tinetFullScreen"}), r = e.visitor.getQueryString();
            switch (n) {
                case 3:
                    var s = g.objectToQueryString(i);
                    window.open("".concat(e.webSocketUrl, "/chat.html?").concat(r, "&").concat(s));
                    break;
                case 2:
                    i = t(t({}, o), {tinetWebChatType: "pc" === e.model ? "tinetResponsive" : "tinetFullScreen"});
                    var a = g.objectToQueryString(i);
                    window.open("".concat(e.webSocketUrl, "/chat.html?").concat(r, "&").concat(a));
                    break;
                default:
                    window.ClinkChatWeb.setWindowStatus("maximum"), e.startSessionAfterInvite = 1, this.hide((function () {
                    }))
            }
        }, n.prototype.show = function (t) {
            if (0 !== this.def.type) {
                var n = this;
                if (!this.hasDom && (!(this.listeners.indexOf("show") > -1) || this.emit({
                    type: "show",
                    target: this.dom
                }))) return document.body.appendChild(this.dom), this.hasDom = !0, this.dom.onclick = function (t) {
                    document.getElementById("TinetWebChatFrame") && x(document.getElementById("TinetWebChatFrame")), document.getElementById("tinet-chat-visitor") && x(document.getElementById("tinet-chat-visitor")), e.btnConfig.originPos && (Math.abs(n.dom.getBoundingClientRect().left - e.btnConfig.originPos.left) > 30 || Math.abs(n.dom.getBoundingClientRect().top - e.btnConfig.originPos.top) > 30) || (e.isClickOpen = !0, n.openWindowByType(e.btnConfig.popStyle))
                }, this.dom.onmouseover = function () {
                    n.mouseover((function () {
                    }))
                }, this.dom.onmouseout = function () {
                    n.mouseout((function () {
                    }))
                }, this.dom.onmousedown = function (t) {
                    t.preventDefault(), n.mousedown((function () {
                    }), t)
                }, this.dom.onmouseup = function (t) {
                    t.preventDefault(), n.mouseup((function () {
                    }), t)
                }, this.dom.ontouchstart = function (t) {
                    n.touchstart((function () {
                    }), t)
                }, t && t(), this.isClearUnread && x(document.getElementById("tinet-chat-visitor")), this
            }
        }, n.prototype.hide = function (t) {
            if (!(this.listeners.indexOf("hide") > -1) || this.emit({
                type: "hide",
                target: this.dom
            })) return this.hasDom && document.body.removeChild(this.dom), this.hasDom = !1, t && t(), this
        }, n.prototype.mouseover = function (t) {
            if (!(this.listeners.indexOf("mouseover") > -1) || this.emit({
                type: "mouseover",
                target: this.dom
            })) return t && t(), this
        }, n.prototype.mouseout = function (t) {
            if (!(this.listeners.indexOf("mouseout") > -1) || this.emit({
                type: "mouseout",
                target: this.dom
            })) return t && t(), this
        }, n.prototype.mousedown = function (t, e) {
            if (!(this.listeners.indexOf("mousedown") > -1) || this.emit({
                type: "mousedown",
                target: this.dom,
                event: e
            })) return t && t(), this
        }, n.prototype.touchstart = function (t, e) {
            if (!(this.listeners.indexOf("touchstart") > -1) || this.emit({
                type: "touchstart",
                target: this.dom,
                event: e
            })) return t && t(), this
        }, n.prototype.mouseup = function (t, e) {
            if (!(this.listeners.indexOf("mouseup") > -1) || this.emit({
                type: "mouseup",
                target: this.dom,
                event: e
            })) return t && t(), this
        }, n.prototype.modifyTpl = function (t) {
            if (t) if ("string" == typeof t) this.tpl = t; else {
                if ("function" != typeof t) return this;
                this.tpl = t()
            }
            return this.dom = this._parseToDom(this.tpl)[0], this
        }, n.prototype.css = function (t, e) {
            e = e || this.dom;
            for (var n in t) {
                var o = n.replace(/[A-Z]/g, (function (t) {
                    return "-" + t.toLowerCase()
                }));
                e.style[o] = t[n]
            }
            return this
        }, n.prototype.width = function (t) {
            return this.dom.style.width = t + "px", this
        }, n.prototype.height = function (t) {
            return this.dom.style.height = t + "px", this
        }, n.prototype.changeContent = function (t) {
            this.def.content = t
        }, n.prototype.on = function (t, e) {
            return void 0 === this.handlers[t] && (this.handlers[t] = []), this.listeners.push(t), this.handlers[t].push(e), this
        }, n.prototype.off = function (t, e) {
            if (this.handlers[t] instanceof Array) {
                for (var n = this.handlers[t], o = 0, i = n.length; o < i && n[o] !== e; o++) ;
                return this.listeners.splice(o, 1), n.splice(o, 1), this
            }
        }, n.prototype.emit = function (t) {
            if (t.target || (t.target = this), this.handlers[t.type] instanceof Array) for (var e = this.handlers[t.type], n = 0, o = e.length; n < o; n++) return e[n](t), !0;
            return !1
        }, n
    }(), E = function (t) {
        e.tinetPopoverContainer = new I({
            tmpHtml: '<div id="tinet-popover" style="position:fixed; z-index: 233262666236; display:none; min-width: 126px;"><ul style="color:#333; box-shadow:0 2px 12px 0 rgba(0,0,0,.1);list-style:none;font-size:14px; background: #fff;border-radius: 6px;padding:0; margin:0;font-family:Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma Arial;"><li id="firstPopover" style="display: -ms-flexbox;display: flex;-ms-flex-align: center;align-items: center;height: 36px;padding: 8px 16px 8px 8px; cursor:pointer; box-sizing:initial;"> <% if(this.first.logoImage){ %><div style="width:36px;height:36px;margin-right:10px;display: -ms-flexbox;display: flex;-ms-flex-align: center;align-items: center;"><span style="display:block;width:36px;height:36px;background: <% this.first.color %>;"><img onmouseover="ClinkChatWeb.createImgShowHtml(1)" onmouseout="ClinkChatWeb.removeImageShowHtml()" src="<% this.first.logoImage %>" style="width:100%;height: 100%;display: inline-block;"/></span></div><% } %><div style="flex: 1 1 auto;font-size: 14px;"><p class="actived" style="margin: 0;color: #262626;height: 24px;line-height: 24px; word-break: keep-all;"><% this.first.title %></p><% if(this.first.viceTitle){ %><p style="font-size: 12px;margin: 0;color: #8c8c8c;height: 24px;line-height: 24px; word-break: keep-all;"><% this.first.viceTitle %></p><% } %></div></li><li id="secondPopover" style="display: -ms-flexbox;display: flex;-ms-flex-align: center;align-items: center;height: 36px;padding:8px 16px 8px 8px; cursor:pointer; box-sizing:initial;"> <% if(this.second.url){%><a href="<% this.second.url %>" target="_blank" style="text-decoration:underline; color:#8c8c8c; display:flex;"><% if(this.second.logoImage){ %><div style="width:36px;height:36px;margin-right:10px;display: -ms-flexbox;display: flex;-ms-flex-align: center;align-items: center;"><span style="display:block;width:36px;height:36px;background: <% this.second.color %>;"><img onmouseover="ClinkChatWeb.createImgShowHtml(2)" onmouseout="ClinkChatWeb.removeImageShowHtml()" src="<% this.second.logoImage %>" style="width:100%;height: 100%;display: inline-block;"/></span></div><% } %><div style="flex: 1 1 auto;font-size: 14px;"><p style="margin: 0;color: #262626;height: 24px;line-height: 24px;word-break: keep-all;"><% this.second.title %></p><% if(this.second.viceTitle){ %><p style="font-size: 12px;margin: 0;color: #8c8c8c;height: 24px;line-height: 24px;word-break: keep-all;"><% this.second.viceTitle %></p><% } %></div></a><% } else {%><% if(this.second.logoImage){ %><div style="width:36px;height:36px;margin-right:10px;display: -ms-flexbox;display: flex;-ms-flex-align: center;align-items: center;"><span style="display:block;width:36px;height:36px;background: <% this.second.color %>;"><img onmouseover="ClinkChatWeb.createImgShowHtml(2)" onmouseout="ClinkChatWeb.removeImageShowHtml()" src="<% this.second.logoImage %>" style="width:100%;height: 100%;display: inline-block;"/></span></div><% } %><div style="flex: 1 1 auto;font-size: 14px;"><p style="margin: 0;color: #262626;height: 24px;line-height: 24px;word-break: keep-all;"><% this.second.title %></p><% if(this.second.viceTitle){ %><p style="font-size: 12px;margin: 0;color: #8c8c8c;height: 24px;line-height: 24px;word-break: keep-all;"><% this.second.viceTitle %></p><% } %></div><% } %></li></ul></div>',
            type: t.type,
            position: t.position,
            avaterUrl: e.avaterUrl,
            language: e.visitor.getVisitorInfo("language"),
            webSocketUrl: e.webSocketUrl,
            first: {
                title: t.menuFirstLordTitle,
                color: t.menuFirstImageName ? "transparent" : e.btnConfig.color,
                viceTitle: t.menuFirstViceTitle,
                logoImage: t.menuFirstImageName ? g.getIconUrl({
                    icon: t.menuFirstImageName,
                    accessId: e.visitor.getAccessId()
                }) : "".concat(e.webSocketUrl, "/images/UE3-message-mask.png")
            },
            second: {
                title: t.menuSecondLordTitle,
                color: t.menuSecondImageName ? "transparent" : e.btnConfig.color,
                viceTitle: t.menuSecondViceTitle,
                logoImage: t.menuSecondImageName ? g.getIconUrl({
                    icon: t.menuSecondImageName,
                    accessId: e.visitor.getAccessId()
                }) : "".concat(e.webSocketUrl, "/images/UE3-message-mask.png"),
                url: t.menuSecondUrl
            }
        })
    }, k = function () {
        var t = e.btnConfig, n = g.isWhite(t.color) ? "#262626" : "#fff", o = e.tinetPopoverContainer;
        o.on("mouseover", (function (t) {
            o.dom.style.display = "block", document.getElementsByClassName("tinet-name")[0].style.color = n, g.bindEvent("firstPopover"), g.bindEvent("secondPopover")
        })), o.on("mouseout", (function () {
            o.dom.style.display = "none", document.getElementsByClassName("tinet-name")[0].style.color = n
        }))
    }, _ = {
        HIDDEN: 0,
        0: "HIDDEN",
        VERTICAL: 1,
        1: "VERTICAL",
        HORIZONTAL: 2,
        2: "HORIZONTAL",
        CIRCULAR: 3,
        3: "CIRCULAR",
        IMAGE: 4,
        4: "IMAGE",
        VERTICALPOP: 5,
        5: "VERTICALPOP",
        HORIZONTALPOP: 6,
        6: "HORIZONTALPOP"
    };
    var T = {
            BtnType: _, getResponsiveStyle: function (t, e) {
                var n = _[t], o = "";
                if (["VERTICAL", "HORIZONTAL", "VERTICALPOP", "HORIZONTALPOP"].includes(n)) {
                    var i = g.adjustHexColor(e, -.1), r = g.adjustHexColor(e, .1);
                    o = "\n            #tinet-chat-visitor .tinet-type:hover {\n                background: ".concat(r, " !important;\n            }\n            #tinet-chat-visitor .tinet-type:active {\n                background: ").concat(i, " !important;\n            }\n        ")
                } else if ("CIRCULAR" === n) {
                    i = g.adjustHexColor(e, -.1), r = g.adjustHexColor(e, .1);
                    o = "\n            #tinet-chat-visitor:hover {\n                transform: scale(1.125);\n            }\n            #tinet-chat-visitor:hover .tinet-type {\n                background: ".concat(r, " !important;\n            }\n            #tinet-chat-visitor:active {\n                transform: scale(0.875);\n            }\n            #tinet-chat-visitor:active .tinet-type {\n                background: ").concat(i, " !important;\n            }\n        ")
                } else "IMAGE" === n && (o = "\n            #tinet-chat-visitor {\n                background-color: #F0F0F0;\n                border-radius: 50%;\n            }\n            #tinet-chat-visitor:hover {\n                transform: scale(1.125);\n            }\n            #tinet-chat-visitor:active {\n                transform: scale(0.875);\n            }\n        ");
                return o
            }
        }, O = {
            btnDom: null, createHtml: function (t) {
                var n = '<div class="tinet-type" style="text-align:center; font-size: 14px; box-sizing:border-box;box-shadow: 0 4px 6px 0 rgba(21, 22, 24, 0.05);border-radius: 6px; background: <% this.color %>;"><div class="tinet-menu-img" style="vertical-align: middle;width:36px;height:36px; <% this.type === 3? "width:36px;height:36px;":"" %>"><% if(this.color === "#ffffff" || this.color === "#fff" || this.color === "7") {%><img src="<% this.webSocketUrl %>/images/black-message.svg" style="display:inline-block; width:100%;height:100%;border:0;"/><% }else {%><img src="<% this.webSocketUrl %>/images/UE3-message.svg" style="display:inline-block; width:100%;height:100%;border:0;"/><% } %></div ><div class="tinet-name" style="<%this.type === 3 ? "display: none;": "display:inline-block;"%> color: <% (this.color === "#ffffff" || this.color === "#fff" || this.color === "7") ? "#646a73": "#fff" %>;  <% this.type === 1 ? "margin-top:8px;width: 20px;":"" %>  <% this.type === 2 ? "margin-left:10px;": "" %> line-height:1.4;"><% this.content %></div></div>',
                    o = "auto", i = "auto";
                switch (t.type) {
                    case 1:
                        o = "48px";
                        break;
                    case 2:
                        i = "48px";
                        break;
                    case 3:
                        o = "48px", i = "48px";
                        break;
                    case 4:
                        if (s = t.buttonImageName) {
                            var r = {icon: s, accessId: e.visitor.getAccessId()};
                            e.avaterUrl = window.ClinkChatWeb.getIconUrl(r)
                        }
                        o = t.width + "px", i = t.high + "px", n = '<img src=<% this.avaterUrl || this.webSocketUrl + "/images/chat-contact.png" %> style="display:inline-block;border-radius: 50%;width:<% this.btnImgWidth %>px; height:<% this.btnImgHeight %>px;" />';
                        break;
                    case 5:
                    case 6:
                        var s;
                        if (s = t.buttonImageName) {
                            r = {icon: s, accessId: e.visitor.getAccessId()};
                            e.avaterUrl = window.ClinkChatWeb.getIconUrl(r)
                        }
                        n = '<div class="tinet-type" style="text-align:center; font-size: 14px; box-sizing:border-box;box-shadow: 0 4px 6px 0 rgba(21, 22, 24, 0.05);border-radius: 6px; background: <% this.color %>; <% this.position.place===1 || this.position.place===3 ? "margin-right:12px;":"margin-left:4px;" %>"><div class="tinet-menu-img" style="vertical-align: middle;width:36px;height:36px;"><img src=<% this.avaterUrl || this.webSocketUrl + "/images/chat-contact.png" %> style="display:inline-block; width:100%;height:100%;"/></div ><div class="tinet-name" style="display:inline-block;width: <% this.type === 5 ? "20px" : "auto" %>;color: <% (this.color === "#ffffff" || this.color === "#fff" || this.color === "7") ? "#646a73": "#fff" %>; <% this.type === 5 ? "margin-top:6px;": "margin-left:6px;padding:0 10px 0 6px;" %>  line-height:1.4;"><% this.content %></div></div>'
                }
                return '<div id="tinet-chat-visitor" style="position:fixed;box-sizing:border-box;color:#fff; cursor:pointer;z-index: 233262666236;font-family:Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma Arial;width:' + o + ";height:" + i + ';">' + n + "</div>"
            }, render: function (t) {
                var n = e.btnConfig, o = this.createHtml(n), i = this.getColor(n.color);
                if (e.tinetBtnContainer = new I({
                    tmpHtml: o,
                    cancel: !0,
                    content: n.name,
                    color: i,
                    type: n.type,
                    position: n.position,
                    avaterUrl: e.avaterUrl,
                    btnImgWidth: n.width,
                    btnImgHeight: n.high,
                    language: e.visitor.getVisitorInfo("language"),
                    webSocketUrl: e.webSocketUrl
                }), 0 !== n.type) {
                    var r = e.chatWebApiDomain + "/api/chat/visitor/unreadCount?visitorId=" + t.visitorId + "&accessId=" + t.accessId;
                    s(r, {}, (function (t) {
                        if (200 === t.status && t.result) {
                            e.unReadCount = t.result;
                            var n = document.getElementById("tinet-chat-visitor");
                            n && C(n, e.unReadCount, {
                                display: "inline-block",
                                height: "18px",
                                lineHeight: "18px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                color: "#fff",
                                fontSize: "14px",
                                position: "absolute",
                                top: "5px",
                                left: "5px",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: "#FF2600",
                                padding: "0 6px",
                                borderRadius: "10px"
                            })
                        }
                    }));
                    var a = T.getResponsiveStyle(n.type, i);
                    g.appendStyle(a), this.addLocationStyle(e.tinetBtnContainer, n), this.addTypeStyle(e.tinetBtnContainer, n), S.getWindowStatus(), e.tinetBtnContainer.show(), e.tinetBtnContainer.on("show", (function () {
                        e.isOpen = !1
                    })), e.tinetBtnContainer.on("hide", (function (t) {
                        e.btnConfig.popStyle > 1 || (e.tinetPopoverContainer && e.tinetPopoverContainer.hasDom && e.tinetPopoverContainer.hide(), S.loadChatWindowIframe(e.visitor.getVisitorParams()), e.iframe = e.iframe || document.getElementById("tinet-chat-iframe"), e.tinetWebChatFrame.style.display = "block", e.iframe.addEventListener("load", (function () {
                            S.iframeLoaded(), e.iframeLoadedNum++
                        })), e.iframeLoadedNum > 0 && S.iframeLoaded())
                    })), e.tinetBtnContainer.on("mouseover", (function (t) {
                        if (5 !== n.type && 6 !== n.type || (!e.tinetPopoverContainer || e.tinetPopoverContainer && !e.tinetPopoverContainer.hasDom) && E(n), 5 === n.type || 6 === n.type) {
                            var o = g.isWhite(n.color) ? "#3370ff" : "#fff";
                            e.tinetBtnContainer.dom.getElementsByClassName("tinet-name")[0].style.color = o;
                            var i = g.offsetChatDom(n), r = {bottom: i.bottom + "px", display: "block"};
                            "number" == typeof i.left ? r.left = i.left + "px" : r.right = i.right + "px", e.tinetPopoverContainer.css(r), e.tinetPopoverContainer.show(k)
                        }
                    })), e.tinetBtnContainer.on("mouseout", (function (t) {
                        if (5 === n.type || 6 === n.type) {
                            var o = g.isWhite(n.color) ? "#646a73" : "#fff";
                            e.tinetBtnContainer.dom.getElementsByClassName("tinet-name")[0].style.color = o, 5 !== n.type && 6 !== n.type || e.tinetPopoverContainer.css({display: "none"})
                        }
                    })), e.tinetBtnContainer.on("mousedown", (function (t) {
                        e.btnConfig.originPos = {
                            left: t.target.getBoundingClientRect().left,
                            top: t.target.getBoundingClientRect().top
                        };
                        var o = t.event.pageX - e.tinetBtnContainer.dom.offsetLeft,
                            i = t.event.pageY - e.tinetBtnContainer.dom.offsetTop;
                        if (1 === e.btnConfig.dragEnable && 5 !== n.type && 6 !== n.type) {
                            var r = e.tinetBtnContainer.dom.getBoundingClientRect().width,
                                s = e.tinetBtnContainer.dom.getBoundingClientRect().height, a = window.innerWidth - r,
                                c = window.innerHeight - s;
                            document.onmousemove = function (t) {
                                var n = t.pageX - o, r = t.pageY - i;
                                n < 0 || n > a || r < 0 || r > c ? document.onmousemove = null : (e.tinetBtnContainer.dom.style.removeProperty("right"), e.tinetBtnContainer.dom.style.left = n + "px", e.tinetBtnContainer.dom.style.removeProperty("bottom"), e.tinetBtnContainer.dom.style.top = r + "px", e.tinetPopoverContainer && e.tinetPopoverContainer.hasDom && e.tinetPopoverContainer.hide())
                            }
                        }
                    })), e.tinetBtnContainer.on("touchstart", (function (t) {
                        e.btnConfig.originPos = {
                            left: t.target.getBoundingClientRect().left,
                            top: t.target.getBoundingClientRect().top
                        };
                        var n = t.event.targetTouches[0].pageX - e.tinetBtnContainer.dom.offsetLeft,
                            o = t.event.targetTouches[0].pageY - e.tinetBtnContainer.dom.offsetTop;
                        if (1 === e.btnConfig.dragEnable && 5 !== e.btnConfig.type && 6 !== e.btnConfig.type) {
                            var i = e.tinetBtnContainer.dom.getBoundingClientRect().width,
                                r = e.tinetBtnContainer.dom.getBoundingClientRect().height, s = window.innerWidth - i,
                                a = window.innerHeight - r;
                            document.ontouchmove = function (t) {
                                var i = t.targetTouches[0].pageX - n, r = t.targetTouches[0].pageY - o;
                                i < 0 || i > s || r < 0 || r > a ? document.onmousemove = null : (e.tinetBtnContainer.dom.style.removeProperty("right"), e.tinetBtnContainer.dom.style.left = i + "px", e.tinetBtnContainer.dom.style.removeProperty("bottom"), e.tinetBtnContainer.dom.style.top = r + "px", e.tinetPopoverContainer && e.tinetPopoverContainer.hasDom && e.tinetPopoverContainer.hide())
                            }
                        }
                    })), document.onmouseup = function () {
                        document.onmousemove = null
                    }, document.ontouchend = function () {
                        document.ontouchmove = null
                    }
                }
            }, getColor: function (t) {
                var n = e.colorConfig.filter((function (e) {
                    return e.value === t
                }));
                return n.length ? n[0].name : t
            }, addLocationStyle: function (t, e) {
                var n = {}, o = e.position.bottomMargin + "px", i = e.position.sideMargin + "px",
                    r = "translate(0, calc(50% - " + o + "))";
                switch (e.position.place) {
                    case 2:
                        n = {right: i, bottom: o};
                        break;
                    case 3:
                        n = {left: i, bottom: "50%", transform: r, "-webkit-transform": r};
                        break;
                    case 4:
                        n = {right: i, bottom: "50%", transform: r, "-webkit-transform": r};
                        break;
                    default:
                        n = {left: i, bottom: o}
                }
                t.css(n)
            }, addTypeStyle: function (t, e) {
                var n = {};
                switch (e.type) {
                    case 0:
                        break;
                    case 5:
                    case 1:
                        n = {padding: "8px 6px", width: "48px", minHeight: "130px"};
                        break;
                    case 6:
                    case 2:
                        n = {display: "flex", alignItems: "center", height: "48px", padding: "0 16px 0 8px"};
                        break;
                    case 3:
                        n = {width: "48px", height: "48px", padding: "6px", borderRadius: "50%", lineHeight: "48px"}
                }
                console.log(typeof t.dom), t.css(n, t.dom.getElementsByClassName("tinet-type")[0])
            }
        },
        W = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
        N = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};

    function F() {
        throw new Error("setTimeout has not been defined")
    }

    function A() {
        throw new Error("clearTimeout has not been defined")
    }

    var R = F, B = A;

    function U(t) {
        if (R === setTimeout) return setTimeout(t, 0);
        if ((R === F || !R) && setTimeout) return R = setTimeout, setTimeout(t, 0);
        try {
            return R(t, 0)
        } catch (e) {
            try {
                return R.call(null, t, 0)
            } catch (e) {
                return R.call(this, t, 0)
            }
        }
    }

    "function" == typeof N.setTimeout && (R = setTimeout), "function" == typeof N.clearTimeout && (B = clearTimeout);
    var L, P = [], j = !1, M = -1;

    function D() {
        j && L && (j = !1, L.length ? P = L.concat(P) : M = -1, P.length && V())
    }

    function V() {
        if (!j) {
            var t = U(D);
            j = !0;
            for (var e = P.length; e;) {
                for (L = P, P = []; ++M < e;) L && L[M].run();
                M = -1, e = P.length
            }
            L = null, j = !1, function (t) {
                if (B === clearTimeout) return clearTimeout(t);
                if ((B === A || !B) && clearTimeout) return B = clearTimeout, clearTimeout(t);
                try {
                    return B(t)
                } catch (e) {
                    try {
                        return B.call(null, t)
                    } catch (e) {
                        return B.call(this, t)
                    }
                }
            }(t)
        }
    }

    function H(t, e) {
        this.fun = t, this.array = e
    }

    H.prototype.run = function () {
        this.fun.apply(null, this.array)
    };

    function z() {
    }

    var J = z, q = z, G = z, X = z, Q = z, $ = z, Z = z;
    var K = N.performance || {}, Y = K.now || K.mozNow || K.msNow || K.oNow || K.webkitNow || function () {
        return (new Date).getTime()
    };
    var tt = new Date;
    var et = {
        nextTick: function (t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
            P.push(new H(t, e)), 1 !== P.length || j || U(V)
        },
        title: "browser",
        browser: !0,
        env: {},
        argv: [],
        version: "",
        versions: {},
        on: J,
        addListener: q,
        once: G,
        off: X,
        removeListener: Q,
        removeAllListeners: $,
        emit: Z,
        binding: function (t) {
            throw new Error("process.binding is not supported")
        },
        cwd: function () {
            return "/"
        },
        chdir: function (t) {
            throw new Error("process.chdir is not supported")
        },
        umask: function () {
            return 0
        },
        hrtime: function (t) {
            var e = .001 * Y.call(K), n = Math.floor(e), o = Math.floor(e % 1 * 1e9);
            return t && (n -= t[0], (o -= t[1]) < 0 && (n--, o += 1e9)), [n, o]
        },
        platform: "browser",
        release: {},
        config: {},
        uptime: function () {
            return (new Date - tt) / 1e3
        }
    }, nt = {exports: {}}, ot = {};
    W.crypto && W.crypto.getRandomValues ? ot.randomBytes = function (t) {
        var e = new Uint8Array(t);
        return W.crypto.getRandomValues(e), e
    } : ot.randomBytes = function (t) {
        for (var e = new Array(t), n = 0; n < t; n++) e[n] = Math.floor(256 * Math.random());
        return e
    };
    var it = ot, rt = "abcdefghijklmnopqrstuvwxyz012345", st = {
        string: function (t) {
            for (var e = it.randomBytes(t), n = [], o = 0; o < t; o++) n.push(rt.substr(e[o] % 32, 1));
            return n.join("")
        }, number: function (t) {
            return Math.floor(Math.random() * t)
        }, numberString: function (t) {
            var e = ("" + (t - 1)).length;
            return (new Array(e + 1).join("0") + this.number(t)).slice(-e)
        }
    };
    !function (t) {
        var e = st, n = {}, o = !1, i = W.chrome && W.chrome.app && W.chrome.app.runtime;
        t.exports = {
            attachEvent: function (t, e) {
                void 0 !== W.addEventListener ? W.addEventListener(t, e, !1) : W.document && W.attachEvent && (W.document.attachEvent("on" + t, e), W.attachEvent("on" + t, e))
            }, detachEvent: function (t, e) {
                void 0 !== W.addEventListener ? W.removeEventListener(t, e, !1) : W.document && W.detachEvent && (W.document.detachEvent("on" + t, e), W.detachEvent("on" + t, e))
            }, unloadAdd: function (t) {
                if (i) return null;
                var r = e.string(8);
                return n[r] = t, o && setTimeout(this.triggerUnloadCallbacks, 0), r
            }, unloadDel: function (t) {
                t in n && delete n[t]
            }, triggerUnloadCallbacks: function () {
                for (var t in n) n[t](), delete n[t]
            }
        };
        i || t.exports.attachEvent("unload", (function () {
            o || (o = !0, t.exports.triggerUnloadCallbacks())
        }))
    }(nt);
    var at = {}, ct = Object.prototype.hasOwnProperty;

    function lt(t) {
        try {
            return decodeURIComponent(t.replace(/\+/g, " "))
        } catch (t) {
            return null
        }
    }

    function ut(t) {
        try {
            return encodeURIComponent(t)
        } catch (t) {
            return null
        }
    }

    at.stringify = function (t, e) {
        e = e || "";
        var n, o, i = [];
        for (o in "string" != typeof e && (e = "?"), t) if (ct.call(t, o)) {
            if ((n = t[o]) || null != n && !isNaN(n) || (n = ""), o = ut(o), n = ut(n), null === o || null === n) continue;
            i.push(o + "=" + n)
        }
        return i.length ? e + i.join("&") : ""
    }, at.parse = function (t) {
        for (var e, n = /([^=?#&]+)=?([^&]*)/g, o = {}; e = n.exec(t);) {
            var i = lt(e[1]), r = lt(e[2]);
            null === i || null === r || i in o || (o[i] = r)
        }
        return o
    };
    var dt = function (t, e) {
            if (e = e.split(":")[0], !(t = +t)) return !1;
            switch (e) {
                case"http":
                case"ws":
                    return 80 !== t;
                case"https":
                case"wss":
                    return 443 !== t;
                case"ftp":
                    return 21 !== t;
                case"gopher":
                    return 70 !== t;
                case"file":
                    return !1
            }
            return 0 !== t
        }, ht = at, pt = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/, ft = /[\n\r\t]/g,
        mt = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//, gt = /:\d+$/, vt = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i,
        bt = /^[a-zA-Z]:/;

    function yt(t) {
        return (t || "").toString().replace(pt, "")
    }

    var wt = [["#", "hash"], ["?", "query"], function (t, e) {
            return St(e.protocol) ? t.replace(/\\/g, "/") : t
        }, ["/", "pathname"], ["@", "auth", 1], [NaN, "host", void 0, 1, 1], [/:(\d*)$/, "port", void 0, 1], [NaN, "hostname", void 0, 1, 1]],
        Ct = {hash: 1, query: 1};

    function xt(t) {
        var e,
            n = ("undefined" != typeof window ? window : void 0 !== W ? W : "undefined" != typeof self ? self : {}).location || {},
            o = {}, i = typeof (t = t || n);
        if ("blob:" === t.protocol) o = new Et(unescape(t.pathname), {}); else if ("string" === i) for (e in o = new Et(t, {}), Ct) delete o[e]; else if ("object" === i) {
            for (e in t) e in Ct || (o[e] = t[e]);
            void 0 === o.slashes && (o.slashes = mt.test(t.href))
        }
        return o
    }

    function St(t) {
        return "file:" === t || "ftp:" === t || "http:" === t || "https:" === t || "ws:" === t || "wss:" === t
    }

    function It(t, e) {
        t = (t = yt(t)).replace(ft, ""), e = e || {};
        var n, o = vt.exec(t), i = o[1] ? o[1].toLowerCase() : "", r = !!o[2], s = !!o[3], a = 0;
        return r ? s ? (n = o[2] + o[3] + o[4], a = o[2].length + o[3].length) : (n = o[2] + o[4], a = o[2].length) : s ? (n = o[3] + o[4], a = o[3].length) : n = o[4], "file:" === i ? a >= 2 && (n = n.slice(2)) : St(i) ? n = o[4] : i ? r && (n = n.slice(2)) : a >= 2 && St(e.protocol) && (n = o[4]), {
            protocol: i,
            slashes: r || St(i),
            slashesCount: a,
            rest: n
        }
    }

    function Et(t, e, n) {
        if (t = (t = yt(t)).replace(ft, ""), !(this instanceof Et)) return new Et(t, e, n);
        var o, i, r, s, a, c, l = wt.slice(), u = typeof e, d = this, h = 0;
        for ("object" !== u && "string" !== u && (n = e, e = null), n && "function" != typeof n && (n = ht.parse), o = !(i = It(t || "", e = xt(e))).protocol && !i.slashes, d.slashes = i.slashes || o && e.slashes, d.protocol = i.protocol || e.protocol || "", t = i.rest, ("file:" === i.protocol && (2 !== i.slashesCount || bt.test(t)) || !i.slashes && (i.protocol || i.slashesCount < 2 || !St(d.protocol))) && (l[3] = [/(.*)/, "pathname"]); h < l.length; h++) "function" != typeof (s = l[h]) ? (r = s[0], c = s[1], r != r ? d[c] = t : "string" == typeof r ? ~(a = "@" === r ? t.lastIndexOf(r) : t.indexOf(r)) && ("number" == typeof s[2] ? (d[c] = t.slice(0, a), t = t.slice(a + s[2])) : (d[c] = t.slice(a), t = t.slice(0, a))) : (a = r.exec(t)) && (d[c] = a[1], t = t.slice(0, a.index)), d[c] = d[c] || o && s[3] && e[c] || "", s[4] && (d[c] = d[c].toLowerCase())) : t = s(t, d);
        n && (d.query = n(d.query)), o && e.slashes && "/" !== d.pathname.charAt(0) && ("" !== d.pathname || "" !== e.pathname) && (d.pathname = function (t, e) {
            if ("" === t) return e;
            for (var n = (e || "/").split("/").slice(0, -1).concat(t.split("/")), o = n.length, i = n[o - 1], r = !1, s = 0; o--;) "." === n[o] ? n.splice(o, 1) : ".." === n[o] ? (n.splice(o, 1), s++) : s && (0 === o && (r = !0), n.splice(o, 1), s--);
            return r && n.unshift(""), "." !== i && ".." !== i || n.push(""), n.join("/")
        }(d.pathname, e.pathname)), "/" !== d.pathname.charAt(0) && St(d.protocol) && (d.pathname = "/" + d.pathname), dt(d.port, d.protocol) || (d.host = d.hostname, d.port = ""), d.username = d.password = "", d.auth && (~(a = d.auth.indexOf(":")) ? (d.username = d.auth.slice(0, a), d.username = encodeURIComponent(decodeURIComponent(d.username)), d.password = d.auth.slice(a + 1), d.password = encodeURIComponent(decodeURIComponent(d.password))) : d.username = encodeURIComponent(decodeURIComponent(d.auth)), d.auth = d.password ? d.username + ":" + d.password : d.username), d.origin = "file:" !== d.protocol && St(d.protocol) && d.host ? d.protocol + "//" + d.host : "null", d.href = d.toString()
    }

    Et.prototype = {
        set: function (t, e, n) {
            var o = this;
            switch (t) {
                case"query":
                    "string" == typeof e && e.length && (e = (n || ht.parse)(e)), o[t] = e;
                    break;
                case"port":
                    o[t] = e, dt(e, o.protocol) ? e && (o.host = o.hostname + ":" + e) : (o.host = o.hostname, o[t] = "");
                    break;
                case"hostname":
                    o[t] = e, o.port && (e += ":" + o.port), o.host = e;
                    break;
                case"host":
                    o[t] = e, gt.test(e) ? (e = e.split(":"), o.port = e.pop(), o.hostname = e.join(":")) : (o.hostname = e, o.port = "");
                    break;
                case"protocol":
                    o.protocol = e.toLowerCase(), o.slashes = !n;
                    break;
                case"pathname":
                case"hash":
                    if (e) {
                        var i = "pathname" === t ? "/" : "#";
                        o[t] = e.charAt(0) !== i ? i + e : e
                    } else o[t] = e;
                    break;
                case"username":
                case"password":
                    o[t] = encodeURIComponent(e);
                    break;
                case"auth":
                    var r = e.indexOf(":");
                    ~r ? (o.username = e.slice(0, r), o.username = encodeURIComponent(decodeURIComponent(o.username)), o.password = e.slice(r + 1), o.password = encodeURIComponent(decodeURIComponent(o.password))) : o.username = encodeURIComponent(decodeURIComponent(e))
            }
            for (var s = 0; s < wt.length; s++) {
                var a = wt[s];
                a[4] && (o[a[1]] = o[a[1]].toLowerCase())
            }
            return o.auth = o.password ? o.username + ":" + o.password : o.username, o.origin = "file:" !== o.protocol && St(o.protocol) && o.host ? o.protocol + "//" + o.host : "null", o.href = o.toString(), o
        }, toString: function (t) {
            t && "function" == typeof t || (t = ht.stringify);
            var e, n = this, o = n.host, i = n.protocol;
            i && ":" !== i.charAt(i.length - 1) && (i += ":");
            var r = i + (n.protocol && n.slashes || St(n.protocol) ? "//" : "");
            return n.username ? (r += n.username, n.password && (r += ":" + n.password), r += "@") : n.password ? (r += ":" + n.password, r += "@") : "file:" !== n.protocol && St(n.protocol) && !o && "/" !== n.pathname && (r += "@"), (":" === o[o.length - 1] || gt.test(n.hostname) && !n.port) && (o += ":"), r += o + n.pathname, (e = "object" == typeof n.query ? t(n.query) : n.query) && (r += "?" !== e.charAt(0) ? "?" + e : e), n.hash && (r += n.hash), r
        }
    }, Et.extractProtocol = It, Et.location = xt, Et.trimLeft = yt, Et.qs = ht;
    var kt = Et, _t = {exports: {}}, Tt = 1e3, Ot = 60 * Tt, Wt = 60 * Ot, Nt = 24 * Wt, Ft = 7 * Nt, At = 365.25 * Nt,
        Rt = function (t, e) {
            e = e || {};
            var n = typeof t;
            if ("string" === n && t.length > 0) return function (t) {
                if ((t = String(t)).length > 100) return;
                var e = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(t);
                if (!e) return;
                var n = parseFloat(e[1]);
                switch ((e[2] || "ms").toLowerCase()) {
                    case"years":
                    case"year":
                    case"yrs":
                    case"yr":
                    case"y":
                        return n * At;
                    case"weeks":
                    case"week":
                    case"w":
                        return n * Ft;
                    case"days":
                    case"day":
                    case"d":
                        return n * Nt;
                    case"hours":
                    case"hour":
                    case"hrs":
                    case"hr":
                    case"h":
                        return n * Wt;
                    case"minutes":
                    case"minute":
                    case"mins":
                    case"min":
                    case"m":
                        return n * Ot;
                    case"seconds":
                    case"second":
                    case"secs":
                    case"sec":
                    case"s":
                        return n * Tt;
                    case"milliseconds":
                    case"millisecond":
                    case"msecs":
                    case"msec":
                    case"ms":
                        return n;
                    default:
                        return
                }
            }(t);
            if ("number" === n && isFinite(t)) return e.long ? function (t) {
                var e = Math.abs(t);
                if (e >= Nt) return Bt(t, e, Nt, "day");
                if (e >= Wt) return Bt(t, e, Wt, "hour");
                if (e >= Ot) return Bt(t, e, Ot, "minute");
                if (e >= Tt) return Bt(t, e, Tt, "second");
                return t + " ms"
            }(t) : function (t) {
                var e = Math.abs(t);
                if (e >= Nt) return Math.round(t / Nt) + "d";
                if (e >= Wt) return Math.round(t / Wt) + "h";
                if (e >= Ot) return Math.round(t / Ot) + "m";
                if (e >= Tt) return Math.round(t / Tt) + "s";
                return t + "ms"
            }(t);
            throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t))
        };

    function Bt(t, e, n, o) {
        var i = e >= 1.5 * n;
        return Math.round(t / n) + " " + o + (i ? "s" : "")
    }

    var Ut = function (t) {
        function e(t) {
            for (var e = 0, o = 0; o < t.length; o++) e = (e << 5) - e + t.charCodeAt(o), e |= 0;
            return n.colors[Math.abs(e) % n.colors.length]
        }

        function n(t) {
            var r;

            function s() {
                if (s.enabled) {
                    for (var t = arguments.length, e = new Array(t), o = 0; o < t; o++) e[o] = arguments[o];
                    var i = s, a = Number(new Date), c = a - (r || a);
                    i.diff = c, i.prev = r, i.curr = a, r = a, e[0] = n.coerce(e[0]), "string" != typeof e[0] && e.unshift("%O");
                    var l = 0;
                    e[0] = e[0].replace(/%([a-zA-Z%])/g, (function (t, o) {
                        if ("%%" === t) return t;
                        l++;
                        var r = n.formatters[o];
                        if ("function" == typeof r) {
                            var s = e[l];
                            t = r.call(i, s), e.splice(l, 1), l--
                        }
                        return t
                    })), n.formatArgs.call(i, e), (i.log || n.log).apply(i, e)
                }
            }

            return s.namespace = t, s.enabled = n.enabled(t), s.useColors = n.useColors(), s.color = e(t), s.destroy = o, s.extend = i, "function" == typeof n.init && n.init(s), n.instances.push(s), s
        }

        function o() {
            var t = n.instances.indexOf(this);
            return -1 !== t && (n.instances.splice(t, 1), !0)
        }

        function i(t, e) {
            return n(this.namespace + (void 0 === e ? ":" : e) + t)
        }

        return n.debug = n, n.default = n, n.coerce = function (t) {
            if (t instanceof Error) return t.stack || t.message;
            return t
        }, n.disable = function () {
            n.enable("")
        }, n.enable = function (t) {
            var e;
            n.save(t), n.names = [], n.skips = [];
            var o = ("string" == typeof t ? t : "").split(/[\s,]+/), i = o.length;
            for (e = 0; e < i; e++) o[e] && ("-" === (t = o[e].replace(/\*/g, ".*?"))[0] ? n.skips.push(new RegExp("^" + t.substr(1) + "$")) : n.names.push(new RegExp("^" + t + "$")));
            for (e = 0; e < n.instances.length; e++) {
                var r = n.instances[e];
                r.enabled = n.enabled(r.namespace)
            }
        }, n.enabled = function (t) {
            if ("*" === t[t.length - 1]) return !0;
            var e, o;
            for (e = 0, o = n.skips.length; e < o; e++) if (n.skips[e].test(t)) return !1;
            for (e = 0, o = n.names.length; e < o; e++) if (n.names[e].test(t)) return !0;
            return !1
        }, n.humanize = Rt, Object.keys(t).forEach((function (e) {
            n[e] = t[e]
        })), n.instances = [], n.names = [], n.skips = [], n.formatters = {}, n.selectColor = e, n.enable(n.load()), n
    };
    !function (t, e) {
        function n(t) {
            return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }, n(t)
        }

        e.log = function () {
            var t;
            return "object" === ("undefined" == typeof console ? "undefined" : n(console)) && console.log && (t = console).log.apply(t, arguments)
        }, e.formatArgs = function (e) {
            if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors) return;
            var n = "color: " + this.color;
            e.splice(1, 0, n, "color: inherit");
            var o = 0, i = 0;
            e[0].replace(/%[a-zA-Z%]/g, (function (t) {
                "%%" !== t && (o++, "%c" === t && (i = o))
            })), e.splice(i, 0, n)
        }, e.save = function (t) {
            try {
                t ? e.storage.setItem("debug", t) : e.storage.removeItem("debug")
            } catch (t) {
            }
        }, e.load = function () {
            var t;
            try {
                t = e.storage.getItem("debug")
            } catch (t) {
            }
            !t && "env" in et && (t = et.env.DEBUG);
            return t
        }, e.useColors = function () {
            if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs)) return !0;
            if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
            return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
        }, e.storage = function () {
            try {
                return localStorage
            } catch (t) {
            }
        }(), e.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], t.exports = Ut(e), t.exports.formatters.j = function (t) {
            try {
                return JSON.stringify(t)
            } catch (t) {
                return "[UnexpectedJSONParseError]: " + t.message
            }
        }
    }(_t, _t.exports);
    var Lt = kt, Pt = function () {
    };
    "production" !== et.env.NODE_ENV && (Pt = _t.exports("sockjs-client:utils:url"));
    var jt = {
        getOrigin: function (t) {
            if (!t) return null;
            var e = new Lt(t);
            if ("file:" === e.protocol) return null;
            var n = e.port;
            return n || (n = "https:" === e.protocol ? "443" : "80"), e.protocol + "//" + e.hostname + ":" + n
        }, isOriginEqual: function (t, e) {
            var n = this.getOrigin(t) === this.getOrigin(e);
            return Pt("same", t, e, n), n
        }, isSchemeEqual: function (t, e) {
            return t.split(":")[0] === e.split(":")[0]
        }, addPath: function (t, e) {
            var n = t.split("?");
            return n[0] + e + (n[1] ? "?" + n[1] : "")
        }, addQuery: function (t, e) {
            return t + (-1 === t.indexOf("?") ? "?" + e : "&" + e)
        }, isLoopbackAddr: function (t) {
            return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(t) || /^\[::1\]$/.test(t)
        }
    }, Mt = {exports: {}};
    "function" == typeof Object.create ? Mt.exports = function (t, e) {
        e && (t.super_ = e, t.prototype = Object.create(e.prototype, {
            constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }))
    } : Mt.exports = function (t, e) {
        if (e) {
            t.super_ = e;
            var n = function () {
            };
            n.prototype = e.prototype, t.prototype = new n, t.prototype.constructor = t
        }
    };
    var Dt = {};

    function Vt() {
        this._listeners = {}
    }

    Vt.prototype.addEventListener = function (t, e) {
        t in this._listeners || (this._listeners[t] = []);
        var n = this._listeners[t];
        -1 === n.indexOf(e) && (n = n.concat([e])), this._listeners[t] = n
    }, Vt.prototype.removeEventListener = function (t, e) {
        var n = this._listeners[t];
        if (n) {
            var o = n.indexOf(e);
            -1 === o || (n.length > 1 ? this._listeners[t] = n.slice(0, o).concat(n.slice(o + 1)) : delete this._listeners[t])
        }
    }, Vt.prototype.dispatchEvent = function () {
        var t = arguments[0], e = t.type, n = 1 === arguments.length ? [t] : Array.apply(null, arguments);
        if (this["on" + e] && this["on" + e].apply(this, n), e in this._listeners) for (var o = this._listeners[e], i = 0; i < o.length; i++) o[i].apply(this, n)
    };
    var Ht = Vt, zt = Mt.exports, Jt = Ht;

    function qt() {
        Jt.call(this)
    }

    zt(qt, Jt), qt.prototype.removeAllListeners = function (t) {
        t ? delete this._listeners[t] : this._listeners = {}
    }, qt.prototype.once = function (t, e) {
        var n = this, o = !1;
        this.on(t, (function i() {
            n.removeListener(t, i), o || (o = !0, e.apply(this, arguments))
        }))
    }, qt.prototype.emit = function () {
        var t = arguments[0], e = this._listeners[t];
        if (e) {
            for (var n = arguments.length, o = new Array(n - 1), i = 1; i < n; i++) o[i - 1] = arguments[i];
            for (var r = 0; r < e.length; r++) e[r].apply(this, o)
        }
    }, qt.prototype.on = qt.prototype.addListener = Jt.prototype.addEventListener, qt.prototype.removeListener = Jt.prototype.removeEventListener, Dt.EventEmitter = qt;
    var Gt = {exports: {}}, Xt = W.WebSocket || W.MozWebSocket;
    Gt.exports = Xt ? function (t) {
        return new Xt(t)
    } : void 0;
    var Qt = nt.exports, $t = jt, Zt = Mt.exports, Kt = Dt.EventEmitter, Yt = Gt.exports, te = function () {
    };

    function ee(t, e, n) {
        if (!ee.enabled()) throw new Error("Transport created when disabled");
        Kt.call(this), te("constructor", t);
        var o = this, i = $t.addPath(t, "/websocket");
        i = "https" === i.slice(0, 5) ? "wss" + i.slice(5) : "ws" + i.slice(4), this.url = i, this.ws = new Yt(this.url, [], n), this.ws.onmessage = function (t) {
            te("message event", t.data), o.emit("message", t.data)
        }, this.unloadRef = Qt.unloadAdd((function () {
            te("unload"), o.ws.close()
        })), this.ws.onclose = function (t) {
            te("close event", t.code, t.reason), o.emit("close", t.code, t.reason), o._cleanup()
        }, this.ws.onerror = function (t) {
            te("error event", t), o.emit("close", 1006, "WebSocket connection broken"), o._cleanup()
        }
    }

    "production" !== et.env.NODE_ENV && (te = _t.exports("sockjs-client:websocket")), Zt(ee, Kt), ee.prototype.send = function (t) {
        var e = "[" + t + "]";
        te("send", e), this.ws.send(e)
    }, ee.prototype.close = function () {
        te("close");
        var t = this.ws;
        this._cleanup(), t && t.close()
    }, ee.prototype._cleanup = function () {
        te("_cleanup");
        var t = this.ws;
        t && (t.onmessage = t.onclose = t.onerror = null), Qt.unloadDel(this.unloadRef), this.unloadRef = this.ws = null, this.removeAllListeners()
    }, ee.enabled = function () {
        return te("enabled"), !!Yt
    }, ee.transportName = "websocket", ee.roundTrips = 2;
    var ne = ee, oe = Mt.exports, ie = Dt.EventEmitter, re = function () {
    };

    function se(t, e) {
        re(t), ie.call(this), this.sendBuffer = [], this.sender = e, this.url = t
    }

    "production" !== et.env.NODE_ENV && (re = _t.exports("sockjs-client:buffered-sender")), oe(se, ie), se.prototype.send = function (t) {
        re("send", t), this.sendBuffer.push(t), this.sendStop || this.sendSchedule()
    }, se.prototype.sendScheduleWait = function () {
        re("sendScheduleWait");
        var t, e = this;
        this.sendStop = function () {
            re("sendStop"), e.sendStop = null, clearTimeout(t)
        }, t = setTimeout((function () {
            re("timeout"), e.sendStop = null, e.sendSchedule()
        }), 25)
    }, se.prototype.sendSchedule = function () {
        re("sendSchedule", this.sendBuffer.length);
        var t = this;
        if (this.sendBuffer.length > 0) {
            var e = "[" + this.sendBuffer.join(",") + "]";
            this.sendStop = this.sender(this.url, e, (function (e) {
                t.sendStop = null, e ? (re("error", e), t.emit("close", e.code || 1006, "Sending error: " + e), t.close()) : t.sendScheduleWait()
            })), this.sendBuffer = []
        }
    }, se.prototype._cleanup = function () {
        re("_cleanup"), this.removeAllListeners()
    }, se.prototype.close = function () {
        re("close"), this._cleanup(), this.sendStop && (this.sendStop(), this.sendStop = null)
    };
    var ae = se, ce = Mt.exports, le = Dt.EventEmitter, ue = function () {
    };

    function de(t, e, n) {
        ue(e), le.call(this), this.Receiver = t, this.receiveUrl = e, this.AjaxObject = n, this._scheduleReceiver()
    }

    "production" !== et.env.NODE_ENV && (ue = _t.exports("sockjs-client:polling")), ce(de, le), de.prototype._scheduleReceiver = function () {
        ue("_scheduleReceiver");
        var t = this, e = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);
        e.on("message", (function (e) {
            ue("message", e), t.emit("message", e)
        })), e.once("close", (function (n, o) {
            ue("close", n, o, t.pollIsClosing), t.poll = e = null, t.pollIsClosing || ("network" === o ? t._scheduleReceiver() : (t.emit("close", n || 1006, o), t.removeAllListeners()))
        }))
    }, de.prototype.abort = function () {
        ue("abort"), this.removeAllListeners(), this.pollIsClosing = !0, this.poll && this.poll.abort()
    };
    var he = de, pe = Mt.exports, fe = jt, me = ae, ge = he, ve = function () {
    };

    function be(t, e, n, o, i) {
        var r = fe.addPath(t, e);
        ve(r);
        var s = this;
        me.call(this, t, n), this.poll = new ge(o, r, i), this.poll.on("message", (function (t) {
            ve("poll message", t), s.emit("message", t)
        })), this.poll.once("close", (function (t, e) {
            ve("poll close", t, e), s.poll = null, s.emit("close", t, e), s.close()
        }))
    }

    "production" !== et.env.NODE_ENV && (ve = _t.exports("sockjs-client:sender-receiver")), pe(be, me), be.prototype.close = function () {
        me.prototype.close.call(this), ve("close"), this.removeAllListeners(), this.poll && (this.poll.abort(), this.poll = null)
    };
    var ye = be, we = Mt.exports, Ce = jt, xe = ye, Se = function () {
    };

    function Ie(t, e, n, o) {
        xe.call(this, t, e, function (t) {
            return function (e, n, o) {
                Se("create ajax sender", e, n);
                var i = {};
                "string" == typeof n && (i.headers = {"Content-type": "text/plain"});
                var r = Ce.addPath(e, "/xhr_send"), s = new t("POST", r, n, i);
                return s.once("finish", (function (t) {
                    if (Se("finish", t), s = null, 200 !== t && 204 !== t) return o(new Error("http status " + t));
                    o()
                })), function () {
                    Se("abort"), s.close(), s = null;
                    var t = new Error("Aborted");
                    t.code = 1e3, o(t)
                }
            }
        }(o), n, o)
    }

    "production" !== et.env.NODE_ENV && (Se = _t.exports("sockjs-client:ajax-based")), we(Ie, xe);
    var Ee = Ie, ke = Mt.exports, _e = Dt.EventEmitter, Te = function () {
    };

    function Oe(t, e) {
        Te(t), _e.call(this);
        var n = this;
        this.bufferPosition = 0, this.xo = new e("POST", t, null), this.xo.on("chunk", this._chunkHandler.bind(this)), this.xo.once("finish", (function (t, e) {
            Te("finish", t, e), n._chunkHandler(t, e), n.xo = null;
            var o = 200 === t ? "network" : "permanent";
            Te("close", o), n.emit("close", null, o), n._cleanup()
        }))
    }

    "production" !== et.env.NODE_ENV && (Te = _t.exports("sockjs-client:receiver:xhr")), ke(Oe, _e), Oe.prototype._chunkHandler = function (t, e) {
        if (Te("_chunkHandler", t), 200 === t && e) for (var n = -1; ; this.bufferPosition += n + 1) {
            var o = e.slice(this.bufferPosition);
            if (-1 === (n = o.indexOf("\n"))) break;
            var i = o.slice(0, n);
            i && (Te("message", i), this.emit("message", i))
        }
    }, Oe.prototype._cleanup = function () {
        Te("_cleanup"), this.removeAllListeners()
    }, Oe.prototype.abort = function () {
        Te("abort"), this.xo && (this.xo.close(), Te("close"), this.emit("close", null, "user"), this.xo = null), this._cleanup()
    };
    var We = Oe, Ne = Dt.EventEmitter, Fe = Mt.exports, Ae = nt.exports, Re = jt, Be = W.XMLHttpRequest,
        Ue = function () {
        };

    function Le(t, e, n, o) {
        Ue(t, e);
        var i = this;
        Ne.call(this), setTimeout((function () {
            i._start(t, e, n, o)
        }), 0)
    }

    "production" !== et.env.NODE_ENV && (Ue = _t.exports("sockjs-client:browser:xhr")), Fe(Le, Ne), Le.prototype._start = function (t, e, n, o) {
        var i = this;
        try {
            this.xhr = new Be
        } catch (t) {
        }
        if (!this.xhr) return Ue("no xhr"), this.emit("finish", 0, "no xhr support"), void this._cleanup();
        e = Re.addQuery(e, "t=" + +new Date), this.unloadRef = Ae.unloadAdd((function () {
            Ue("unload cleanup"), i._cleanup(!0)
        }));
        try {
            this.xhr.open(t, e, !0), this.timeout && "timeout" in this.xhr && (this.xhr.timeout = this.timeout, this.xhr.ontimeout = function () {
                Ue("xhr timeout"), i.emit("finish", 0, ""), i._cleanup(!1)
            })
        } catch (t) {
            return Ue("exception", t), this.emit("finish", 0, ""), void this._cleanup(!1)
        }
        if (o && o.noCredentials || !Le.supportsCORS || (Ue("withCredentials"), this.xhr.withCredentials = !0), o && o.headers) for (var r in o.headers) this.xhr.setRequestHeader(r, o.headers[r]);
        this.xhr.onreadystatechange = function () {
            if (i.xhr) {
                var t, e, n = i.xhr;
                switch (Ue("readyState", n.readyState), n.readyState) {
                    case 3:
                        try {
                            e = n.status, t = n.responseText
                        } catch (t) {
                        }
                        Ue("status", e), 1223 === e && (e = 204), 200 === e && t && t.length > 0 && (Ue("chunk"), i.emit("chunk", e, t));
                        break;
                    case 4:
                        e = n.status, Ue("status", e), 1223 === e && (e = 204), 12005 !== e && 12029 !== e || (e = 0), Ue("finish", e, n.responseText), i.emit("finish", e, n.responseText), i._cleanup(!1)
                }
            }
        };
        try {
            i.xhr.send(n)
        } catch (t) {
            i.emit("finish", 0, ""), i._cleanup(!1)
        }
    }, Le.prototype._cleanup = function (t) {
        if (Ue("cleanup"), this.xhr) {
            if (this.removeAllListeners(), Ae.unloadDel(this.unloadRef), this.xhr.onreadystatechange = function () {
            }, this.xhr.ontimeout && (this.xhr.ontimeout = null), t) try {
                this.xhr.abort()
            } catch (t) {
            }
            this.unloadRef = this.xhr = null
        }
    }, Le.prototype.close = function () {
        Ue("close"), this._cleanup(!0)
    }, Le.enabled = !!Be;
    var Pe = ["Active"].concat("Object").join("X");
    !Le.enabled && Pe in W && (Ue("overriding xmlhttprequest"), Be = function () {
        try {
            return new W[Pe]("Microsoft.XMLHTTP")
        } catch (t) {
            return null
        }
    }, Le.enabled = !!new Be);
    var je = !1;
    try {
        je = "withCredentials" in new Be
    } catch (t) {
    }
    Le.supportsCORS = je;
    var Me = Le, De = Mt.exports, Ve = Me;

    function He(t, e, n, o) {
        Ve.call(this, t, e, n, o)
    }

    De(He, Ve), He.enabled = Ve.enabled && Ve.supportsCORS;
    var ze = He, Je = Mt.exports, qe = Me;

    function Ge(t, e, n) {
        qe.call(this, t, e, n, {noCredentials: !0})
    }

    Je(Ge, qe), Ge.enabled = qe.enabled;
    var Xe = Ge, Qe = {
        isOpera: function () {
            return W.navigator && /opera/i.test(W.navigator.userAgent)
        }, isKonqueror: function () {
            return W.navigator && /konqueror/i.test(W.navigator.userAgent)
        }, hasDomain: function () {
            if (!W.document) return !0;
            try {
                return !!W.document.domain
            } catch (t) {
                return !1
            }
        }
    }, $e = Mt.exports, Ze = Ee, Ke = We, Ye = ze, tn = Xe, en = Qe;

    function nn(t) {
        if (!tn.enabled && !Ye.enabled) throw new Error("Transport created when disabled");
        Ze.call(this, t, "/xhr_streaming", Ke, Ye)
    }

    $e(nn, Ze), nn.enabled = function (t) {
        return !t.nullOrigin && (!en.isOpera() && Ye.enabled)
    }, nn.transportName = "xhr-streaming", nn.roundTrips = 2, nn.needBody = !!W.document;
    var on = nn, rn = Dt.EventEmitter, sn = Mt.exports, an = nt.exports, cn = Qe, ln = jt, un = function () {
    };

    function dn(t, e, n) {
        un(t, e);
        var o = this;
        rn.call(this), setTimeout((function () {
            o._start(t, e, n)
        }), 0)
    }

    "production" !== et.env.NODE_ENV && (un = _t.exports("sockjs-client:sender:xdr")), sn(dn, rn), dn.prototype._start = function (t, e, n) {
        un("_start");
        var o = this, i = new W.XDomainRequest;
        e = ln.addQuery(e, "t=" + +new Date), i.onerror = function () {
            un("onerror"), o._error()
        }, i.ontimeout = function () {
            un("ontimeout"), o._error()
        }, i.onprogress = function () {
            un("progress", i.responseText), o.emit("chunk", 200, i.responseText)
        }, i.onload = function () {
            un("load"), o.emit("finish", 200, i.responseText), o._cleanup(!1)
        }, this.xdr = i, this.unloadRef = an.unloadAdd((function () {
            o._cleanup(!0)
        }));
        try {
            this.xdr.open(t, e), this.timeout && (this.xdr.timeout = this.timeout), this.xdr.send(n)
        } catch (t) {
            this._error()
        }
    }, dn.prototype._error = function () {
        this.emit("finish", 0, ""), this._cleanup(!1)
    }, dn.prototype._cleanup = function (t) {
        if (un("cleanup", t), this.xdr) {
            if (this.removeAllListeners(), an.unloadDel(this.unloadRef), this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null, t) try {
                this.xdr.abort()
            } catch (t) {
            }
            this.unloadRef = this.xdr = null
        }
    }, dn.prototype.close = function () {
        un("close"), this._cleanup(!0)
    }, dn.enabled = !(!W.XDomainRequest || !cn.hasDomain());
    var hn = dn, pn = Mt.exports, fn = Ee, mn = We, gn = hn;

    function vn(t) {
        if (!gn.enabled) throw new Error("Transport created when disabled");
        fn.call(this, t, "/xhr_streaming", mn, gn)
    }

    pn(vn, fn), vn.enabled = function (t) {
        return !t.cookie_needed && !t.nullOrigin && (gn.enabled && t.sameScheme)
    }, vn.transportName = "xdr-streaming", vn.roundTrips = 2;
    var bn = vn, yn = W.EventSource, wn = Mt.exports, Cn = Dt.EventEmitter, xn = yn, Sn = function () {
    };

    function In(t) {
        Sn(t), Cn.call(this);
        var e = this, n = this.es = new xn(t);
        n.onmessage = function (t) {
            Sn("message", t.data), e.emit("message", decodeURI(t.data))
        }, n.onerror = function (t) {
            Sn("error", n.readyState, t);
            var o = 2 !== n.readyState ? "network" : "permanent";
            e._cleanup(), e._close(o)
        }
    }

    "production" !== et.env.NODE_ENV && (Sn = _t.exports("sockjs-client:receiver:eventsource")), wn(In, Cn), In.prototype.abort = function () {
        Sn("abort"), this._cleanup(), this._close("user")
    }, In.prototype._cleanup = function () {
        Sn("cleanup");
        var t = this.es;
        t && (t.onmessage = t.onerror = null, t.close(), this.es = null)
    }, In.prototype._close = function (t) {
        Sn("close", t);
        var e = this;
        setTimeout((function () {
            e.emit("close", null, t), e.removeAllListeners()
        }), 200)
    };
    var En = In, kn = Mt.exports, _n = Ee, Tn = En, On = ze, Wn = yn;

    function Nn(t) {
        if (!Nn.enabled()) throw new Error("Transport created when disabled");
        _n.call(this, t, "/eventsource", Tn, On)
    }

    kn(Nn, _n), Nn.enabled = function () {
        return !!Wn
    }, Nn.transportName = "eventsource", Nn.roundTrips = 2;
    var Fn = Nn, An = "1.6.1", Rn = {exports: {}};
    !function (t) {
        var e = nt.exports, n = Qe, o = function () {
        };
        "production" !== et.env.NODE_ENV && (o = _t.exports("sockjs-client:utils:iframe")), t.exports = {
            WPrefix: "_jp", currentWindowId: null, polluteGlobalNamespace: function () {
                t.exports.WPrefix in W || (W[t.exports.WPrefix] = {})
            }, postMessage: function (e, n) {
                W.parent !== W ? W.parent.postMessage(JSON.stringify({
                    windowId: t.exports.currentWindowId,
                    type: e,
                    data: n || ""
                }), "*") : o("Cannot postMessage, no parent window.", e, n)
            }, createIframe: function (t, n) {
                var i, r, s = W.document.createElement("iframe"), a = function () {
                    o("unattach"), clearTimeout(i);
                    try {
                        s.onload = null
                    } catch (t) {
                    }
                    s.onerror = null
                }, c = function () {
                    o("cleanup"), s && (a(), setTimeout((function () {
                        s && s.parentNode.removeChild(s), s = null
                    }), 0), e.unloadDel(r))
                }, l = function (t) {
                    o("onerror", t), s && (c(), n(t))
                };
                return s.src = t, s.style.display = "none", s.style.position = "absolute", s.onerror = function () {
                    l("onerror")
                }, s.onload = function () {
                    o("onload"), clearTimeout(i), i = setTimeout((function () {
                        l("onload timeout")
                    }), 2e3)
                }, W.document.body.appendChild(s), i = setTimeout((function () {
                    l("timeout")
                }), 15e3), r = e.unloadAdd(c), {
                    post: function (t, e) {
                        o("post", t, e), setTimeout((function () {
                            try {
                                s && s.contentWindow && s.contentWindow.postMessage(t, e)
                            } catch (t) {
                            }
                        }), 0)
                    }, cleanup: c, loaded: a
                }
            }, createHtmlfile: function (n, i) {
                var r, s, a, c = ["Active"].concat("Object").join("X"), l = new W[c]("htmlfile"), u = function () {
                    clearTimeout(r), a.onerror = null
                }, d = function () {
                    l && (u(), e.unloadDel(s), a.parentNode.removeChild(a), a = l = null, CollectGarbage())
                }, h = function (t) {
                    o("onerror", t), l && (d(), i(t))
                };
                l.open(), l.write('<html><script>document.domain="' + W.document.domain + '";<\/script></html>'), l.close(), l.parentWindow[t.exports.WPrefix] = W[t.exports.WPrefix];
                var p = l.createElement("div");
                return l.body.appendChild(p), a = l.createElement("iframe"), p.appendChild(a), a.src = n, a.onerror = function () {
                    h("onerror")
                }, r = setTimeout((function () {
                    h("timeout")
                }), 15e3), s = e.unloadAdd(d), {
                    post: function (t, e) {
                        try {
                            setTimeout((function () {
                                a && a.contentWindow && a.contentWindow.postMessage(t, e)
                            }), 0)
                        } catch (t) {
                        }
                    }, cleanup: d, loaded: u
                }
            }
        }, t.exports.iframeEnabled = !1, W.document && (t.exports.iframeEnabled = ("function" == typeof W.postMessage || "object" == typeof W.postMessage) && !n.isKonqueror())
    }(Rn);
    var Bn = Mt.exports, Un = Dt.EventEmitter, Ln = An, Pn = jt, jn = Rn.exports, Mn = nt.exports, Dn = st,
        Vn = function () {
        };

    function Hn(t, e, n) {
        if (!Hn.enabled()) throw new Error("Transport created when disabled");
        Un.call(this);
        var o = this;
        this.origin = Pn.getOrigin(n), this.baseUrl = n, this.transUrl = e, this.transport = t, this.windowId = Dn.string(8);
        var i = Pn.addPath(n, "/iframe.html") + "#" + this.windowId;
        Vn(t, e, i), this.iframeObj = jn.createIframe(i, (function (t) {
            Vn("err callback"), o.emit("close", 1006, "Unable to load an iframe (" + t + ")"), o.close()
        })), this.onmessageCallback = this._message.bind(this), Mn.attachEvent("message", this.onmessageCallback)
    }

    "production" !== et.env.NODE_ENV && (Vn = _t.exports("sockjs-client:transport:iframe")), Bn(Hn, Un), Hn.prototype.close = function () {
        if (Vn("close"), this.removeAllListeners(), this.iframeObj) {
            Mn.detachEvent("message", this.onmessageCallback);
            try {
                this.postMessage("c")
            } catch (t) {
            }
            this.iframeObj.cleanup(), this.iframeObj = null, this.onmessageCallback = this.iframeObj = null
        }
    }, Hn.prototype._message = function (t) {
        if (Vn("message", t.data), Pn.isOriginEqual(t.origin, this.origin)) {
            var e;
            try {
                e = JSON.parse(t.data)
            } catch (e) {
                return void Vn("bad json", t.data)
            }
            if (e.windowId === this.windowId) switch (e.type) {
                case"s":
                    this.iframeObj.loaded(), this.postMessage("s", JSON.stringify([Ln, this.transport, this.transUrl, this.baseUrl]));
                    break;
                case"t":
                    this.emit("message", e.data);
                    break;
                case"c":
                    var n;
                    try {
                        n = JSON.parse(e.data)
                    } catch (t) {
                        return void Vn("bad json", e.data)
                    }
                    this.emit("close", n[0], n[1]), this.close()
            } else Vn("mismatched window id", e.windowId, this.windowId)
        } else Vn("not same origin", t.origin, this.origin)
    }, Hn.prototype.postMessage = function (t, e) {
        Vn("postMessage", t, e), this.iframeObj.post(JSON.stringify({
            windowId: this.windowId,
            type: t,
            data: e || ""
        }), this.origin)
    }, Hn.prototype.send = function (t) {
        Vn("send", t), this.postMessage("m", t)
    }, Hn.enabled = function () {
        return jn.iframeEnabled
    }, Hn.transportName = "iframe", Hn.roundTrips = 2;
    var zn = Hn, Jn = {
        isObject: function (t) {
            var e = typeof t;
            return "function" === e || "object" === e && !!t
        }, extend: function (t) {
            if (!this.isObject(t)) return t;
            for (var e, n, o = 1, i = arguments.length; o < i; o++) for (n in e = arguments[o]) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t
        }
    }, qn = Mt.exports, Gn = zn, Xn = Jn, Qn = function (t) {
        function e(e, n) {
            Gn.call(this, t.transportName, e, n)
        }

        return qn(e, Gn), e.enabled = function (e, n) {
            if (!W.document) return !1;
            var o = Xn.extend({}, n);
            return o.sameOrigin = !0, t.enabled(o) && Gn.enabled()
        }, e.transportName = "iframe-" + t.transportName, e.needBody = !0, e.roundTrips = Gn.roundTrips + t.roundTrips - 1, e.facadeTransport = t, e
    }, $n = Mt.exports, Zn = Rn.exports, Kn = jt, Yn = Dt.EventEmitter, to = st, eo = function () {
    };

    function no(t) {
        eo(t), Yn.call(this);
        var e = this;
        Zn.polluteGlobalNamespace(), this.id = "a" + to.string(6), t = Kn.addQuery(t, "c=" + decodeURIComponent(Zn.WPrefix + "." + this.id)), eo("using htmlfile", no.htmlfileEnabled);
        var n = no.htmlfileEnabled ? Zn.createHtmlfile : Zn.createIframe;
        W[Zn.WPrefix][this.id] = {
            start: function () {
                eo("start"), e.iframeObj.loaded()
            }, message: function (t) {
                eo("message", t), e.emit("message", t)
            }, stop: function () {
                eo("stop"), e._cleanup(), e._close("network")
            }
        }, this.iframeObj = n(t, (function () {
            eo("callback"), e._cleanup(), e._close("permanent")
        }))
    }

    "production" !== et.env.NODE_ENV && (eo = _t.exports("sockjs-client:receiver:htmlfile")), $n(no, Yn), no.prototype.abort = function () {
        eo("abort"), this._cleanup(), this._close("user")
    }, no.prototype._cleanup = function () {
        eo("_cleanup"), this.iframeObj && (this.iframeObj.cleanup(), this.iframeObj = null), delete W[Zn.WPrefix][this.id]
    }, no.prototype._close = function (t) {
        eo("_close", t), this.emit("close", null, t), this.removeAllListeners()
    }, no.htmlfileEnabled = !1;
    var oo = ["Active"].concat("Object").join("X");
    if (oo in W) try {
        no.htmlfileEnabled = !!new W[oo]("htmlfile")
    } catch (t) {
    }
    no.enabled = no.htmlfileEnabled || Zn.iframeEnabled;
    var io = no, ro = Mt.exports, so = io, ao = Xe, co = Ee;

    function lo(t) {
        if (!so.enabled) throw new Error("Transport created when disabled");
        co.call(this, t, "/htmlfile", so, ao)
    }

    ro(lo, co), lo.enabled = function (t) {
        return so.enabled && t.sameOrigin
    }, lo.transportName = "htmlfile", lo.roundTrips = 2;
    var uo = lo, ho = Mt.exports, po = Ee, fo = We, mo = ze, go = Xe;

    function vo(t) {
        if (!go.enabled && !mo.enabled) throw new Error("Transport created when disabled");
        po.call(this, t, "/xhr", fo, mo)
    }

    ho(vo, po), vo.enabled = function (t) {
        return !t.nullOrigin && (!(!go.enabled || !t.sameOrigin) || mo.enabled)
    }, vo.transportName = "xhr-polling", vo.roundTrips = 2;
    var bo = vo, yo = Mt.exports, wo = Ee, Co = bn, xo = We, So = hn;

    function Io(t) {
        if (!So.enabled) throw new Error("Transport created when disabled");
        wo.call(this, t, "/xhr", xo, So)
    }

    yo(Io, wo), Io.enabled = Co.enabled, Io.transportName = "xdr-polling", Io.roundTrips = 2;
    var Eo = Io, ko = Rn.exports, _o = st, To = Qe, Oo = jt, Wo = Mt.exports, No = Dt.EventEmitter, Fo = function () {
    };

    function Ao(t) {
        Fo(t);
        var e = this;
        No.call(this), ko.polluteGlobalNamespace(), this.id = "a" + _o.string(6);
        var n = Oo.addQuery(t, "c=" + encodeURIComponent(ko.WPrefix + "." + this.id));
        W[ko.WPrefix][this.id] = this._callback.bind(this), this._createScript(n), this.timeoutId = setTimeout((function () {
            Fo("timeout"), e._abort(new Error("JSONP script loaded abnormally (timeout)"))
        }), Ao.timeout)
    }

    "production" !== et.env.NODE_ENV && (Fo = _t.exports("sockjs-client:receiver:jsonp")), Wo(Ao, No), Ao.prototype.abort = function () {
        if (Fo("abort"), W[ko.WPrefix][this.id]) {
            var t = new Error("JSONP user aborted read");
            t.code = 1e3, this._abort(t)
        }
    }, Ao.timeout = 35e3, Ao.scriptErrorTimeout = 1e3, Ao.prototype._callback = function (t) {
        Fo("_callback", t), this._cleanup(), this.aborting || (t && (Fo("message", t), this.emit("message", t)), this.emit("close", null, "network"), this.removeAllListeners())
    }, Ao.prototype._abort = function (t) {
        Fo("_abort", t), this._cleanup(), this.aborting = !0, this.emit("close", t.code, t.message), this.removeAllListeners()
    }, Ao.prototype._cleanup = function () {
        if (Fo("_cleanup"), clearTimeout(this.timeoutId), this.script2 && (this.script2.parentNode.removeChild(this.script2), this.script2 = null), this.script) {
            var t = this.script;
            t.parentNode.removeChild(t), t.onreadystatechange = t.onerror = t.onload = t.onclick = null, this.script = null
        }
        delete W[ko.WPrefix][this.id]
    }, Ao.prototype._scriptError = function () {
        Fo("_scriptError");
        var t = this;
        this.errorTimer || (this.errorTimer = setTimeout((function () {
            t.loadedOkay || t._abort(new Error("JSONP script loaded abnormally (onerror)"))
        }), Ao.scriptErrorTimeout))
    }, Ao.prototype._createScript = function (t) {
        Fo("_createScript", t);
        var e, n = this, o = this.script = W.document.createElement("script");
        if (o.id = "a" + _o.string(8), o.src = t, o.type = "text/javascript", o.charset = "UTF-8", o.onerror = this._scriptError.bind(this), o.onload = function () {
            Fo("onload"), n._abort(new Error("JSONP script loaded abnormally (onload)"))
        }, o.onreadystatechange = function () {
            if (Fo("onreadystatechange", o.readyState), /loaded|closed/.test(o.readyState)) {
                if (o && o.htmlFor && o.onclick) {
                    n.loadedOkay = !0;
                    try {
                        o.onclick()
                    } catch (t) {
                    }
                }
                o && n._abort(new Error("JSONP script loaded abnormally (onreadystatechange)"))
            }
        }, void 0 === o.async && W.document.attachEvent) if (To.isOpera()) (e = this.script2 = W.document.createElement("script")).text = "try{var a = document.getElementById('" + o.id + "'); if(a)a.onerror();}catch(x){};", o.async = e.async = !1; else {
            try {
                o.htmlFor = o.id, o.event = "onclick"
            } catch (t) {
            }
            o.async = !0
        }
        void 0 !== o.async && (o.async = !0);
        var i = W.document.getElementsByTagName("head")[0];
        i.insertBefore(o, i.firstChild), e && i.insertBefore(e, i.firstChild)
    };
    var Ro, Bo, Uo = Ao, Lo = st, Po = jt, jo = function () {
    };
    "production" !== et.env.NODE_ENV && (jo = _t.exports("sockjs-client:sender:jsonp"));
    var Mo = Mt.exports, Do = ye, Vo = Uo, Ho = function (t, e, n) {
        jo(t, e), Ro || (jo("createForm"), (Ro = W.document.createElement("form")).style.display = "none", Ro.style.position = "absolute", Ro.method = "POST", Ro.enctype = "application/x-www-form-urlencoded", Ro.acceptCharset = "UTF-8", (Bo = W.document.createElement("textarea")).name = "d", Ro.appendChild(Bo), W.document.body.appendChild(Ro));
        var o = "a" + Lo.string(8);
        Ro.target = o, Ro.action = Po.addQuery(Po.addPath(t, "/jsonp_send"), "i=" + o);
        var i = function (t) {
            jo("createIframe", t);
            try {
                return W.document.createElement('<iframe name="' + t + '">')
            } catch (n) {
                var e = W.document.createElement("iframe");
                return e.name = t, e
            }
        }(o);
        i.id = o, i.style.display = "none", Ro.appendChild(i);
        try {
            Bo.value = e
        } catch (t) {
        }
        Ro.submit();
        var r = function (t) {
            jo("completed", o, t), i.onerror && (i.onreadystatechange = i.onerror = i.onload = null, setTimeout((function () {
                jo("cleaning up", o), i.parentNode.removeChild(i), i = null
            }), 500), Bo.value = "", n(t))
        };
        return i.onerror = function () {
            jo("onerror", o), r()
        }, i.onload = function () {
            jo("onload", o), r()
        }, i.onreadystatechange = function (t) {
            jo("onreadystatechange", o, i.readyState, t), "complete" === i.readyState && r()
        }, function () {
            jo("aborted", o), r(new Error("Aborted"))
        }
    };

    function zo(t) {
        if (!zo.enabled()) throw new Error("Transport created when disabled");
        Do.call(this, t, "/jsonp", Ho, Vo)
    }

    Mo(zo, Do), zo.enabled = function () {
        return !!W.document
    }, zo.transportName = "jsonp-polling", zo.roundTrips = 1, zo.needBody = !0;
    var Jo, qo = zo, Go = [ne, on, bn, Fn, Qn(Fn), uo, Qn(uo), bo, Eo, Qn(bo), qo], Xo = Array.prototype,
        Qo = Object.prototype, $o = Function.prototype, Zo = String.prototype, Ko = Xo.slice, Yo = Qo.toString,
        ti = function (t) {
            return "[object Function]" === Qo.toString.call(t)
        }, ei = function (t) {
            return "[object String]" === Yo.call(t)
        }, ni = Object.defineProperty && function () {
            try {
                return Object.defineProperty({}, "x", {}), !0
            } catch (t) {
                return !1
            }
        }();
    Jo = ni ? function (t, e, n, o) {
        !o && e in t || Object.defineProperty(t, e, {configurable: !0, enumerable: !1, writable: !0, value: n})
    } : function (t, e, n, o) {
        !o && e in t || (t[e] = n)
    };
    var oi = function (t, e, n) {
        for (var o in e) Qo.hasOwnProperty.call(e, o) && Jo(t, o, e[o], n)
    }, ii = function (t) {
        if (null == t) throw new TypeError("can't convert " + t + " to object");
        return Object(t)
    };

    function ri() {
    }

    oi($o, {
        bind: function (t) {
            var e = this;
            if (!ti(e)) throw new TypeError("Function.prototype.bind called on incompatible " + e);
            for (var n = Ko.call(arguments, 1), o = Math.max(0, e.length - n.length), i = [], r = 0; r < o; r++) i.push("$" + r);
            var s = Function("binder", "return function (" + i.join(",") + "){ return binder.apply(this, arguments); }")((function () {
                if (this instanceof s) {
                    var o = e.apply(this, n.concat(Ko.call(arguments)));
                    return Object(o) === o ? o : this
                }
                return e.apply(t, n.concat(Ko.call(arguments)))
            }));
            return e.prototype && (ri.prototype = e.prototype, s.prototype = new ri, ri.prototype = null), s
        }
    }), oi(Array, {
        isArray: function (t) {
            return "[object Array]" === Yo.call(t)
        }
    });
    var si, ai, ci, li = Object("a"), ui = "a" !== li[0] || !(0 in li);
    oi(Xo, {
        forEach: function (t) {
            var e = ii(this), n = ui && ei(this) ? this.split("") : e, o = arguments[1], i = -1, r = n.length >>> 0;
            if (!ti(t)) throw new TypeError;
            for (; ++i < r;) i in n && t.call(o, n[i], i, e)
        }
    }, (si = Xo.forEach, ai = !0, ci = !0, si && (si.call("foo", (function (t, e, n) {
        "object" != typeof n && (ai = !1)
    })), si.call([1], (function () {
        ci = "string" == typeof this
    }), "x")), !(si && ai && ci)));
    var di = Array.prototype.indexOf && -1 !== [0, 1].indexOf(1, 2);
    oi(Xo, {
        indexOf: function (t) {
            var e = ui && ei(this) ? this.split("") : ii(this), n = e.length >>> 0;
            if (!n) return -1;
            var o, i = 0;
            for (arguments.length > 1 && ((o = +arguments[1]) != o ? o = 0 : 0 !== o && o !== 1 / 0 && o !== -1 / 0 && (o = (o > 0 || -1) * Math.floor(Math.abs(o))), i = o), i = i >= 0 ? i : Math.max(0, n + i); i < n; i++) if (i in e && e[i] === t) return i;
            return -1
        }
    }, di);
    var hi, pi = Zo.split;
    2 !== "ab".split(/(?:ab)*/).length || 4 !== ".".split(/(.?)(.?)/).length || "t" === "tesst".split(/(s)*/)[1] || 4 !== "test".split(/(?:)/, -1).length || "".split(/.?/).length || ".".split(/()()/).length > 1 ? (hi = void 0 === /()??/.exec("")[1], Zo.split = function (t, e) {
        var n = this;
        if (void 0 === t && 0 === e) return [];
        if ("[object RegExp]" !== Yo.call(t)) return pi.call(this, t, e);
        var o, i, r, s, a = [],
            c = (t.ignoreCase ? "i" : "") + (t.multiline ? "m" : "") + (t.extended ? "x" : "") + (t.sticky ? "y" : ""),
            l = 0;
        for (t = new RegExp(t.source, c + "g"), n += "", hi || (o = new RegExp("^" + t.source + "$(?!\\s)", c)), e = void 0 === e ? -1 >>> 0 : e >>> 0; (i = t.exec(n)) && !((r = i.index + i[0].length) > l && (a.push(n.slice(l, i.index)), !hi && i.length > 1 && i[0].replace(o, (function () {
            for (var t = 1; t < arguments.length - 2; t++) void 0 === arguments[t] && (i[t] = void 0)
        })), i.length > 1 && i.index < n.length && Xo.push.apply(a, i.slice(1)), s = i[0].length, l = r, a.length >= e));) t.lastIndex === i.index && t.lastIndex++;
        return l === n.length ? !s && t.test("") || a.push("") : a.push(n.slice(l)), a.length > e ? a.slice(0, e) : a
    }) : "0".split(void 0, 0).length && (Zo.split = function (t, e) {
        return void 0 === t && 0 === e ? [] : pi.call(this, t, e)
    });
    var fi = Zo.substr, mi = "".substr && "b" !== "0b".substr(-1);
    oi(Zo, {
        substr: function (t, e) {
            return fi.call(this, t < 0 && (t = this.length + t) < 0 ? 0 : t, e)
        }
    }, mi);
    var gi,
        vi = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
        bi = {
            quote: function (t) {
                var e = JSON.stringify(t);
                return vi.lastIndex = 0, vi.test(e) ? (gi || (gi = function (t) {
                    var e, n = {}, o = [];
                    for (e = 0; e < 65536; e++) o.push(String.fromCharCode(e));
                    return t.lastIndex = 0, o.join("").replace(t, (function (t) {
                        return n[t] = "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4), ""
                    })), t.lastIndex = 0, n
                }(vi)), e.replace(vi, (function (t) {
                    return gi[t]
                }))) : e
            }
        }, yi = function () {
        };
    "production" !== et.env.NODE_ENV && (yi = _t.exports("sockjs-client:utils:transport"));
    var wi = {};
    ["log", "debug", "warn"].forEach((function (t) {
        var e;
        try {
            e = W.console && W.console[t] && W.console[t].apply
        } catch (t) {
        }
        wi[t] = e ? function () {
            return W.console[t].apply(W.console, arguments)
        } : "log" === t ? function () {
        } : wi.log
    }));
    var Ci = wi;

    function xi(t) {
        this.type = t
    }

    xi.prototype.initEvent = function (t, e, n) {
        return this.type = t, this.bubbles = e, this.cancelable = n, this.timeStamp = +new Date, this
    }, xi.prototype.stopPropagation = function () {
    }, xi.prototype.preventDefault = function () {
    }, xi.CAPTURING_PHASE = 1, xi.AT_TARGET = 2, xi.BUBBLING_PHASE = 3;
    var Si = xi, Ii = W.location || {
        origin: "http://localhost:80",
        protocol: "http:",
        host: "localhost",
        port: 80,
        href: "http://localhost/",
        hash: ""
    }, Ei = Mt.exports, ki = Si;

    function _i() {
        ki.call(this), this.initEvent("close", !1, !1), this.wasClean = !1, this.code = 0, this.reason = ""
    }

    Ei(_i, ki);
    var Ti = _i, Oi = Mt.exports, Wi = Si;

    function Ni(t) {
        Wi.call(this), this.initEvent("message", !1, !1), this.data = t
    }

    Oi(Ni, Wi);
    var Fi = Ni, Ai = Dt.EventEmitter;

    function Ri() {
        var t = this;
        Ai.call(this), this.to = setTimeout((function () {
            t.emit("finish", 200, "{}")
        }), Ri.timeout)
    }

    (0, Mt.exports)(Ri, Ai), Ri.prototype.close = function () {
        clearTimeout(this.to)
    }, Ri.timeout = 2e3;
    var Bi = Ri, Ui = Dt.EventEmitter, Li = Mt.exports, Pi = Jn, ji = function () {
    };

    function Mi(t, e) {
        Ui.call(this);
        var n = this, o = +new Date;
        this.xo = new e("GET", t), this.xo.once("finish", (function (t, e) {
            var i, r;
            if (200 === t) {
                if (r = +new Date - o, e) try {
                    i = JSON.parse(e)
                } catch (t) {
                    ji("bad json", e)
                }
                Pi.isObject(i) || (i = {})
            }
            n.emit("finish", i, r), n.removeAllListeners()
        }))
    }

    "production" !== et.env.NODE_ENV && (ji = _t.exports("sockjs-client:info-ajax")), Li(Mi, Ui), Mi.prototype.close = function () {
        this.removeAllListeners(), this.xo.close()
    };
    var Di = Mi, Vi = Mt.exports, Hi = Dt.EventEmitter, zi = Xe, Ji = Di;

    function qi(t) {
        var e = this;
        Hi.call(this), this.ir = new Ji(t, zi), this.ir.once("finish", (function (t, n) {
            e.ir = null, e.emit("message", JSON.stringify([t, n]))
        }))
    }

    Vi(qi, Hi), qi.transportName = "iframe-info-receiver", qi.prototype.close = function () {
        this.ir && (this.ir.close(), this.ir = null), this.removeAllListeners()
    };
    var Gi = qi, Xi = Dt.EventEmitter, Qi = Mt.exports, $i = nt.exports, Zi = zn, Ki = Gi, Yi = function () {
    };

    function tr(t, e) {
        var n = this;
        Xi.call(this);
        var o = function () {
            var o = n.ifr = new Zi(Ki.transportName, e, t);
            o.once("message", (function (t) {
                if (t) {
                    var e;
                    try {
                        e = JSON.parse(t)
                    } catch (e) {
                        return Yi("bad json", t), n.emit("finish"), void n.close()
                    }
                    var o = e[0], i = e[1];
                    n.emit("finish", o, i)
                }
                n.close()
            })), o.once("close", (function () {
                n.emit("finish"), n.close()
            }))
        };
        W.document.body ? o() : $i.attachEvent("load", o)
    }

    "production" !== et.env.NODE_ENV && (Yi = _t.exports("sockjs-client:info-iframe")), Qi(tr, Xi), tr.enabled = function () {
        return Zi.enabled()
    }, tr.prototype.close = function () {
        this.ifr && this.ifr.close(), this.removeAllListeners(), this.ifr = null
    };
    var er = tr, nr = Dt.EventEmitter, or = Mt.exports, ir = jt, rr = hn, sr = ze, ar = Xe, cr = Bi, lr = er, ur = Di,
        dr = function () {
        };

    function hr(t, e) {
        dr(t);
        var n = this;
        nr.call(this), setTimeout((function () {
            n.doXhr(t, e)
        }), 0)
    }

    "production" !== et.env.NODE_ENV && (dr = _t.exports("sockjs-client:info-receiver")), or(hr, nr), hr._getReceiver = function (t, e, n) {
        return n.sameOrigin ? new ur(e, ar) : sr.enabled ? new ur(e, sr) : rr.enabled && n.sameScheme ? new ur(e, rr) : lr.enabled() ? new lr(t, e) : new ur(e, cr)
    }, hr.prototype.doXhr = function (t, e) {
        var n = this, o = ir.addPath(t, "/info");
        dr("doXhr", o), this.xo = hr._getReceiver(t, o, e), this.timeoutRef = setTimeout((function () {
            dr("timeout"), n._cleanup(!1), n.emit("finish")
        }), hr.timeout), this.xo.once("finish", (function (t, e) {
            dr("finish", t, e), n._cleanup(!0), n.emit("finish", t, e)
        }))
    }, hr.prototype._cleanup = function (t) {
        dr("_cleanup"), clearTimeout(this.timeoutRef), this.timeoutRef = null, !t && this.xo && this.xo.close(), this.xo = null
    }, hr.prototype.close = function () {
        dr("close"), this.removeAllListeners(), this._cleanup(!1)
    }, hr.timeout = 8e3;
    var pr = hr, fr = Rn.exports;

    function mr(t) {
        this._transport = t, t.on("message", this._transportMessage.bind(this)), t.on("close", this._transportClose.bind(this))
    }

    mr.prototype._transportClose = function (t, e) {
        fr.postMessage("c", JSON.stringify([t, e]))
    }, mr.prototype._transportMessage = function (t) {
        fr.postMessage("t", t)
    }, mr.prototype._send = function (t) {
        this._transport.send(t)
    }, mr.prototype._close = function () {
        this._transport.close(), this._transport.removeAllListeners()
    };
    var gr = jt, vr = nt.exports, br = mr, yr = Gi, wr = Rn.exports, Cr = Ii, xr = function () {
    };
    "production" !== et.env.NODE_ENV && (xr = _t.exports("sockjs-client:iframe-bootstrap"));
    var Sr, Ir = kt, Er = Mt.exports, kr = st, _r = bi, Tr = jt, Or = nt.exports, Wr = function (t) {
        return {
            filterToEnabled: function (e, n) {
                var o = {main: [], facade: []};
                return e ? "string" == typeof e && (e = [e]) : e = [], t.forEach((function (t) {
                    t && ("websocket" !== t.transportName || !1 !== n.websocket ? e.length && -1 === e.indexOf(t.transportName) ? yi("not in whitelist", t.transportName) : t.enabled(n) ? (yi("enabled", t.transportName), o.main.push(t), t.facadeTransport && o.facade.push(t.facadeTransport)) : yi("disabled", t.transportName) : yi("disabled from server", "websocket"))
                })), o
            }
        }
    }, Nr = Jn, Fr = Qe, Ar = Ci, Rr = Si, Br = Ht, Ur = Ii, Lr = Ti, Pr = Fi, jr = pr, Mr = function () {
    };

    function Dr(t, e, n) {
        if (!(this instanceof Dr)) return new Dr(t, e, n);
        if (arguments.length < 1) throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
        Br.call(this), this.readyState = Dr.CONNECTING, this.extensions = "", this.protocol = "", (n = n || {}).protocols_whitelist && Ar.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead."), this._transportsWhitelist = n.transports, this._transportOptions = n.transportOptions || {}, this._timeout = n.timeout || 0;
        var o = n.sessionId || 8;
        if ("function" == typeof o) this._generateSessionId = o; else {
            if ("number" != typeof o) throw new TypeError("If sessionId is used in the options, it needs to be a number or a function.");
            this._generateSessionId = function () {
                return kr.string(o)
            }
        }
        this._server = n.server || kr.numberString(1e3);
        var i = new Ir(t);
        if (!i.host || !i.protocol) throw new SyntaxError("The URL '" + t + "' is invalid");
        if (i.hash) throw new SyntaxError("The URL must not contain a fragment");
        if ("http:" !== i.protocol && "https:" !== i.protocol) throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + i.protocol + "' is not allowed.");
        var r = "https:" === i.protocol;
        if ("https:" === Ur.protocol && !r && !Tr.isLoopbackAddr(i.hostname)) throw new Error("SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS");
        e ? Array.isArray(e) || (e = [e]) : e = [];
        var s = e.sort();
        s.forEach((function (t, e) {
            if (!t) throw new SyntaxError("The protocols entry '" + t + "' is invalid.");
            if (e < s.length - 1 && t === s[e + 1]) throw new SyntaxError("The protocols entry '" + t + "' is duplicated.")
        }));
        var a = Tr.getOrigin(Ur.href);
        this._origin = a ? a.toLowerCase() : null, i.set("pathname", i.pathname.replace(/\/+$/, "")), this.url = i.href, Mr("using url", this.url), this._urlInfo = {
            nullOrigin: !Fr.hasDomain(),
            sameOrigin: Tr.isOriginEqual(this.url, Ur.href),
            sameScheme: Tr.isSchemeEqual(this.url, Ur.href)
        }, this._ir = new jr(this.url, this._urlInfo), this._ir.once("finish", this._receiveInfo.bind(this))
    }

    function Vr(t) {
        return 1e3 === t || t >= 3e3 && t <= 4999
    }

    "production" !== et.env.NODE_ENV && (Mr = _t.exports("sockjs-client:main")), Er(Dr, Br), Dr.prototype.close = function (t, e) {
        if (t && !Vr(t)) throw new Error("InvalidAccessError: Invalid code");
        if (e && e.length > 123) throw new SyntaxError("reason argument has an invalid length");
        if (this.readyState !== Dr.CLOSING && this.readyState !== Dr.CLOSED) {
            this._close(t || 1e3, e || "Normal closure", !0)
        }
    }, Dr.prototype.send = function (t) {
        if ("string" != typeof t && (t = "" + t), this.readyState === Dr.CONNECTING) throw new Error("InvalidStateError: The connection has not been established yet");
        this.readyState === Dr.OPEN && this._transport.send(_r.quote(t))
    }, Dr.version = An, Dr.CONNECTING = 0, Dr.OPEN = 1, Dr.CLOSING = 2, Dr.CLOSED = 3, Dr.prototype._receiveInfo = function (t, e) {
        if (Mr("_receiveInfo", e), this._ir = null, t) {
            this._rto = this.countRTO(e), this._transUrl = t.base_url ? t.base_url : this.url, t = Nr.extend(t, this._urlInfo), Mr("info", t);
            var n = Sr.filterToEnabled(this._transportsWhitelist, t);
            this._transports = n.main, Mr(this._transports.length + " enabled transports"), this._connect()
        } else this._close(1002, "Cannot connect to server")
    }, Dr.prototype._connect = function () {
        for (var t = this._transports.shift(); t; t = this._transports.shift()) {
            if (Mr("attempt", t.transportName), t.needBody && (!W.document.body || void 0 !== W.document.readyState && "complete" !== W.document.readyState && "interactive" !== W.document.readyState)) return Mr("waiting for body"), this._transports.unshift(t), void Or.attachEvent("load", this._connect.bind(this));
            var e = Math.max(this._timeout, this._rto * t.roundTrips || 5e3);
            this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), e), Mr("using timeout", e);
            var n = Tr.addPath(this._transUrl, "/" + this._server + "/" + this._generateSessionId()),
                o = this._transportOptions[t.transportName];
            Mr("transport url", n);
            var i = new t(n, this._transUrl, o);
            return i.on("message", this._transportMessage.bind(this)), i.once("close", this._transportClose.bind(this)), i.transportName = t.transportName, void (this._transport = i)
        }
        this._close(2e3, "All transports failed", !1)
    }, Dr.prototype._transportTimeout = function () {
        Mr("_transportTimeout"), this.readyState === Dr.CONNECTING && (this._transport && this._transport.close(), this._transportClose(2007, "Transport timed out"))
    }, Dr.prototype._transportMessage = function (t) {
        Mr("_transportMessage", t);
        var e, n = this, o = t.slice(0, 1), i = t.slice(1);
        switch (o) {
            case"o":
                return void this._open();
            case"h":
                return this.dispatchEvent(new Rr("heartbeat")), void Mr("heartbeat", this.transport)
        }
        if (i) try {
            e = JSON.parse(i)
        } catch (t) {
            Mr("bad json", i)
        }
        if (void 0 !== e) switch (o) {
            case"a":
                Array.isArray(e) && e.forEach((function (t) {
                    Mr("message", n.transport, t), n.dispatchEvent(new Pr(t))
                }));
                break;
            case"m":
                Mr("message", this.transport, e), this.dispatchEvent(new Pr(e));
                break;
            case"c":
                Array.isArray(e) && 2 === e.length && this._close(e[0], e[1], !0)
        } else Mr("empty payload", i)
    }, Dr.prototype._transportClose = function (t, e) {
        Mr("_transportClose", this.transport, t, e), this._transport && (this._transport.removeAllListeners(), this._transport = null, this.transport = null), Vr(t) || 2e3 === t || this.readyState !== Dr.CONNECTING ? this._close(t, e) : this._connect()
    }, Dr.prototype._open = function () {
        Mr("_open", this._transport && this._transport.transportName, this.readyState), this.readyState === Dr.CONNECTING ? (this._transportTimeoutId && (clearTimeout(this._transportTimeoutId), this._transportTimeoutId = null), this.readyState = Dr.OPEN, this.transport = this._transport.transportName, this.dispatchEvent(new Rr("open")), Mr("connected", this.transport)) : this._close(1006, "Server lost session")
    }, Dr.prototype._close = function (t, e, n) {
        Mr("_close", this.transport, t, e, n, this.readyState);
        var o = !1;
        if (this._ir && (o = !0, this._ir.close(), this._ir = null), this._transport && (this._transport.close(), this._transport = null, this.transport = null), this.readyState === Dr.CLOSED) throw new Error("InvalidStateError: SockJS has already been closed");
        this.readyState = Dr.CLOSING, setTimeout(function () {
            this.readyState = Dr.CLOSED, o && this.dispatchEvent(new Rr("error"));
            var i = new Lr;
            i.wasClean = n || !1, i.code = t || 1e3, i.reason = e, this.dispatchEvent(i), this.onmessage = this.onclose = this.onerror = null, Mr("disconnected")
        }.bind(this), 0)
    }, Dr.prototype.countRTO = function (t) {
        return t > 100 ? 4 * t : 300 + t
    };
    var Hr, zr = (Sr = Wr(Hr = Go), function (t, e) {
        var n, o = {};
        e.forEach((function (t) {
            t.facadeTransport && (o[t.facadeTransport.transportName] = t.facadeTransport)
        })), o[yr.transportName] = yr, t.bootstrap_iframe = function () {
            var e;
            wr.currentWindowId = Cr.hash.slice(1), vr.attachEvent("message", (function (i) {
                if (i.source === parent && (void 0 === n && (n = i.origin), i.origin === n)) {
                    var r;
                    try {
                        r = JSON.parse(i.data)
                    } catch (t) {
                        return void xr("bad json", i.data)
                    }
                    if (r.windowId === wr.currentWindowId) switch (r.type) {
                        case"s":
                            var s;
                            try {
                                s = JSON.parse(r.data)
                            } catch (t) {
                                xr("bad json", r.data);
                                break
                            }
                            var a = s[0], c = s[1], l = s[2], u = s[3];
                            if (xr(a, c, l, u), a !== t.version) throw new Error('Incompatible SockJS! Main site uses: "' + a + '", the iframe: "' + t.version + '".');
                            if (!gr.isOriginEqual(l, Cr.href) || !gr.isOriginEqual(u, Cr.href)) throw new Error("Can't connect to different domain from within an iframe. (" + Cr.href + ", " + l + ", " + u + ")");
                            e = new br(new o[c](l, u));
                            break;
                        case"m":
                            e._send(r.data);
                            break;
                        case"c":
                            e && e._close(), e = null
                    }
                }
            })), wr.postMessage("s")
        }
    }(Dr, Hr), Dr);
    "_sockjs_onload" in W && setTimeout(W._sockjs_onload, 1);
    var Jr, qr = {};
    Jr = qr, function () {
        var t, e, n, o, i = {}.hasOwnProperty, r = [].slice;
        t = {LF: "\n", NULL: "\0"}, n = function () {
            var e;

            function n(t, e, n) {
                this.command = t, this.headers = null != e ? e : {}, this.body = null != n ? n : ""
            }

            return n.prototype.toString = function () {
                var e, o, r, s, a;
                for (o in e = [this.command], (r = !1 === this.headers["content-length"]) && delete this.headers["content-length"], a = this.headers) i.call(a, o) && (s = a[o], e.push(o + ":" + s));
                return this.body && !r && e.push("content-length:" + n.sizeOfUTF8(this.body)), e.push(t.LF + this.body), e.join(t.LF)
            }, n.sizeOfUTF8 = function (t) {
                return t ? encodeURI(t).match(/%..|./g).length : 0
            }, e = function (e) {
                var o, i, r, s, a, c, l, u, d, h, p, f, m, g, v, b, y;
                for (s = e.search(RegExp("" + t.LF + t.LF)), r = (a = e.substring(0, s).split(t.LF)).shift(), c = {}, f = function (t) {
                    return t.replace(/^\s+|\s+$/g, "")
                }, m = 0, v = (b = a.reverse()).length; m < v; m++) u = (h = b[m]).indexOf(":"), c[f(h.substring(0, u))] = f(h.substring(u + 1));
                if (o = "", p = s + 2, c["content-length"]) d = parseInt(c["content-length"]), o = ("" + e).substring(p, p + d); else for (i = null, l = g = p, y = e.length; (p <= y ? g < y : g > y) && (i = e.charAt(l)) !== t.NULL; l = p <= y ? ++g : --g) o += i;
                return new n(r, c, o)
            }, n.unmarshall = function (n) {
                var o;
                return function () {
                    var i, r, s, a;
                    for (a = [], i = 0, r = (s = n.split(RegExp("" + t.NULL + t.LF + "*"))).length; i < r; i++) (null != (o = s[i]) ? o.length : void 0) > 0 && a.push(e(o));
                    return a
                }()
            }, n.marshall = function (e, o, i) {
                return new n(e, o, i).toString() + t.NULL
            }, n
        }(), e = function () {
            var e;

            function i(t) {
                this.ws = t, this.ws.binaryType = "arraybuffer", this.counter = 0, this.connected = !1, this.heartbeat = {
                    outgoing: 1e4,
                    incoming: 1e4
                }, this.maxWebSocketFrameSize = 16384, this.subscriptions = {}
            }

            return i.prototype.debug = function (t) {
                var e;
                return "undefined" != typeof window && null !== window && null != (e = window.console) ? e.log(t) : void 0
            }, e = function () {
                return Date.now ? Date.now() : (new Date).valueOf
            }, i.prototype._transmit = function (t, e, o) {
                var i;
                for (i = n.marshall(t, e, o), "function" == typeof this.debug && this.debug(">>> " + i); ;) {
                    if (!(i.length > this.maxWebSocketFrameSize)) return this.ws.send(i);
                    this.ws.send(i.substring(0, this.maxWebSocketFrameSize)), i = i.substring(this.maxWebSocketFrameSize), "function" == typeof this.debug && this.debug("remaining = " + i.length)
                }
            }, i.prototype._setupHeartbeat = function (n) {
                var i, r, s, a, c, l, u;
                if ((c = n.version) === o.VERSIONS.V1_1 || c === o.VERSIONS.V1_2) return r = (l = function () {
                    var t, e, o, i;
                    for (i = [], t = 0, e = (o = n["heart-beat"].split(",")).length; t < e; t++) a = o[t], i.push(parseInt(a));
                    return i
                }())[0], i = l[1], 0 !== this.heartbeat.outgoing && 0 !== i && (s = Math.max(this.heartbeat.outgoing, i), "function" == typeof this.debug && this.debug("send PING every " + s + "ms"), this.pinger = o.setInterval(s, (u = this, function () {
                    return u.ws.send(t.LF), "function" == typeof u.debug ? u.debug(">>> PING") : void 0
                }))), 0 !== this.heartbeat.incoming && 0 !== r ? (s = Math.max(this.heartbeat.incoming, r), "function" == typeof this.debug && this.debug("check PONG every " + s + "ms"), this.ponger = o.setInterval(s, function (t) {
                    return function () {
                        var n;
                        if ((n = e() - t.serverActivity) > 2 * s) return "function" == typeof t.debug && t.debug("did not receive server activity for the last " + n + "ms"), t.ws.close()
                    }
                }(this))) : void 0
            }, i.prototype._parseConnect = function () {
                var t, e, n, o;
                switch (o = {}, (t = 1 <= arguments.length ? r.call(arguments, 0) : []).length) {
                    case 2:
                        o = t[0], e = t[1];
                        break;
                    case 3:
                        t[1] instanceof Function ? (o = t[0], e = t[1], n = t[2]) : (o.login = t[0], o.passcode = t[1], e = t[2]);
                        break;
                    case 4:
                        o.login = t[0], o.passcode = t[1], e = t[2], n = t[3];
                        break;
                    default:
                        o.login = t[0], o.passcode = t[1], e = t[2], n = t[3], o.host = t[4]
                }
                return [o, e, n]
            }, i.prototype.connect = function () {
                var i, s, a, c, l;
                return i = 1 <= arguments.length ? r.call(arguments, 0) : [], c = this._parseConnect.apply(this, i), a = c[0], this.connectCallback = c[1], s = c[2], "function" == typeof this.debug && this.debug("Opening Web Socket..."), this.ws.onmessage = (l = this, function (o) {
                    var i, r, a, c, u, d, h, p, f, m, g, v;
                    if (c = "undefined" != typeof ArrayBuffer && o.data instanceof ArrayBuffer ? (i = new Uint8Array(o.data), "function" == typeof l.debug && l.debug("--- got data length: " + i.length), function () {
                        var t, e, n;
                        for (n = [], t = 0, e = i.length; t < e; t++) r = i[t], n.push(String.fromCharCode(r));
                        return n
                    }().join("")) : o.data, l.serverActivity = e(), c !== t.LF) {
                        for ("function" == typeof l.debug && l.debug("<<< " + c), v = [], f = 0, m = (g = n.unmarshall(c)).length; f < m; f++) switch ((u = g[f]).command) {
                            case"CONNECTED":
                                "function" == typeof l.debug && l.debug("connected to server " + u.headers.server), l.connected = !0, l._setupHeartbeat(u.headers), v.push("function" == typeof l.connectCallback ? l.connectCallback(u) : void 0);
                                break;
                            case"MESSAGE":
                                p = u.headers.subscription, (h = l.subscriptions[p] || l.onreceive) ? (a = l, d = u.headers["message-id"], u.ack = function (t) {
                                    return null == t && (t = {}), a.ack(d, p, t)
                                }, u.nack = function (t) {
                                    return null == t && (t = {}), a.nack(d, p, t)
                                }, v.push(h(u))) : v.push("function" == typeof l.debug ? l.debug("Unhandled received MESSAGE: " + u) : void 0);
                                break;
                            case"RECEIPT":
                                v.push("function" == typeof l.onreceipt ? l.onreceipt(u) : void 0);
                                break;
                            case"ERROR":
                                v.push("function" == typeof s ? s(u) : void 0);
                                break;
                            default:
                                v.push("function" == typeof l.debug ? l.debug("Unhandled frame: " + u) : void 0)
                        }
                        return v
                    }
                    "function" == typeof l.debug && l.debug("<<< PONG")
                }), this.ws.onclose = function (t) {
                    return function () {
                        var e;
                        return e = "Whoops! Lost connection to " + t.ws.url, "function" == typeof t.debug && t.debug(e), t._cleanUp(), "function" == typeof s ? s(e) : void 0
                    }
                }(this), this.ws.onopen = function (t) {
                    return function () {
                        return "function" == typeof t.debug && t.debug("Web Socket Opened..."), a["accept-version"] = o.VERSIONS.supportedVersions(), a["heart-beat"] = [t.heartbeat.outgoing, t.heartbeat.incoming].join(","), t._transmit("CONNECT", a)
                    }
                }(this)
            }, i.prototype.disconnect = function (t, e) {
                return null == e && (e = {}), this._transmit("DISCONNECT", e), this.ws.onclose = null, this.ws.close(), this._cleanUp(), "function" == typeof t ? t() : void 0
            }, i.prototype._cleanUp = function () {
                if (this.connected = !1, this.pinger && o.clearInterval(this.pinger), this.ponger) return o.clearInterval(this.ponger)
            }, i.prototype.send = function (t, e, n) {
                return null == e && (e = {}), null == n && (n = ""), e.destination = t, this._transmit("SEND", e, n)
            }, i.prototype.subscribe = function (t, e, n) {
                var o;
                return null == n && (n = {}), n.id || (n.id = "sub-" + this.counter++), n.destination = t, this.subscriptions[n.id] = e, this._transmit("SUBSCRIBE", n), o = this, {
                    id: n.id,
                    unsubscribe: function () {
                        return o.unsubscribe(n.id)
                    }
                }
            }, i.prototype.unsubscribe = function (t) {
                return delete this.subscriptions[t], this._transmit("UNSUBSCRIBE", {id: t})
            }, i.prototype.begin = function (t) {
                var e, n;
                return n = t || "tx-" + this.counter++, this._transmit("BEGIN", {transaction: n}), e = this, {
                    id: n,
                    commit: function () {
                        return e.commit(n)
                    },
                    abort: function () {
                        return e.abort(n)
                    }
                }
            }, i.prototype.commit = function (t) {
                return this._transmit("COMMIT", {transaction: t})
            }, i.prototype.abort = function (t) {
                return this._transmit("ABORT", {transaction: t})
            }, i.prototype.ack = function (t, e, n) {
                return null == n && (n = {}), n["message-id"] = t, n.subscription = e, this._transmit("ACK", n)
            }, i.prototype.nack = function (t, e, n) {
                return null == n && (n = {}), n["message-id"] = t, n.subscription = e, this._transmit("NACK", n)
            }, i
        }(), o = {
            VERSIONS: {
                V1_0: "1.0", V1_1: "1.1", V1_2: "1.2", supportedVersions: function () {
                    return "1.1,1.0"
                }
            }, client: function (t, n) {
                var i;
                return null == n && (n = ["v10.stomp", "v11.stomp"]), i = new (o.WebSocketClass || WebSocket)(t, n), new e(i)
            }, over: function (t) {
                return new e(t)
            }, Frame: n
        }, null !== Jr && (Jr.Stomp = o), "undefined" != typeof window && null !== window ? (o.setInterval = function (t, e) {
            return window.setInterval(e, t)
        }, o.clearInterval = function (t) {
            return window.clearInterval(t)
        }, window.Stomp = o) : Jr || (self.Stomp = o)
    }.call(W);
    var Gr = function () {
        function n(t) {
            this.params = t, this.reconnectCount = 0, this.connectionParams = t, this.connectHeader = {
                accessId: t.accessId,
                visitorId: t.visitorId
            }
        }

        return n.prototype.onMessage = function (t) {
            var n = JSON.parse(t.body);
            if ("event" === n.type) {
                switch (n.event) {
                    case"disconnect":
                        this.wsClient.disconnect();
                        break;
                    case"chatInvite":
                        if (!e.isSessionPage || n.appId !== e.visitor.getAccessId()) return;
                        e.sessionOpenType = 3, e.isOpen ? window.ClinkChatWeb.openChatWindow() : window.ClinkChatWeb.openSessionWindow(!0);
                        break;
                    case"systemInvite":
                        if (!e.isSessionPage || n.appId !== e.visitor.getAccessId()) return;
                        e.sessionOpenType = 4, e.inviteText = n.invitationWay.invitationMsg || "", e.startSessionAfterInvite = n.startSessionAfterInvite, 1 === e.btnConfig.popStyle && 0 === e.btnConfig.type ? (S.loadChatWindowIframe(e.visitor.getVisitorParams()), e.iframe = e.iframe || document.getElementById("tinet-chat-iframe"), e.tinetWebChatFrame.style.display = "block", e.iframe.addEventListener("load", (function () {
                            S.iframeLoaded(), e.iframeLoadedNum++
                        })), e.iframeLoadedNum > 0 && S.iframeLoaded()) : 1 === e.btnConfig.popStyle && e.tinetBtnContainer && e.tinetBtnContainer && e.tinetBtnContainer.hide();
                        break;
                    case"dialogClose":
                        S.closeChatWindow();
                        break;
                    case"kickout":
                        window.ClinkChatWeb.kickOutWindow(n.wsSessionId)
                }
                e.ws && (e.ws.reconnectCount = 0)
            }
        }, n.prototype.onConnectError = function (t) {
            console.warn("trackè¿žæŽ¥å¼‚å¸¸, " + t), this.wsClient.connected || this.reconnectCount++ <= 10 && setTimeout(this.connect, 1e3 * Math.floor(8 * Math.random() + 3))
        }, n.prototype.connect = function (n) {
            var o = this,
                i = t(t({}, this.connectionParams), {callback: "", pageUrl: decodeURIComponent(location.href)}),
                r = g.objectToQueryString(i), s = "".concat(e.chatWebApiDomain, "/track?").concat(r);
            g.generateSessionId();
            var a = new zr(s, {}, {transports: "websocket", sessionId: g.generateSessionId});
            this.wsClient = qr.Stomp.over(a), this.wsClient.heartbeat.incoming = 25e3, this.wsClient.heartbeat.outgoing = 25e3, this.wsClient.connect(this.connectHeader, (function () {
                o.reconnectCount = 0, o.wsClient.subscribe("/user/track", o.onMessage), n && n()
            }), this.onConnectError)
        }, n.prototype.disconnect = function () {
            this.wsClient.disconnect()
        }, n.prototype.getConnected = function () {
            return !!this.wsClient && this.wsClient.connected
        }, n.prototype.sendToken = function (t, e) {
            e = null === e ? {} : e;
            var n = t.type;
            delete t.type, this.wsClient && this.wsClient.send("/app/track/handle/" + n, e, JSON.stringify(t))
        }, n
    }();
    var Xr = function () {
        window.addEventListener("message", (function (t) {
            var n, o = t.data;
            if (o.id && (!o.id || "tinet-chat-web" === o.id) && document.getElementById("TinetWebChatFrame")) switch (o.type) {
                case"minimum":
                    S.setMininumStyle(), window.ClinkChatWeb.setWindowStatus(o.type);
                    break;
                case"maximum":
                    S.setMaximun(), window.ClinkChatWeb.setWindowStatus(o.type);
                    break;
                case"close":
                    !function (t) {
                        window.ClinkChatWeb.dialogClose(), S.closeChatWindow(), window.ClinkChatWeb.setWindowStatus(t.type), e.unReadCount && C(document.getElementById("tinet-chat-visitor"), e.unReadCount, {
                            display: "inline-block",
                            height: "18px",
                            lineHeight: "18px",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            color: "#fff",
                            fontSize: "14px",
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#FF2600",
                            padding: "0 6px",
                            borderRadius: "10px"
                        })
                    }(o);
                    break;
                case"openSession":
                    var i = {
                        accessId: e.visitor.getAccessId(),
                        visitorId: o.trackParams.visitorId,
                        mainUniqueId: o.trackParams.mainUniqueId,
                        city: e.visitor.city,
                        province: e.visitor.province
                    };
                    y(i);
                    break;
                case"loaded":
                    w(), window.setTimeout((function () {
                        e.chatWebLoaded = !0
                    }), 500);
                    break;
                case"trackDisconnect":
                    null === (n = e.ws) || void 0 === n || n.disconnect();
                    break;
                case"unread":
                    !function (t) {
                        switch (e.unReadCount++, e.unReadCallback && e.unReadCallback(), window.ClinkChatWeb.getWindowStatus()) {
                            case"minimum":
                                t.newMsgAlert || C(document.getElementById("TinetWebChatFrame"), e.unReadCount, {
                                    display: "inline-block",
                                    height: "18px",
                                    lineHeight: "18px",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    color: "#fff",
                                    fontSize: "14px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "10px",
                                    transform: "translate(0, -50%)",
                                    backgroundColor: "#FF2600",
                                    padding: "0 6px",
                                    borderRadius: "10px"
                                });
                                break;
                            case"close":
                                C(document.getElementById("tinet-chat-visitor"), e.unReadCount, {
                                    display: "inline-block",
                                    height: "18px",
                                    lineHeight: "18px",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    color: "#fff",
                                    fontSize: "12px",
                                    position: "absolute",
                                    top: "5px",
                                    left: "5px",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: "#FF2600",
                                    padding: "0 6px",
                                    borderRadius: "10px"
                                }), e.sessionOpenType = 1;
                                break;
                            case"maximum":
                                document.getElementById("TinetWebChatFrame") && x(document.getElementById("TinetWebChatFrame")), document.getElementById("tinet-chat-visitor") && x(document.getElementById("tinet-chat-visitor"))
                        }
                    }(o);
                    break;
                case"clearUnread":
                    e.unReadCount = 0, document.getElementById("TinetWebChatFrame") && x(document.getElementById("TinetWebChatFrame")), document.getElementById("tinet-chat-visitor") && x(document.getElementById("tinet-chat-visitor")), e.tinetBtnContainer && (e.tinetBtnContainer.isClearUnread = !0);
                    break;
                case"viewImage":
                    S.postImageViewerMsg("imageData", o);
                    break;
                case"closeImageViewer":
                    e.imageViewerIframe.style.display = "none"
            }
        }))
    }, Qr = {
        createImgShowHtml: function (t) {
            return this._createImgShowHtml(t)
        }, removeImageShowHtml: function () {
            return this._removeImageShowHtml()
        }, _createImgShowHtml: function (t) {
            var n;
            if (n = 1 === t ? e.btnConfig.menuFirstImageName : e.btnConfig.menuSecondImageName) {
                var o = g.getIconUrl({icon: n, accessId: e.visitor.getAccessId()}), i = "right";
                switch (e.btnConfig.position.place) {
                    case 1:
                    case 3:
                        i = "left";
                        break;
                    default:
                        i = "right"
                }
                if (e.tinetImageContainer) {
                    document.getElementById("tinet-popover-img").src = o, e.tinetImageContainer.style.display = "block"
                } else {
                    var r = '<div id="tinet-img-popover" style="position:absolute; top:0; ' + i + ':195px; background: none; z-index: 233262666236; display: block; min-width: 130px;min-height: 130px;"><img id="tinet-popover-img" src="' + o + '" style="display:inline-block; width:100%;height:100%;"/></div>';
                    e.tinetImageContainer = document.createElement("div"), e.tinetImageContainer.innerHTML = r, e.tinetPopoverContainer && e.tinetPopoverContainer.dom.appendChild(e.tinetImageContainer)
                }
            }
        }, _removeImageShowHtml: function () {
            e.tinetImageContainer && (e.tinetImageContainer.style.display = "none")
        }
    }, $r = "livechat_workbench_browse";
    return new (function () {
        function i() {
            this.init()
        }

        return i.prototype.init = function () {
            var n = this;
            if (console.log("*****new webchat.js*****"), window.tinetChatWebDev || window.tinetLocal) e.webSocketUrl = "https://webchat-bj-test0.clink.cn"; else for (var i = e.allScripts.length - 1; i > 0; i--) if (e.allScripts[i].src && e.trackJSReg.test(e.allScripts[i].src)) {
                e.webSocketUrl = e.allScripts[i].src.match(/^(http[s]?:\/\/[^/]+)\/webchat.js/)[1];
                break
            }
            if (e.webSocketUrl) {
                e.webSocketUrl.includes("chat-web") ? e.chatWebApiDomain = e.webSocketUrl.replace("chat-web", "chat-web-api") : e.webSocketUrl.includes("webchat") ? e.chatWebApiDomain = e.webSocketUrl.replace("webchat", "webchat-api") : e.chatWebApiDomain = e.webSocketUrl;
                var r = window.clinkWebchatOptions.options;
                o.store(), e.visitor = new a(r), r = t(t({}, r), e.visitor.getVisitorParams()), v(e.visitor.getBtnSettingParams(), (function (t) {
                    var o;
                    1 === t.result.borderStyle ? e.frameBorderRadius = 4 : e.frameBorderRadius = 3 === t.result.borderStyle ? 16 : 12, e.btnConfig = t.result[e.model], e.resourceItem = t.result.resourceItem, e.btnConfig.position || (e.btnConfig.position = {
                        place: 1,
                        bottomMargin: 0,
                        sideMargin: 0
                    });
                    var i = e.btnConfig.windowsSize;
                    e.tinetChatBoxSize.windowHeight = null !== (o = null == i ? void 0 : i.height) && void 0 !== o ? o : 530, 1 === e.btnConfig.windowType ? e.tinetChatBoxSize.windowWidth = e.btnConfig.windowsSize && e.btnConfig.windowsSize.width ? e.btnConfig.windowsSize.width : 350 : 2 === e.btnConfig.windowType && (e.tinetChatBoxSize.windowWidth = e.btnConfig.windowsSize ? (e.btnConfig.windowsSize.width || 350) + (e.btnConfig.windowsSize.sidebarWidth || 190) : 540), e.tinetChatBoxSize.windowSideMargin = e.btnConfig.windowsSize && e.btnConfig.windowsSize.sideMargin ? e.btnConfig.windowsSize.sideMargin : 16, e.tinetChatBoxSize.windowBottomMargin = e.btnConfig.windowsSize && e.btnConfig.windowsSize.bottomMargin ? e.btnConfig.windowsSize.bottomMargin : 2, e.trackWsDisabled = t.result.trackDisabled, e.trackDisabled = !e.resourceItem[$r], e.pageViewDisabled = t.result.pageViewDisabled || !1, ["tinetResponsive", "tinetFullScreen", "tinetFrame"].includes(window.tinetWebChatType) ? S.loadChatWindowIframe(e.visitor.getVisitorParams()) : O.render(r), e.trackWsDisabled || (e.ws = new Gr(r), e.ws.connect()), e.trackDisabled || e.pageViewDisabled || n.initTrack(r), e.isFocusWindow = !0, g.isFunction(window.clinkWebchatOptions.options.callback) && window.clinkWebchatOptions.options.callback()
                })), Xr(), window.onfocus = function () {
                    var t;
                    e.isFocusWindow || (e.isFocusWindow = !0, e.trackWsDisabled || setTimeout(null === (t = e.ws) || void 0 === t ? void 0 : t.connect, 2e3))
                }, window.addEventListener("unload", (function () {
                    window.onhashchange = null
                }), !1)
            } else console.error("websocket url is required!")
        }, i.prototype.initTrack = function (t) {
            b(t), window.onhashchange = function (e) {
                e.newURL !== e.oldURL && b(t)
            }
        }, i.prototype.setWindowStatus = function (t) {
            window.sessionStorage.setItem("tinetWindowStatus", t)
        }, i.prototype.getWindowStatus = function () {
            return window.sessionStorage.getItem("tinetWindowStatus")
        }, i.prototype.dialogClose = function () {
            var t;
            e.isOpen = !1, e.inviteText = "", null === (t = e.ws) || void 0 === t || t.sendToken({
                type: "dialog_close",
                visitorId: e.visitor.getVisitorId()
            })
        }, i.prototype.closeChatWindow = function () {
            var t = document.getElementById("TinetWebChatFrame");
            t && 1 === t.nodeType && (t.style.display = "none"), e.tinetBtnContainer && e.tinetBtnContainer.show(), e.isOpen = !1
        }, i.prototype.getUnReadNum = function () {
            return e.unReadCount
        }, i.prototype.registerUnRead = function (t) {
            g.isFunction(t) ? e.unReadCallback = t : n.error("è¯·ä¼ å…¥æ­£ç¡®çš„æ–¹æ³•")
        }, i.prototype.sendVisitorMsg = function (t) {
            S.postMessage("sendVisitorMsg", {event: "sendVisitorMsg", msg: t})
        }, i.prototype.getIconUrl = function (t) {
            return e.webSocketUrl + "/api/icon/" + t.icon + "?accessId=" + t.accessId + "&visitorId=" + e.visitor.getVisitorId()
        }, i.prototype.openSessionWindow = function (t, e) {
            return S.openSessionWindow(t, e)
        }, i.prototype.openChatWindow = function (t) {
            return S.openChatWindow(t)
        }, i.prototype.kickOutWindow = function (t) {
            return S.kickOutWindow(t)
        }, i.prototype.createImgShowHtml = function (t) {
            return Qr.createImgShowHtml(t)
        }, i.prototype.removeImageShowHtml = function () {
            return Qr.removeImageShowHtml()
        }, i.prototype.setVisitorExtraInfo = function (t) {
            var n = t;
            "object" == typeof t && (n = encodeURIComponent(JSON.stringify(t))), e.visitor.setVisitorInfo("visitorExtraInfo", n)
        }, i.prototype.websocketUrl = function () {
            return e.webSocketUrl
        }, i.prototype.getChatWebApiDomain = function () {
            return e.chatWebApiDomain
        }, i
    }())
}();
