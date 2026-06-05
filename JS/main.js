(() => {
  // obj/ts/util.js
  var Awaiter = class _Awaiter {
    static CreateCompleted(value) {
      let result = new _Awaiter();
      result.SetResult(value);
      return result;
    }
    static CreateFailed(error) {
      let result = new _Awaiter();
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
        } else {
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
  };
  var AsyncXHR = class {
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
          this._loading.SetResult(void 0);
          break;
        case 4:
          break;
        default:
      }
    }
    Load(ev) {
      this._done.SetResult(void 0);
    }
    Error(ev) {
      let msg = "\u30EA\u30AF\u30A8\u30B9\u30C8\u30A8\u30E9\u30FC";
      this._headersReceived.ThrowError(msg);
      this._loading.ThrowError(msg);
      this._done.ThrowError(msg);
    }
    Abort(ev) {
      let msg = "\u30AD\u30E3\u30F3\u30BB\u30EB\u3055\u308C\u307E\u3057\u305F";
      this._headersReceived.ThrowError(msg);
      this._loading.ThrowError(msg);
      this._done.ThrowError(msg);
    }
    Timeout(ev) {
      let msg = "\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8";
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
  };
  var TimeoutException = class extends Error {
  };
  var TaskTimeout = class {
    constructor(task, ms) {
      this._done = false;
      this._targetTask = task;
      if (ms < 0) {
        this.task = this._targetTask;
      } else {
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
  };
  function AttachCanceller(p) {
    var res = [void 0, void 0];
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
      } catch (e) {
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
        if (doc.readyState === "interactive" || doc.readyState === "complete") {
          resolve(null);
        } else {
          doc.addEventListener("DOMContentLoaded", (e) => {
            resolve(e);
          });
        }
      }),
      new Promise((resolve, reject) => {
        if (doc.readyState === "complete") {
          resolve(null);
        } else {
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

  // obj/ts/loadManager.js
  var LoadManager = class _LoadManager {
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
      _LoadManager.DOMContentLoaded();
      await timing[1];
      _LoadManager.load();
    }
    static DOMContentLoaded() {
      for (var item of _LoadManager.Items) {
        if (!item.IsReady) {
          item.Ready();
          item._IsReady = true;
        }
      }
    }
    static load() {
      for (var item of _LoadManager.Items) {
        if (!item.IsLoaded) {
          item.Load();
          item._IsLoaded = true;
        }
      }
    }
    static RaiseUnLoad() {
      for (var item of _LoadManager.Items) {
        item.UnLoadGlobal();
        item._IsLoaded = false;
        item._IsReady = false;
      }
    }
    static RaiseReady() {
      {
        Prism.highlightAll();
      }
      _LoadManager.DOMContentLoaded();
    }
    static RaiseLoad() {
      _LoadManager.load();
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
    get IsReady() {
      return this._IsReady;
    }
    get IsLoaded() {
      return this._IsLoaded;
    }
    addListener(target, type, listener, unload) {
      target.addEventListener(type, listener);
      this.Listeners.push([target, type, listener, unload]);
    }
    static AddItem(item) {
      _LoadManager.Items.push(item);
    }
  };
  LoadManager.Items = [];

  // obj/ts/dom.js
  function OnReloadClick() {
    location.reload();
  }
  window.OnReloadClick = OnReloadClick;

  // obj/ts/img.js
  LoadManager.AddItem(new class ImgClick extends LoadManager {
    Ready() {
      var article = document.getElementById("article");
      if (article === null)
        return;
      var chkbx = document.getElementById("img-checkbox");
      var overlaySpace = document.getElementById("img-overlay").lastChild;
      var dumy;
      var current;
      var open = (img2) => {
        current = img2;
        dumy = document.createElement("div");
        dumy.classList.add("dumy-img");
        img2.parentNode.insertBefore(dumy, img2);
        img2.parentNode.removeChild(img2);
        overlaySpace.appendChild(img2);
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
      {
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
          this.addListener(img, "click", function(e) {
            console.log(`click=${chkbx.checked}`);
            if (chkbx.checked)
              overlaySpace.classList.toggle("raw-size");
            else
              open(this);
            e.stopPropagation();
          }, (i2) => i2.classList.remove("clickable"));
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

  // obj/ts/pushstate.js
  var MoveState;
  (function(MoveState2) {
    MoveState2[MoveState2["Cold"] = 0] = "Cold";
    MoveState2[MoveState2["Removed"] = 1] = "Removed";
    MoveState2[MoveState2["Replaced"] = 2] = "Replaced";
  })(MoveState || (MoveState = {}));
  if (history.pushState !== void 0 && window.onpopstate !== void 0)
    LoadManager.AddItem(new class AnchorManager extends LoadManager {
      constructor() {
        super();
        this.oldPathName = document.location.pathname;
        this.moveState = MoveState.Cold;
        this.canceller = null;
        this.sharedAnchorElements = void 0;
        this.temporaryAnchorElements = /* @__PURE__ */ new Set();
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
            req.send();
            if (this.moveState != MoveState.Removed) {
              LoadManager.RaiseUnLoad();
              this.Remove();
              this.loaderMessage.innerText = "";
              this.loader.classList.add("progress-active");
              console.debug("Removed");
            } else {
              console.debug("Remove Skipped");
            }
            this.loader.classList.remove("reload-active");
            this.loader.classList.remove("center-active");
            this.loader.classList.remove("message-active");
            this.moveState = MoveState.Removed;
            try {
              {
                let task = AttachCanceller(new TaskTimeout(req.HeadersReceived(), 1500).task);
                this.canceller = task[0];
                let res = await task[1];
                if (!res[0]) {
                  this.CancelTask();
                  return;
                }
              }
              {
                let task = AttachCanceller(new TaskTimeout(req.Done(), 5e3).task);
                this.canceller = task[0];
                let res = await task[1];
                if (!res[0]) {
                  this.CancelTask();
                  return;
                }
              }
            } catch (ex) {
              this.loader.classList.add("reload-active");
              this.loader.classList.add("message-active");
              if (ex instanceof TimeoutException) {
                this.loaderMessage.innerText = "\u8AAD\u307F\u8FBC\u307F\u306B\u6642\u9593\u304C\u304B\u304B\u3063\u3066\u3044\u307E\u3059";
              } else {
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
            } catch (ex) {
              if (ex instanceof TimeoutException) {
                throw ["Timeout", "\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F"];
              } else {
                throw ["Error", ex];
              }
            }
          }
          var dom = req.response;
          {
            let task = AttachCanceller(DOMEventsAsync(dom)[0]);
            this.canceller = task[0];
            let res = await task[1];
            if (!res[0]) {
              this.CancelTask();
              return;
            }
          }
          {
            let replaceSuccess = this.Replace(dom);
            if (!replaceSuccess) {
              if (200 <= req.statusCode && req.statusCode < 300) {
                throw ["Error", "\u30B3\u30F3\u30C6\u30F3\u30C4\u304C\u4E0D\u6B63\u3067\u3057\u305F"];
              } else {
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
        } catch (ex) {
          this.moveState = MoveState.Cold;
          this.canceller = null;
          if (Array.isArray(ex)) {
            this.centerInfo.innerText = ex[0];
            this.loaderMessage.innerText = ex[1];
          } else {
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
        var oldRepMap = /* @__PURE__ */ new Map();
        var newRepMap = /* @__PURE__ */ new Map();
        for (let oldElem of oldReps) {
          let oldAttr = oldElem.getAttribute("data-replace");
          let current2 = oldRepMap.get(oldAttr);
          if (current2 === void 0) {
            oldRepMap.set(oldAttr, oldElem);
          } else {
            console.error("Multiple data-ajax");
            return false;
          }
        }
        for (let newElem of newReps) {
          let newAttr = newElem.getAttribute("data-replace");
          let current2 = newRepMap.get(newAttr);
          if (current2 === void 0) {
            newRepMap.set(newAttr, newElem);
          } else {
            console.error("Multiple data-ajax");
            return false;
          }
        }
        for (let [attrAJax, oldElem] of oldRepMap) {
          let newElem = newRepMap.get(attrAJax);
          if (newElem === void 0) {
            console.error("data-ajax Only Old Element");
            return false;
          } else {
            let attr = attrAJax.split("-")[1];
            if (attr === "innerHTML") {
              oldElem.innerHTML = newElem.innerHTML;
            } else {
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
        for (var i = 0; i < oldStarts.length; i++) {
          var oldStart = oldStarts[i];
          var oldEnd = oldStart.nextElementSibling;
          for (var j = 0; j < nowStarts.length; j++) {
            var nowStart = nowStarts[j];
            var dAjax = oldStart.getAttribute("data-start");
            if (dAjax === nowStart.getAttribute("data-start")) {
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
        let tempAs = /* @__PURE__ */ new Set();
        var starts = document.querySelectorAll("meta[data-start]");
        for (let startElement of starts) {
          let pairMeta = startElement.getAttribute("data-start");
          let currentElement = startElement.nextElementSibling;
          while (currentElement.getAttribute("data-end") != pairMeta) {
            let childAs = currentElement.querySelectorAll(A_QUERY);
            for (let childA of childAs) {
              this.addListener(childA, "click", this.anchorClick.bind(this, childA));
              tempAs.add(childA);
            }
            currentElement = currentElement.nextElementSibling;
          }
        }
        if (this.sharedAnchorElements === void 0) {
          let sharedAs = /* @__PURE__ */ new Set();
          let allAs = document.querySelectorAll(A_QUERY);
          for (let anchor of allAs) {
            if (!tempAs.has(anchor)) {
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

  // obj/ts/toc.js
  function EscapeDataString(input) {
    return encodeURIComponent(input).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
  }
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
            {
              var wPos = wrapper.getBoundingClientRect();
              var top = Math.max(wPos.top, margin);
              var bottom = Math.min(wPos.bottom, window.innerHeight - margin);
              toc.style.maxHeight = bottom - top + "px";
            }
            {
              var last = null;
              var hs = main.querySelectorAll("h1,h2,h3,h4,h5,h6");
              if (hs.length)
                last = hs[0];
              for (var i = 1; i < hs.length; i++) {
                var h = hs[i];
                if (h.getBoundingClientRect().top <= margin) {
                  last = h;
                } else {
                  break;
                }
              }
              if (last !== null && last.id) {
                if (currentId !== last.id) {
                  if (currentId !== null)
                    toc.querySelector("a.current")?.classList?.remove("current");
                  var target = toc.querySelector(`a[href="#${EscapeDataString(last.id)}"]`);
                  currentId = last.id;
                  if (target) {
                    target.classList.add("current");
                  }
                }
              } else {
                if (currentId !== null)
                  toc.querySelector("a.current")?.classList?.remove("current");
                currentId = null;
              }
              if (currentId !== null) {
                var target = toc.querySelector(`a[href="#${EscapeDataString(last.id)}"]`);
                if (target) {
                  var pos = target.offsetTop + target.scrollTop + target.clientHeight / 2;
                  toc.scrollTop = pos - toc.clientHeight / 2;
                }
              }
            }
          } else {
            toc.style.maxHeight = null;
            if (currentId !== null) {
              currentId = null;
              toc.querySelector("a.current")?.classList?.remove("current");
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

  // obj/ts/main.js
  LoadManager.Init();
})();
//# sourceMappingURL=main.js.map
