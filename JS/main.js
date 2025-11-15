///<reference path="./Variable.d.ts"/>
function OnReloadClick() {
    location.reload();
}
///<reference path="./Variable.d.ts"/>
class LoadManager {
    constructor() {
        this.Listeners = [];
        this.PreUnLoadFuncs = [];
        this.AfterUnLoadFuncs = [];
        this._IsReady = false;
        this._IsLoaded = false;
    }
    static async Init() {
        window.addEventListener("load", () => console.info("window.onload"));
        var timing = await DOMEventsAsync(document);
        await DoEvents();
        await timing[0];
        LoadManager.DOMContentLoaded();
        await timing[1];
        LoadManager.load();
    }
    static DOMContentLoaded() {
        for (var item of LoadManager.Items) {
            if (!item.IsReady) {
                item.Ready();
                item._IsReady = true;
            }
        }
    }
    static load() {
        for (var item of LoadManager.Items) {
            if (!item.IsLoaded) {
                item.Load();
                item._IsLoaded = true;
            }
        }
    }
    static RaiseUnLoad() {
        for (var item of LoadManager.Items) {
            item.UnLoadGlobal();
            item._IsLoaded = false;
            item._IsReady = false;
        }
    }
    static RaiseReady() {
        { //ライブラリの再起動
            //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            Prism.highlightAll();
            //mermaid.init();
        }
        LoadManager.DOMContentLoaded();
    }
    static RaiseLoad() {
        LoadManager.load();
    }
    UnLoadGlobal() {
        this.PreUnLoad();
        for (var l of this.Listeners) {
            if (l[3])
                l[3](l[0]);
            l[0].removeEventListener(l[1], l[2]);
        }
        this.AfterUnLoad();
        this.Listeners = [];
    }
    get IsReady() { return this._IsReady; }
    get IsLoaded() { return this._IsLoaded; }
    addListener(target, type, listener, unload) {
        target.addEventListener(type, listener);
        this.Listeners.push([target, type, listener, unload]);
    }
    static AddItem(item) {
        LoadManager.Items.push(item);
    }
}
LoadManager.Items = [];
LoadManager.Init();
///<reference path="./main.ts"/>
LoadManager.AddItem(new class ImgClick extends LoadManager {
    Ready() {
        var article = document.getElementById("article");
        if (article === null)
            return;
        var chkbx = document.getElementById("img-checkbox");
        var overlaySpace = document.getElementById("img-overlay").lastChild;
        var dumy;
        var current;
        var open = (img) => {
            current = img;
            dumy = document.createElement("div");
            dumy.classList.add("dumy-img");
            img.parentNode.insertBefore(dumy, img);
            img.parentNode.removeChild(img);
            overlaySpace.appendChild(img);
            chkbx.checked = true;
        };
        var close = this.close = () => {
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
            this.addListener(chkbx, "change", () => {
                console.log(`change=${chkbx.checked}`);
                if (!chkbx.checked)
                    close();
            });
            this.addListener(overlaySpace, "click", () => {
                overlaySpace.classList.toggle("raw-size");
            });
            var imgs = article.querySelectorAll("img");
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                if (img.parentElement.tagName.toLowerCase() == "a")
                    continue;
                img.classList.add("clickable");
                this.addListener(img, "click", function (e) {
                    console.log(`click=${chkbx.checked}`);
                    if (chkbx.checked)
                        overlaySpace.classList.toggle("raw-size");
                    else
                        open(this);
                    //親のoverlaySpaceのイベントが発火するのを抑制
                    e.stopPropagation();
                }, (i) => i.classList.remove("clickable"));
            }
        }
    }
    Load() {
    }
    PreUnLoad() {
        if (this.close)
            this.close();
    }
    AfterUnLoad() {
    }
}());
class AwaitUtil {
    static Immidiate() {
        return new Promise(res => setTimeout(res, 0));
    }
    static AnimationFrame() {
        return new Promise(res => requestAnimationFrame(() => res()));
    }
    static Timeout(mill) {
        return new Promise(res => setTimeout(res, mill));
    }
}
class Awaiter {
    static CreateCompleted(value) {
        let result = new Awaiter();
        result.SetResult(value);
        return result;
    }
    static CreateFailed(error) {
        let result = new Awaiter();
        result.ThrowError(error);
        return result;
    }
    constructor() {
        this.isDone = false;
        this.hasError = false;
        this.resolve = null;
        this.reject = null;
        this.task = new Promise((resolve, reject) => {
            if (this.isDone) {
                if (this.hasError)
                    reject(this.reason);
                else
                    resolve(this.result);
            }
            else {
                this.resolve = resolve;
                this.reject = reject;
            }
        });
    }
    SetResult(value) {
        if (!this.isDone) {
            this.isDone = true;
            this.result = value;
            if (this.resolve)
                this.resolve(value);
        }
    }
    ThrowError(reason) {
        if (!this.isDone) {
            this.isDone = true;
            this.hasError = true;
            this.reason = reason;
            if (this.reject)
                this.reject(reason);
        }
    }
}
class AsyncXHR {
    constructor() {
        this.sended = false;
        this._headersReceived = new Awaiter();
        this._loading = new Awaiter();
        this._done = new Awaiter();
        this._xhr = new XMLHttpRequest();
    }
    set responseType(value) {
        this._xhr.responseType = value;
    }
    get response() {
        return this._xhr.response;
    }
    get statusCode() {
        return this._xhr.status;
    }
    get statusText() {
        return this._xhr.statusText;
    }
    send(body) {
        if (this.sended)
            return;
        this.sended = true;
        this._xhr.addEventListener("readystatechange", this.ReadyStateChanged.bind(this));
        this._xhr.addEventListener("load", this.Load.bind(this));
        this._xhr.addEventListener("error", this.Error.bind(this));
        this._xhr.addEventListener("abort", this.Abort.bind(this));
        this._xhr.addEventListener("timeout", this.Timeout.bind(this));
        this._xhr.send(body);
    }
    open(method, url) {
        this._xhr.open(method, url, true);
    }
    abort() {
        this._xhr.abort();
    }
    ReadyStateChanged(ev) {
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
    }
    Load(ev) {
        this._done.SetResult(undefined);
    }
    Error(ev) {
        let msg = "リクエストエラー";
        this._headersReceived.ThrowError(msg);
        this._loading.ThrowError(msg);
        this._done.ThrowError(msg);
    }
    Abort(ev) {
        let msg = "キャンセルされました";
        this._headersReceived.ThrowError(msg);
        this._loading.ThrowError(msg);
        this._done.ThrowError(msg);
    }
    Timeout(ev) {
        let msg = "タイムアウト";
        this._headersReceived.ThrowError(msg);
        this._loading.ThrowError(msg);
        this._done.ThrowError(msg);
    }
    HeadersReceived() {
        return this._headersReceived.task;
    }
    Loading() {
        return this._loading.task;
    }
    Done() {
        return this._done.task;
    }
}
class TimeoutException extends Error {
}
class TaskTimeout {
    constructor(task, ms) {
        this._done = false;
        this._targetTask = task;
        if (ms < 0) {
            this.task = this._targetTask;
        }
        else {
            this.task = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });
            task.then((value) => {
                if (!this._done) {
                    this._done = true;
                    clearTimeout(this._timeoutId);
                    this._resolve(value);
                }
            }).catch((ex) => {
                if (!this._done) {
                    this._done = true;
                    clearTimeout(this._timeoutId);
                    this._reject(ex);
                }
            });
            this._timeoutId = setTimeout(() => {
                if (!this._done) {
                    this._done = true;
                    this._reject(new TimeoutException());
                }
            }, ms);
        }
    }
}
async function SendAsync(req) {
    return new Promise((resolve, reject) => {
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
    });
}
function AttachCanceller(p) {
    var res = [undefined, undefined];
    res[1] = new Promise(async (resolve, reject) => {
        res[0] = () => {
            if (resolve) {
                resolve([false, null]);
                resolve = null;
                reject = null;
            }
        };
        try {
            var r = await p;
            if (resolve) {
                resolve([true, r]);
                resolve = null;
                reject = null;
            }
        }
        catch (e) {
            if (reject) {
                reject(e);
                resolve = null;
                reject = null;
            }
        }
    });
    return res;
}
function DOMEventsAsync(doc) {
    return [
        new Promise((resolve, reject) => {
            if (doc.readyState === "interactive" ||
                doc.readyState === "complete") {
                resolve(null);
            }
            else {
                doc.addEventListener("DOMContentLoaded", (e) => {
                    resolve(e);
                });
            }
        }),
        new Promise((resolve, reject) => {
            if (doc.readyState === "complete") {
                resolve(null);
            }
            else {
                window.addEventListener("load", (e) => {
                    resolve(e);
                });
            }
        })
    ];
}
function EventAsync(node, type) {
    console.info(`${node.nodeName}:${type}:START`);
    return new Promise((resolve, reject) => {
        var func = (e) => {
            resolve(e);
            node.removeEventListener(type, func);
            console.info(`${node.nodeName}:${type}:DONE`);
        };
        addEventListener(type, func);
    });
}
function DoEvents() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 0);
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
    LoadManager.AddItem(new class AnchorManager extends LoadManager {
        constructor() {
            super();
            this.oldPathName = document.location.pathname;
            this.moveState = MoveState.Cold;
            this.canceller = null;
            this.sharedAnchorElements = undefined;
            this.temporaryAnchorElements = new Set();
            this.stack = [];
            window.addEventListener("popstate", (e) => {
                this.Move();
            });
        }
        CancelTask() {
            console.debug("Canceled");
            var len = this.stack.length;
            for (var i = 0; i < len; i++) {
                var awaiter = this.stack.shift();
                awaiter.SetResult(this.stack.length == 0);
            }
        }
        async Move() {
            var old = this.oldPathName;
            var url = document.location.pathname;
            this.oldPathName = url;
            if (url === old) {
                //同一URLかハッシュのみが違う
                return;
            }
            console.debug("Requested");
            if (this.moveState !== MoveState.Cold) {
                console.debug("Cancel Requested");
                var awaiter = new Awaiter();
                this.stack.push(awaiter);
                this.canceller();
                if (!await awaiter.task)
                    return;
            }
            console.debug("Started");
            var req = new AsyncXHR();
            req.responseType = "document";
            req.open("GET", url);
            try {
                {
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
                    try {
                        {
                            let task = AttachCanceller((new TaskTimeout(req.HeadersReceived(), 1500)).task);
                            this.canceller = task[0];
                            let res = await task[1];
                            if (!res[0]) {
                                this.CancelTask();
                                return;
                            }
                        }
                        {
                            let task = AttachCanceller((new TaskTimeout(req.Done(), 5000)).task);
                            this.canceller = task[0];
                            let res = await task[1];
                            if (!res[0]) {
                                this.CancelTask();
                                return;
                            }
                        }
                    }
                    catch (ex) {
                        this.loader.classList.add("reload-active");
                        this.loader.classList.add("message-active");
                        if (ex instanceof TimeoutException) {
                            this.loaderMessage.innerText = "読み込みに時間がかかっています";
                        }
                        else {
                            this.loaderMessage.innerText = ex;
                        }
                    }
                    try {
                        {
                            let task = AttachCanceller(req.HeadersReceived());
                            this.canceller = task[0];
                            let res = await task[1];
                            if (!res[0]) {
                                this.CancelTask();
                                return;
                            }
                            console.debug("HeaderReceived");
                            await req.Done();
                            console.debug("XHR Done");
                        }
                        {
                            let task = AttachCanceller(req.Done());
                            this.canceller = task[0];
                            let res = await task[1];
                            if (!res[0]) {
                                this.CancelTask();
                                return;
                            }
                            console.debug("Downloaded");
                        }
                    }
                    catch (ex) {
                        if (ex instanceof TimeoutException) {
                            throw ["Timeout", "タイムアウトしました"];
                        }
                        else {
                            throw ["Error", ex];
                        }
                    }
                }
                var dom = req.response;
                {
                    //DOMの構築が終わるまでのブロック
                    let task = AttachCanceller(DOMEventsAsync(dom)[0]);
                    this.canceller = task[0];
                    let res = await task[1];
                    if (!res[0]) {
                        this.CancelTask();
                        return;
                    }
                }
                {
                    //挿入されたノードが描画されるまでのブロック
                    //置換が正しく完了すればプログレスリングなどは更新される
                    let replaceSuccess = this.Replace(dom);
                    if (!replaceSuccess) {
                        if (200 <= req.statusCode && req.statusCode < 300) {
                            throw ["Error", "コンテンツが不正でした"];
                        }
                        else {
                            console.debug("HeaderError");
                            throw ["Error", req.statusText];
                        }
                    }
                    var items = this.Insert(dom);
                    LoadManager.RaiseReady();
                    this.moveState = MoveState.Replaced;
                    console.debug("Replaced");
                    let task = AttachCanceller(DoEvents());
                    this.canceller = task[0];
                    let res = await task[1];
                    if (!res[0]) {
                        //キャンセルされた
                        this.CancelTask();
                        return;
                    }
                }
                console.debug("Loading");
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var imgs = item.getElementsByTagName("img");
                    for (var j = 0; j < length; j++) {
                        var img = imgs[j];
                        if (!img.complete) {
                            let task = AttachCanceller(EventAsync(img, "load"));
                            this.canceller = task[0];
                            let res = await task[1];
                            if (!res[0]) {
                                this.CancelTask();
                                return;
                            }
                        }
                    }
                }
                LoadManager.RaiseLoad();
                this.moveState = MoveState.Cold;
                this.canceller = null;
                console.debug("Loaded");
            }
            catch (ex) {
                this.moveState = MoveState.Cold;
                this.canceller = null;
                if (Array.isArray(ex)) {
                    this.centerInfo.innerText = ex[0];
                    this.loaderMessage.innerText = ex[1];
                }
                else {
                    this.centerInfo.innerText = "ERROR";
                    this.centerInfo.innerText = ex;
                }
                this.loader.classList.remove("progress-active");
                this.loader.classList.add("center-active");
                this.loader.classList.add("message-active");
                this.loader.classList.add("reload-active");
                console.error(ex);
            }
        }
        Remove() {
            var starts = document.querySelectorAll("meta[data-start]");
            for (let startElement of starts) {
                let pairMeta = startElement.getAttribute("data-start");
                let current = startElement.nextSibling;
                while (!(current instanceof Element) || current.getAttribute("data-end") !== pairMeta) {
                    let next = current.nextSibling;
                    current.remove();
                    current = next;
                }
            }
        }
        Replace(current) {
            var oldReps = document.querySelectorAll("[data-replace]");
            var newReps = current.querySelectorAll("[data-replace]");
            var oldRepMap = new Map();
            var newRepMap = new Map();
            for (let oldElem of oldReps) {
                let oldAttr = oldElem.getAttribute("data-replace");
                let current = oldRepMap.get(oldAttr);
                if (current === undefined) {
                    oldRepMap.set(oldAttr, oldElem);
                }
                else {
                    console.error("Multiple data-ajax");
                    return false;
                }
            }
            for (let newElem of newReps) {
                let newAttr = newElem.getAttribute("data-replace");
                let current = newRepMap.get(newAttr);
                if (current === undefined) {
                    newRepMap.set(newAttr, newElem);
                }
                else {
                    console.error("Multiple data-ajax");
                    return false;
                }
            }
            for (let [attrAJax, oldElem] of oldRepMap) {
                let newElem = newRepMap.get(attrAJax);
                if (newElem === undefined) {
                    console.error("data-ajax Only Old Element");
                    return false;
                }
                else {
                    let attr = attrAJax.split("-")[1];
                    if (attr === "innerHTML") {
                        oldElem.innerHTML = newElem.innerHTML;
                    }
                    else {
                        let newValue = newElem.getAttribute(attr);
                        if (newValue === null)
                            newValue = "";
                        oldElem.setAttribute(attr, newValue);
                    }
                }
            }
            return true;
        }
        Insert(currentD) {
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
        }
        anchorClick(a, e) {
            history.pushState({}, "", a.href);
            this.Move();
            e.preventDefault();
        }
        Ready() {
            const A_QUERY = "a[href^='/']";
            this.progress = document.querySelector("#loader>.progress-ring");
            this.loader = document.getElementById("loader");
            this.centerInfo = document.getElementById("center-info");
            this.loaderInfo = document.getElementById("loader-info");
            this.loaderMessage = document.getElementById("loader-message");
            //該当ページのみに存在するAエレメント
            let tempAs = new Set();
            var starts = document.querySelectorAll("meta[data-start]");
            for (let startElement of starts) {
                let pairMeta = startElement.getAttribute("data-start");
                let currentElement = startElement.nextElementSibling;
                while (currentElement.getAttribute("data-end") != pairMeta) {
                    let childAs = currentElement.querySelectorAll(A_QUERY);
                    for (let childA of childAs) {
                        //一時的なイベントリスナとして追加する
                        this.addListener(childA, "click", this.anchorClick.bind(this, childA));
                        tempAs.add(childA);
                    }
                    currentElement = currentElement.nextElementSibling;
                }
            }
            if (this.sharedAnchorElements === undefined) {
                //初回の連携の場合
                let sharedAs = new Set();
                let allAs = document.querySelectorAll(A_QUERY);
                for (let anchor of allAs) {
                    if (!tempAs.has(anchor)) {
                        //恒久的なイベントリスナとして追加する
                        anchor.addEventListener("click", this.anchorClick.bind(this, anchor));
                        sharedAs.add(anchor);
                    }
                }
                this.sharedAnchorElements = sharedAs;
            }
            this.temporaryAnchorElements = tempAs;
        }
        Load() {
        }
        PreUnLoad() {
            var checkbox = document.getElementById("menu-checkbox");
            if (checkbox.checked)
                checkbox.checked = false;
        }
        AfterUnLoad() {
        }
    }());
///<reference path="./main.ts"/>
LoadManager.AddItem(new class TocManager extends LoadManager {
    Ready() {
        var toc = document.getElementById("toc");
        if (toc != null) {
            var wrapper = toc.parentElement;
            var main = document.getElementById("main") || document;
            var currentId = null;
            const margin = 8;
            var update = () => {
                if (window.getComputedStyle(toc).position === "sticky") {
                    { //目次の高さ調整
                        //画面内の絶対座標
                        var wPos = wrapper.getBoundingClientRect();
                        //親のTopと最小のMargin
                        //画面内に親の上端が存在すると使われる場合がある
                        var top = Math.max(wPos.top, margin);
                        var bottom = Math.min(wPos.bottom, window.innerHeight - margin);
                        toc.style.maxHeight = (bottom - top) + "px";
                    }
                    { //現在読んでいる内容への更新
                        var last = null;
                        var hs = main.querySelectorAll("h1,h2,h3,h4,h5,h6");
                        if (hs.length)
                            last = hs[0];
                        for (var i = 1; i < hs.length; i++) {
                            var h = hs[i];
                            if (h.getBoundingClientRect().top <= margin) {
                                last = h;
                            }
                            else {
                                break;
                            }
                        }
                        if (last !== null && last.id) {
                            if (currentId !== last.id) {
                                // 以前にアクティブな項目があり、それが現在と異なる場合、強調を解除
                                if (currentId !== null)
                                    toc.querySelector("a.current")?.classList?.remove("current");
                                var target = toc.querySelector(`a[href="#${encodeURIComponent(last.id)}"]`);
                                currentId = last.id;
                                if (target) {
                                    target.classList.add("current");
                                }
                            }
                        }
                        else {
                            // 見出しが見つからない場合、または見出しにIDがない場合、現在の強調を解除
                            if (currentId !== null)
                                toc.querySelector("a.current")?.classList?.remove("current");
                            currentId = null;
                        }
                        if (currentId !== null) {
                            var target = toc.querySelector(`a[href="#${encodeURIComponent(last.id)}"]`);
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
    }
    Load() {
    }
    PreUnLoad() {
    }
    AfterUnLoad() {
    }
}());
//# sourceMappingURL=main.js.map