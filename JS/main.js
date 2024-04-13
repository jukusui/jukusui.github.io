var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
///<reference path="./Variable.d.ts"/>
function OnReloadClick() {
    location.reload();
}
///<reference path="./Variable.d.ts"/>
var LoadManager = /** @class */ (function () {
    function LoadManager() {
        this.Listeners = [];
        this.PreUnLoadFuncs = [];
        this.AfterUnLoadFuncs = [];
        this._IsReady = false;
        this._IsLoaded = false;
    }
    LoadManager.Init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.addEventListener("load", function () { return console.info("window.onload"); });
                        return [4 /*yield*/, DOMEventsAsync(document)];
                    case 1:
                        timing = _a.sent();
                        return [4 /*yield*/, DoEvents()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, timing[0]];
                    case 3:
                        _a.sent();
                        LoadManager.DOMContentLoaded();
                        return [4 /*yield*/, timing[1]];
                    case 4:
                        _a.sent();
                        LoadManager.load();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoadManager.DOMContentLoaded = function () {
        var e_1, _a;
        try {
            for (var _b = __values(LoadManager.Items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!item.IsReady) {
                    item.Ready();
                    item._IsReady = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    LoadManager.load = function () {
        var e_2, _a;
        try {
            for (var _b = __values(LoadManager.Items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!item.IsLoaded) {
                    item.Load();
                    item._IsLoaded = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    LoadManager.RaiseUnLoad = function () {
        var e_3, _a;
        try {
            for (var _b = __values(LoadManager.Items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                item.UnLoadGlobal();
                item._IsLoaded = false;
                item._IsReady = false;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    LoadManager.RaiseReady = function () {
        { //ライブラリの再起動
            //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            Prism.highlightAll();
            //mermaid.init();
        }
        LoadManager.DOMContentLoaded();
    };
    LoadManager.RaiseLoad = function () {
        LoadManager.load();
    };
    LoadManager.prototype.UnLoadGlobal = function () {
        var e_4, _a;
        this.PreUnLoad();
        try {
            for (var _b = __values(this.Listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var l = _c.value;
                if (l[3])
                    l[3](l[0]);
                l[0].removeEventListener(l[1], l[2]);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this.AfterUnLoad();
        this.Listeners = [];
    };
    Object.defineProperty(LoadManager.prototype, "IsReady", {
        get: function () { return this._IsReady; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoadManager.prototype, "IsLoaded", {
        get: function () { return this._IsLoaded; },
        enumerable: false,
        configurable: true
    });
    LoadManager.prototype.addListener = function (target, type, listener, unload) {
        target.addEventListener(type, listener);
        this.Listeners.push([target, type, listener, unload]);
    };
    LoadManager.AddItem = function (item) {
        LoadManager.Items.push(item);
    };
    LoadManager.Items = [];
    return LoadManager;
}());
LoadManager.Init();
///<reference path="./main.ts"/>
LoadManager.AddItem(new /** @class */ (function (_super) {
    __extends(ImgClick, _super);
    function ImgClick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImgClick.prototype.Ready = function () {
        var article = document.getElementById("article");
        if (article === null)
            return;
        var chkbx = document.getElementById("img-checkbox");
        var overlaySpace = document.getElementById("img-overlay").lastChild;
        var dumy;
        var current;
        var open = function (img) {
            current = img;
            dumy = document.createElement("div");
            dumy.classList.add("dumy-img");
            img.parentNode.insertBefore(dumy, img);
            img.parentNode.removeChild(img);
            overlaySpace.appendChild(img);
            chkbx.checked = true;
        };
        var close = this.close = function () {
            if (!current)
                return;
            overlaySpace.removeChild(current);
            dumy.parentNode.insertBefore(current, dumy);
            dumy.parentNode.removeChild(dumy);
            current = null;
            dumy = null;
            chkbx.checked = false;
        };
        this.PreUnLoadFuncs.push(close);
        { //イベントリスナ
            this.addListener(chkbx, "change", function () {
                console.log("change=".concat(chkbx.checked));
                if (!chkbx.checked)
                    close();
            });
            this.addListener(overlaySpace, "click", function () {
                overlaySpace.classList.toggle("raw-size");
            });
            var imgs = article.querySelectorAll("img");
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                if (img.parentElement.tagName.toLowerCase() == "a")
                    continue;
                img.classList.add("clickable");
                this.addListener(img, "click", function (e) {
                    console.log("click=".concat(chkbx.checked));
                    if (chkbx.checked)
                        overlaySpace.classList.toggle("raw-size");
                    else
                        open(this);
                    //親のoverlaySpaceのイベントが発火するのを抑制
                    e.stopPropagation();
                }, function (i) { return i.classList.remove("clickable"); });
            }
        }
    };
    ImgClick.prototype.Load = function () {
    };
    ImgClick.prototype.PreUnLoad = function () {
        if (this.close)
            this.close();
    };
    ImgClick.prototype.AfterUnLoad = function () {
    };
    return ImgClick;
}(LoadManager))());
var AwaitUtil = /** @class */ (function () {
    function AwaitUtil() {
    }
    AwaitUtil.Immidiate = function () {
        return new Promise(function (res) { return setTimeout(res, 0); });
    };
    AwaitUtil.AnimationFrame = function () {
        return new Promise(function (res) { return requestAnimationFrame(function () { return res(); }); });
    };
    AwaitUtil.Timeout = function (mill) {
        return new Promise(function (res) { return setTimeout(res, mill); });
    };
    return AwaitUtil;
}());
var Awaiter = /** @class */ (function () {
    function Awaiter() {
        var _this = this;
        this.isDone = false;
        this.hasError = false;
        this.resolve = null;
        this.reject = null;
        this.task = new Promise(function (resolve, reject) {
            if (_this.isDone) {
                if (_this.hasError)
                    reject(_this.reason);
                else
                    resolve(_this.result);
            }
            else {
                _this.resolve = resolve;
                _this.reject = reject;
            }
        });
    }
    Awaiter.CreateCompleted = function (value) {
        var result = new Awaiter();
        result.SetResult(value);
        return result;
    };
    Awaiter.CreateFailed = function (error) {
        var result = new Awaiter();
        result.ThrowError(error);
        return result;
    };
    Awaiter.prototype.SetResult = function (value) {
        if (!this.isDone) {
            this.isDone = true;
            this.result = value;
            if (this.resolve)
                this.resolve(value);
        }
    };
    Awaiter.prototype.ThrowError = function (reason) {
        if (!this.isDone) {
            this.isDone = true;
            this.hasError = true;
            this.reason = reason;
            if (this.reject)
                this.reject(reason);
        }
    };
    return Awaiter;
}());
var AsyncXHR = /** @class */ (function () {
    function AsyncXHR() {
        this.sended = false;
        this._headersReceived = new Awaiter();
        this._loading = new Awaiter();
        this._done = new Awaiter();
        this._xhr = new XMLHttpRequest();
    }
    Object.defineProperty(AsyncXHR.prototype, "responseType", {
        set: function (value) {
            this._xhr.responseType = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AsyncXHR.prototype, "response", {
        get: function () {
            return this._xhr.response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AsyncXHR.prototype, "statusCode", {
        get: function () {
            return this._xhr.status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AsyncXHR.prototype, "statusText", {
        get: function () {
            return this._xhr.statusText;
        },
        enumerable: false,
        configurable: true
    });
    AsyncXHR.prototype.send = function (body) {
        if (this.sended)
            return;
        this.sended = true;
        this._xhr.addEventListener("readystatechange", this.ReadyStateChanged.bind(this));
        this._xhr.addEventListener("load", this.Load.bind(this));
        this._xhr.addEventListener("error", this.Error.bind(this));
        this._xhr.addEventListener("abort", this.Abort.bind(this));
        this._xhr.addEventListener("timeout", this.Timeout.bind(this));
        this._xhr.send(body);
    };
    AsyncXHR.prototype.open = function (method, url) {
        this._xhr.open(method, url, true);
    };
    AsyncXHR.prototype.abort = function () {
        this._xhr.abort();
    };
    AsyncXHR.prototype.ReadyStateChanged = function (ev) {
        switch (this._xhr.readyState) {
            case 2:
                this._headersReceived.SetResult(this._xhr.status);
                break;
            case 3:
                this._loading.SetResult(undefined);
                break;
            case 4:
                break;
            default:
        }
    };
    AsyncXHR.prototype.Load = function (ev) {
        this._done.SetResult(undefined);
    };
    AsyncXHR.prototype.Error = function (ev) {
        var msg = "リクエストエラー";
        this._headersReceived.ThrowError(msg);
        this._loading.ThrowError(msg);
        this._done.ThrowError(msg);
    };
    AsyncXHR.prototype.Abort = function (ev) {
        var msg = "キャンセルされました";
        this._headersReceived.ThrowError(msg);
        this._loading.ThrowError(msg);
        this._done.ThrowError(msg);
    };
    AsyncXHR.prototype.Timeout = function (ev) {
        var msg = "タイムアウト";
        this._headersReceived.ThrowError(msg);
        this._loading.ThrowError(msg);
        this._done.ThrowError(msg);
    };
    AsyncXHR.prototype.HeadersReceived = function () {
        return this._headersReceived.task;
    };
    AsyncXHR.prototype.Loading = function () {
        return this._loading.task;
    };
    AsyncXHR.prototype.Done = function () {
        return this._done.task;
    };
    return AsyncXHR;
}());
var TimeoutException = /** @class */ (function (_super) {
    __extends(TimeoutException, _super);
    function TimeoutException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeoutException;
}(Error));
var TaskTimeout = /** @class */ (function () {
    function TaskTimeout(task, ms) {
        var _this = this;
        this._done = false;
        this._targetTask = task;
        if (ms < 0) {
            this.task = this._targetTask;
        }
        else {
            this.task = new Promise(function (resolve, reject) {
                _this._resolve = resolve;
                _this._reject = reject;
            });
            task.then(function (value) {
                if (!_this._done) {
                    _this._done = true;
                    clearTimeout(_this._timeoutId);
                    _this._resolve(value);
                }
            }).catch(function (ex) {
                if (!_this._done) {
                    _this._done = true;
                    clearTimeout(_this._timeoutId);
                    _this._reject(ex);
                }
            });
            this._timeoutId = setTimeout(function () {
                if (!_this._done) {
                    _this._done = true;
                    _this._reject(new TimeoutException());
                }
            }, ms);
        }
    }
    return TaskTimeout;
}());
function SendAsync(req) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    req.onreadystatechange = function (e) {
                        switch (req.readyState) {
                            case 2: //ヘッダーのダウンロード完了
                                if (req.status < 200 || 300 <= req.status)
                                    reject(req.statusText);
                                break;
                            case 4: //中身のダウンロード完了
                                if (200 <= req.status && req.status < 300)
                                    resolve(true);
                                break;
                        }
                        if (req.readyState === 4 /*DONE*/) {
                        }
                    };
                    req.send();
                })];
        });
    });
}
function AttachCanceller(p) {
    var _this = this;
    var res = [undefined, undefined];
    res[1] = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var r, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res[0] = function () {
                        if (resolve) {
                            resolve([false, null]);
                            resolve = null;
                            reject = null;
                        }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, p];
                case 2:
                    r = _a.sent();
                    if (resolve) {
                        resolve([true, r]);
                        resolve = null;
                        reject = null;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_5 = _a.sent();
                    if (reject) {
                        reject(e_5);
                        resolve = null;
                        reject = null;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    return res;
}
function DOMEventsAsync(doc) {
    return [
        new Promise(function (resolve, reject) {
            if (doc.readyState === "interactive" ||
                doc.readyState === "complete") {
                resolve(null);
            }
            else {
                doc.addEventListener("DOMContentLoaded", function (e) {
                    resolve(e);
                });
            }
        }),
        new Promise(function (resolve, reject) {
            if (doc.readyState === "complete") {
                resolve(null);
            }
            else {
                window.addEventListener("load", function (e) {
                    resolve(e);
                });
            }
        })
    ];
}
function EventAsync(node, type) {
    console.info("".concat(node.nodeName, ":").concat(type, ":START"));
    return new Promise(function (resolve, reject) {
        var func = function (e) {
            resolve(e);
            node.removeEventListener(type, func);
            console.info("".concat(node.nodeName, ":").concat(type, ":DONE"));
        };
        addEventListener(type, func);
    });
}
function DoEvents() {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(true); }, 0);
    });
}
///<reference path="./main.ts"/>
///<reference path="./util.ts"/>
var MoveState;
(function (MoveState) {
    MoveState[MoveState["Cold"] = 0] = "Cold";
    MoveState[MoveState["Removed"] = 1] = "Removed";
    MoveState[MoveState["Replaced"] = 2] = "Replaced";
})(MoveState || (MoveState = {}));
if (history.pushState !== undefined && window.onpopstate !== undefined)
    LoadManager.AddItem(new /** @class */ (function (_super) {
        __extends(AnchorManager, _super);
        function AnchorManager() {
            var _this = _super.call(this) || this;
            _this.oldPathName = document.location.pathname;
            _this.moveState = MoveState.Cold;
            _this.canceller = null;
            _this.sharedAnchorElements = undefined;
            _this.temporaryAnchorElements = new Set();
            _this.stack = [];
            window.addEventListener("popstate", function (e) {
                _this.Move();
            });
            return _this;
        }
        AnchorManager.prototype.CancelTask = function () {
            console.debug("Canceled");
            var len = this.stack.length;
            for (var i = 0; i < len; i++) {
                var awaiter = this.stack.shift();
                awaiter.SetResult(this.stack.length == 0);
            }
        };
        AnchorManager.prototype.Move = function () {
            return __awaiter(this, void 0, void 0, function () {
                var old, url, awaiter, req, task, res, task, res, ex_1, task, res, task, res, ex_2, dom, task, res, replaceSuccess, items, task, res, i, item, imgs, j, img, task, res, ex_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            old = this.oldPathName;
                            url = document.location.pathname;
                            this.oldPathName = url;
                            if (url === old) {
                                //同一URLかハッシュのみが違う
                                return [2 /*return*/];
                            }
                            console.debug("Requested");
                            if (!(this.moveState !== MoveState.Cold)) return [3 /*break*/, 2];
                            console.debug("Cancel Requested");
                            awaiter = new Awaiter();
                            this.stack.push(awaiter);
                            this.canceller();
                            return [4 /*yield*/, awaiter.task];
                        case 1:
                            if (!(_a.sent()))
                                return [2 /*return*/];
                            _a.label = 2;
                        case 2:
                            console.debug("Started");
                            req = new AsyncXHR();
                            req.responseType = "document";
                            req.open("GET", url);
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 22, , 23]);
                            //XHRが終わるまでのブロック
                            req.send();
                            if (this.moveState != MoveState.Removed) {
                                LoadManager.RaiseUnLoad();
                                this.Remove();
                                this.loaderMessage.innerText = "";
                                this.loader.classList.add("progress-active");
                                console.debug("Removed");
                            }
                            else {
                                console.debug("Remove Skipped");
                            }
                            this.loader.classList.remove("reload-active");
                            this.loader.classList.remove("center-active");
                            this.loader.classList.remove("message-active");
                            this.moveState = MoveState.Removed;
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 7, , 8]);
                            task = AttachCanceller((new TaskTimeout(req.HeadersReceived(), 1500)).task);
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 5:
                            res = _a.sent();
                            if (!res[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            task = AttachCanceller((new TaskTimeout(req.Done(), 5000)).task);
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 6:
                            res = _a.sent();
                            if (!res[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            return [3 /*break*/, 8];
                        case 7:
                            ex_1 = _a.sent();
                            this.loader.classList.add("reload-active");
                            this.loader.classList.add("message-active");
                            if (ex_1 instanceof TimeoutException) {
                                this.loaderMessage.innerText = "読み込みに時間がかかっています";
                            }
                            else {
                                this.loaderMessage.innerText = ex_1;
                            }
                            return [3 /*break*/, 8];
                        case 8:
                            _a.trys.push([8, 12, , 13]);
                            task = AttachCanceller(req.HeadersReceived());
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 9:
                            res = _a.sent();
                            if (!res[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            console.debug("HeaderReceived");
                            return [4 /*yield*/, req.Done()];
                        case 10:
                            _a.sent();
                            console.debug("XHR Done");
                            task = AttachCanceller(req.Done());
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 11:
                            res = _a.sent();
                            if (!res[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            console.debug("Downloaded");
                            return [3 /*break*/, 13];
                        case 12:
                            ex_2 = _a.sent();
                            if (ex_2 instanceof TimeoutException) {
                                throw ["Timeout", "タイムアウトしました"];
                            }
                            else {
                                throw ["Error", ex_2];
                            }
                            return [3 /*break*/, 13];
                        case 13:
                            dom = req.response;
                            task = AttachCanceller(DOMEventsAsync(dom)[0]);
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 14:
                            res = _a.sent();
                            if (!res[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            replaceSuccess = this.Replace(dom);
                            if (!replaceSuccess) {
                                if (200 <= req.statusCode && req.statusCode < 300) {
                                    throw ["Error", "コンテンツが不正でした"];
                                }
                                else {
                                    console.debug("HeaderError");
                                    throw ["Error", req.statusText];
                                }
                            }
                            items = this.Insert(dom);
                            LoadManager.RaiseReady();
                            //this.loader.classList.remove("progress-active");
                            //this.loader.classList.remove("reload-active");
                            //this.loader.classList.remove("message-active");
                            this.moveState = MoveState.Replaced;
                            console.debug("Replaced");
                            task = AttachCanceller(DoEvents());
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 15:
                            res = _a.sent();
                            if (!res[0]) {
                                //キャンセルされた
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            console.debug("Loading");
                            i = 0;
                            _a.label = 16;
                        case 16:
                            if (!(i < items.length)) return [3 /*break*/, 21];
                            item = items[i];
                            imgs = item.getElementsByTagName("img");
                            j = 0;
                            _a.label = 17;
                        case 17:
                            if (!(j < length)) return [3 /*break*/, 20];
                            img = imgs[j];
                            if (!!img.complete) return [3 /*break*/, 19];
                            task = AttachCanceller(EventAsync(img, "load"));
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 18:
                            res = _a.sent();
                            if (!res[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            _a.label = 19;
                        case 19:
                            j++;
                            return [3 /*break*/, 17];
                        case 20:
                            i++;
                            return [3 /*break*/, 16];
                        case 21:
                            LoadManager.RaiseLoad();
                            this.moveState = MoveState.Cold;
                            this.canceller = null;
                            console.debug("Loaded");
                            return [3 /*break*/, 23];
                        case 22:
                            ex_3 = _a.sent();
                            this.moveState = MoveState.Cold;
                            this.canceller = null;
                            if (Array.isArray(ex_3)) {
                                this.centerInfo.innerText = ex_3[0];
                                this.loaderMessage.innerText = ex_3[1];
                            }
                            else {
                                this.centerInfo.innerText = "ERROR";
                                this.centerInfo.innerText = ex_3;
                            }
                            this.loader.classList.remove("progress-active");
                            this.loader.classList.add("center-active");
                            this.loader.classList.add("message-active");
                            this.loader.classList.add("reload-active");
                            console.error(ex_3);
                            return [3 /*break*/, 23];
                        case 23: return [2 /*return*/];
                    }
                });
            });
        };
        AnchorManager.prototype.Remove = function () {
            var e_6, _a;
            var starts = document.querySelectorAll("meta[data-start]");
            try {
                for (var starts_1 = __values(starts), starts_1_1 = starts_1.next(); !starts_1_1.done; starts_1_1 = starts_1.next()) {
                    var startElement = starts_1_1.value;
                    var pairMeta = startElement.getAttribute("data-start");
                    var current = startElement.nextSibling;
                    while (!(current instanceof Element) || current.getAttribute("data-end") !== pairMeta) {
                        var next = current.nextSibling;
                        current.remove();
                        current = next;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (starts_1_1 && !starts_1_1.done && (_a = starts_1.return)) _a.call(starts_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        };
        AnchorManager.prototype.Replace = function (current) {
            var e_7, _a, e_8, _b, e_9, _c;
            var oldReps = document.querySelectorAll("[data-replace]");
            var newReps = current.querySelectorAll("[data-replace]");
            var oldRepMap = new Map();
            var newRepMap = new Map();
            try {
                for (var oldReps_1 = __values(oldReps), oldReps_1_1 = oldReps_1.next(); !oldReps_1_1.done; oldReps_1_1 = oldReps_1.next()) {
                    var oldElem = oldReps_1_1.value;
                    var oldAttr = oldElem.getAttribute("data-replace");
                    var current_1 = oldRepMap.get(oldAttr);
                    if (current_1 === undefined) {
                        oldRepMap.set(oldAttr, oldElem);
                    }
                    else {
                        console.error("Multiple data-ajax");
                        return false;
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (oldReps_1_1 && !oldReps_1_1.done && (_a = oldReps_1.return)) _a.call(oldReps_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            try {
                for (var newReps_1 = __values(newReps), newReps_1_1 = newReps_1.next(); !newReps_1_1.done; newReps_1_1 = newReps_1.next()) {
                    var newElem = newReps_1_1.value;
                    var newAttr = newElem.getAttribute("data-replace");
                    var current_2 = newRepMap.get(newAttr);
                    if (current_2 === undefined) {
                        newRepMap.set(newAttr, newElem);
                    }
                    else {
                        console.error("Multiple data-ajax");
                        return false;
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (newReps_1_1 && !newReps_1_1.done && (_b = newReps_1.return)) _b.call(newReps_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
            try {
                for (var oldRepMap_1 = __values(oldRepMap), oldRepMap_1_1 = oldRepMap_1.next(); !oldRepMap_1_1.done; oldRepMap_1_1 = oldRepMap_1.next()) {
                    var _d = __read(oldRepMap_1_1.value, 2), attrAJax = _d[0], oldElem = _d[1];
                    var newElem = newRepMap.get(attrAJax);
                    if (newElem === undefined) {
                        console.error("data-ajax Only Old Element");
                        return false;
                    }
                    else {
                        var attr = attrAJax.split("-")[1];
                        if (attr === "innerHTML") {
                            oldElem.innerHTML = newElem.innerHTML;
                        }
                        else {
                            var newValue = newElem.getAttribute(attr);
                            if (newValue === null)
                                newValue = "";
                            oldElem.setAttribute(attr, newValue);
                        }
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (oldRepMap_1_1 && !oldRepMap_1_1.done && (_c = oldRepMap_1.return)) _c.call(oldRepMap_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
            return true;
        };
        AnchorManager.prototype.Insert = function (currentD) {
            var items = [];
            var oldStarts = document.querySelectorAll("meta[data-start]");
            var nowStarts = currentD.querySelectorAll("meta[data-start]");
            //TODO:置換が複数あった場合の対応
            for (var i = 0; i < oldStarts.length; i++) {
                var oldStart = oldStarts[i];
                var oldEnd = oldStart.nextElementSibling;
                for (var j = 0; j < nowStarts.length; j++) {
                    var nowStart = nowStarts[j];
                    var dAjax = oldStart.getAttribute("data-start");
                    if (dAjax ===
                        nowStart.getAttribute("data-start")) {
                        var current = nowStart.nextSibling;
                        while (current !== null) {
                            if (current instanceof HTMLElement) {
                                var elm = current;
                                if (elm.matches("meta[data-end]"))
                                    break;
                                items.push(current);
                            }
                            var next = current.nextSibling;
                            current.parentElement.removeChild(current);
                            oldEnd.parentElement.insertBefore(current, oldEnd);
                            current = next;
                        }
                        break;
                    }
                }
            }
            return items;
        };
        AnchorManager.prototype.anchorClick = function (a, e) {
            history.pushState({}, "", a.href);
            this.Move();
            e.preventDefault();
        };
        AnchorManager.prototype.Ready = function () {
            var e_10, _a, e_11, _b, e_12, _c;
            var A_QUERY = "a[href^='/']";
            this.progress = document.querySelector("#loader>.progress-ring");
            this.loader = document.getElementById("loader");
            this.centerInfo = document.getElementById("center-info");
            this.loaderInfo = document.getElementById("loader-info");
            this.loaderMessage = document.getElementById("loader-message");
            //該当ページのみに存在するAエレメント
            var tempAs = new Set();
            var starts = document.querySelectorAll("meta[data-start]");
            try {
                for (var starts_2 = __values(starts), starts_2_1 = starts_2.next(); !starts_2_1.done; starts_2_1 = starts_2.next()) {
                    var startElement = starts_2_1.value;
                    var pairMeta = startElement.getAttribute("data-start");
                    var currentElement = startElement.nextElementSibling;
                    while (currentElement.getAttribute("data-end") != pairMeta) {
                        var childAs = currentElement.querySelectorAll(A_QUERY);
                        try {
                            for (var _d = (e_11 = void 0, __values(childAs)), _e = _d.next(); !_e.done; _e = _d.next()) {
                                var childA = _e.value;
                                //一時的なイベントリスナとして追加する
                                this.addListener(childA, "click", this.anchorClick.bind(this, childA));
                                tempAs.add(childA);
                            }
                        }
                        catch (e_11_1) { e_11 = { error: e_11_1 }; }
                        finally {
                            try {
                                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                            }
                            finally { if (e_11) throw e_11.error; }
                        }
                        currentElement = currentElement.nextElementSibling;
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (starts_2_1 && !starts_2_1.done && (_a = starts_2.return)) _a.call(starts_2);
                }
                finally { if (e_10) throw e_10.error; }
            }
            if (this.sharedAnchorElements === undefined) {
                //初回の連携の場合
                var sharedAs = new Set();
                var allAs = document.querySelectorAll(A_QUERY);
                try {
                    for (var _f = __values(allAs), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var anchor = _g.value;
                        if (!tempAs.has(anchor)) {
                            //恒久的なイベントリスナとして追加する
                            anchor.addEventListener("click", this.anchorClick.bind(this, anchor));
                            sharedAs.add(anchor);
                        }
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                this.sharedAnchorElements = sharedAs;
            }
            this.temporaryAnchorElements = tempAs;
            //}
            //let allAs = new Set<HTMLAnchorElement>(document.querySelectorAll(A_QUERY));
            //let sharedAs = new Set<HTMLAnchorElement>();
            //if (this.sharedAnchorElements === undefined) {
            //    for (var i = 0; i < starts.length; i++) {
            //        var start = starts[i];
            //        var current: Node = start.nextSibling;
            //        while (current !== null) {
            //            if (current instanceof HTMLElement) {
            //                var elm = current as HTMLElement;
            //                if (elm.matches("meta[data-ajax^='end'"))
            //                    break;
            //            }
            //            var next = current.nextSibling;
            //            current.parentElement.removeChild(current);
            //            current = next;
            //        }
            //    }
            //}
            //let oldAs = this.anchorElements;
            //let newAs = new Set<HTMLAnchorElement>(document.querySelectorAll("a[href^='/']"));
            //let addedAs = [...newAs].filter(a => !oldAs.has(a));
            //for (let elm of addedAs) {
            //    let a = elm as HTMLAnchorElement;
            //    //TODO:イベントリスナの最適化
            //    this.addListener(a, "click", this.anchorClick.bind(this, a));
            //}
            //this.anchorElements = newAs;
            //    NodeList
            //    for (var i = 0; i < as.length; i++) {
            //        var a = as[i] as HTMLAnchorElement;
            //        this.addListener(a, "click", this.anchorClick.bind(this, a));
            //    }
        };
        AnchorManager.prototype.Load = function () {
        };
        AnchorManager.prototype.PreUnLoad = function () {
            var checkbox = document.getElementById("menu-checkbox");
            if (checkbox.checked)
                checkbox.checked = false;
        };
        AnchorManager.prototype.AfterUnLoad = function () {
        };
        return AnchorManager;
    }(LoadManager))());
///<reference path="./main.ts"/>
LoadManager.AddItem(new /** @class */ (function (_super) {
    __extends(TocManager, _super);
    function TocManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TocManager.prototype.Ready = function () {
        var toc = document.getElementById("toc");
        if (toc != null) {
            var wrapper = toc.parentElement;
            var main = document.getElementById("main") || document;
            var currentId = null;
            var margin_1 = 8;
            var update = function () {
                if (window.getComputedStyle(toc).position === "sticky") {
                    { //目次の高さ調整
                        //画面内の絶対座標
                        var wPos = wrapper.getBoundingClientRect();
                        //親のTopと最小のMargin
                        //画面内に親の上端が存在すると使われる場合がある
                        var top = Math.max(wPos.top, margin_1);
                        var bottom = Math.min(wPos.bottom, window.innerHeight - margin_1);
                        toc.style.maxHeight = (bottom - top) + "px";
                    }
                    { //現在読んでいる内容
                        var last = null;
                        var hs = main.querySelectorAll("h1,h2,h3,h4,h5,h6");
                        if (hs.length)
                            last = hs[0];
                        for (var i = 1; i < hs.length; i++) {
                            var h = hs[i];
                            if (h.getBoundingClientRect().top <= margin_1) {
                                last = h;
                            }
                            else {
                                break;
                            }
                        }
                        if (last !== null && last.id) {
                            if (currentId !== last.id) {
                                if (currentId !== null)
                                    toc.querySelector("a.current").classList.remove("current");
                                currentId = last.id;
                                var target = toc.querySelector("a[href=\"#".concat(encodeURI(last.id), "\"]"));
                                if (target) {
                                    target.classList.add("current");
                                }
                            }
                        }
                        else {
                            if (currentId !== null)
                                toc.querySelector("a.current").classList.remove("current");
                            currentId = null;
                        }
                        if (currentId !== null) {
                            var target = toc.querySelector("a[href=\"#".concat(encodeURI(last.id), "\"]"));
                            if (target) {
                                var pos = target.offsetTop + target.scrollTop + target.clientHeight / 2;
                                toc.scrollTop = pos - toc.clientHeight / 2;
                            }
                        }
                    }
                }
                else {
                    toc.style.maxHeight = null;
                    if (currentId !== null) {
                        currentId = null;
                        toc.querySelector("a.current").classList.remove("current");
                    }
                }
            };
            this.addListener(window, "resize", update);
            this.addListener(window, "scroll", update);
            update();
        }
    };
    TocManager.prototype.Load = function () {
    };
    TocManager.prototype.PreUnLoad = function () {
    };
    TocManager.prototype.AfterUnLoad = function () {
    };
    return TocManager;
}(LoadManager))());
//# sourceMappingURL=main.js.map