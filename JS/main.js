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
        while (_) try {
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
        for (var _i = 0, _a = LoadManager.Items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (!item.IsReady) {
                item.Ready();
                item._IsReady = true;
            }
        }
    };
    LoadManager.load = function () {
        for (var _i = 0, _a = LoadManager.Items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (!item.IsLoaded) {
                item.Load();
                item._IsLoaded = true;
            }
        }
    };
    LoadManager.RaiseUnLoad = function () {
        for (var _i = 0, _a = LoadManager.Items; _i < _a.length; _i++) {
            var item = _a[_i];
            item.UnLoadGlobal();
            item._IsLoaded = false;
            item._IsReady = false;
        }
    };
    LoadManager.RaiseReady = function () {
        { //ライブラリの再起動
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            Prism.highlightAll();
            mermaid.init();
        }
        LoadManager.DOMContentLoaded();
    };
    LoadManager.RaiseLoad = function () {
        LoadManager.load();
    };
    LoadManager.prototype.UnLoadGlobal = function () {
        this.PreUnLoad();
        for (var _i = 0, _a = this.Listeners; _i < _a.length; _i++) {
            var l = _a[_i];
            if (l[3])
                l[3](l[0]);
            l[0].removeEventListener(l[1], l[2]);
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
                console.log("change=" + chkbx.checked);
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
                    console.log("click=" + chkbx.checked);
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
function SendAsync(req) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    req.onreadystatechange = function (e) {
                        if (req.readyState === 4 /*DONE*/) {
                            if (200 <= req.status && req.status < 300)
                                resolve(true);
                            else
                                reject(req.statusText);
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
        var r, e_1;
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
                    e_1 = _a.sent();
                    if (reject) {
                        reject(e_1);
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
    console.info(node.nodeName + ":" + type + ":START");
    return new Promise(function (resolve, reject) {
        var func = function (e) {
            resolve(e);
            node.removeEventListener(type, func);
            console.info(node.nodeName + ":" + type + ":DONE");
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
                var old, url, awaiter, req, task, res, dom, task, res_1, items, task, res_2, i, item, imgs, j, img, task, res_3, ex_1;
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
                            if (!(this.moveState != MoveState.Cold)) return [3 /*break*/, 2];
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
                            req = new XMLHttpRequest();
                            req.onabort = function () { return console.info("Cancelled XHR"); };
                            req.responseType = "document";
                            req.open("GET", url, true);
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 13, , 14]);
                            task = AttachCanceller(SendAsync(req));
                            this.canceller = task[0];
                            if (this.moveState != MoveState.Removed) {
                                LoadManager.RaiseUnLoad();
                                this.Remove();
                                this.progress.classList.add("active");
                                console.debug("Removed");
                            }
                            else {
                                console.debug("Remove Skipped");
                            }
                            this.moveState = MoveState.Removed;
                            return [4 /*yield*/, task[1]];
                        case 4:
                            res = _a.sent();
                            if (!res[0]) {
                                this.CancelTask();
                                console.info("Cancel XHR");
                                req.abort();
                                return [2 /*return*/];
                            }
                            console.debug("Downloaded");
                            dom = req.response;
                            task = AttachCanceller(DOMEventsAsync(dom)[0]);
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 5:
                            res_1 = _a.sent();
                            if (!res_1[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            //挿入されたノードが描画されるまでのブロック
                            this.Replace(dom);
                            items = this.Insert(dom);
                            LoadManager.RaiseReady();
                            this.progress.classList.remove("active");
                            this.moveState = MoveState.Replaced;
                            console.debug("Replaced");
                            task = AttachCanceller(DoEvents());
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 6:
                            res_2 = _a.sent();
                            if (!res_2[0]) {
                                //キャンセルされた
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            console.debug("Loading");
                            i = 0;
                            _a.label = 7;
                        case 7:
                            if (!(i < items.length)) return [3 /*break*/, 12];
                            item = items[i];
                            imgs = item.getElementsByTagName("img");
                            j = 0;
                            _a.label = 8;
                        case 8:
                            if (!(j < length)) return [3 /*break*/, 11];
                            img = imgs[j];
                            if (!!img.complete) return [3 /*break*/, 10];
                            task = AttachCanceller(EventAsync(img, "load"));
                            this.canceller = task[0];
                            return [4 /*yield*/, task[1]];
                        case 9:
                            res_3 = _a.sent();
                            if (!res_3[0]) {
                                this.CancelTask();
                                return [2 /*return*/];
                            }
                            _a.label = 10;
                        case 10:
                            j++;
                            return [3 /*break*/, 8];
                        case 11:
                            i++;
                            return [3 /*break*/, 7];
                        case 12:
                            LoadManager.RaiseLoad();
                            this.moveState = MoveState.Cold;
                            this.canceller = null;
                            console.debug("Loaded");
                            return [3 /*break*/, 14];
                        case 13:
                            ex_1 = _a.sent();
                            console.error(ex_1);
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        AnchorManager.prototype.Remove = function () {
            var starts = document.querySelectorAll("meta[data-ajax^='start-']");
            for (var i = 0; i < starts.length; i++) {
                var start = starts[i];
                var current = start.nextSibling;
                while (current !== null) {
                    if (current instanceof HTMLElement) {
                        var elm = current;
                        if (elm.matches("meta[data-ajax^='end'"))
                            break;
                    }
                    var next = current.nextSibling;
                    current.parentElement.removeChild(current);
                    current = next;
                }
            }
        };
        AnchorManager.prototype.Replace = function (current) {
            var oldReps = document.querySelectorAll("[data-ajax^='replace-']");
            var nowReps = current.querySelectorAll("[data-ajax^='replace-']");
            for (var i = 0; i < oldReps.length; i++) {
                for (var j = 0; j < nowReps.length; j++) {
                    var dAjax = oldReps[i].getAttribute("data-ajax");
                    if (dAjax ===
                        nowReps[j].getAttribute("data-ajax")) {
                        var attr = dAjax.split("-")[2];
                        oldReps[i].setAttribute(attr, nowReps[j].getAttribute(attr));
                        break;
                    }
                }
            }
        };
        AnchorManager.prototype.Insert = function (currentD) {
            var items = [];
            var oldStarts = document.querySelectorAll("meta[data-ajax^='start-']");
            var nowStarts = currentD.querySelectorAll("meta[data-ajax^='start-']");
            for (var i = 0; i < oldStarts.length; i++) {
                var oldStart = oldStarts[i];
                var oldEnd = oldStart.nextElementSibling;
                for (var j = 0; j < nowStarts.length; j++) {
                    var nowStart = nowStarts[j];
                    var dAjax = oldStart.getAttribute("data-ajax");
                    if (dAjax ===
                        nowStart.getAttribute("data-ajax")) {
                        var current = nowStart.nextSibling;
                        while (current !== null) {
                            if (current instanceof HTMLElement) {
                                var elm = current;
                                if (elm.matches("meta[data-ajax^='end'"))
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
        AnchorManager.prototype.Ready = function () {
            var that = this;
            this.progress = document.querySelector("#loader>.progress-ring");
            var as = document.querySelectorAll("a[href^='/']");
            for (var i = 0; i < as.length; i++) {
                var a = as[i];
                this.addListener(a, "click", function (e) {
                    history.pushState({}, "", this.href);
                    that.Move();
                    e.preventDefault();
                });
            }
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
                                var target = toc.querySelector("a[href=\"#" + encodeURI(last.id) + "\"]");
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
                            var target = toc.querySelector("a[href=\"#" + encodeURI(last.id) + "\"]");
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
