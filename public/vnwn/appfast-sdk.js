//v=0.0.14

function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  
  window._appfastDiv = null;
  
  class Appfast {
    _projectId = null;
    _widgetId = null;

    constructor(options) {
      if (!inIframe() && !window.ReactNativeWebView) {
        return false;
      }
  
      this._projectId = options.projectId || null;
  
      window.addEventListener("message", (event) => {
        let dataParser = {};
        try {
          dataParser = JSON.parse(event.data);
        } catch (e) {
          console.log(e, 'error');
        }
  
        if (dataParser && dataParser.action) {
          const { name, data } = dataParser.action;
          const event = new CustomEvent(name, { detail: data });
          window._appfastDiv.dispatchEvent(event);
        }
      }, false);
  
      this.initApp();
    }
  
    async initApp() {
      if (!inIframe() && !window.ReactNativeWebView) {
        return false;
      }
  
      window._appfastDiv = document.createElement("div");
      window._appfastDiv.id = 'appfast-custom-code';
      document.body.appendChild(window._appfastDiv);

      this._widgetId = await this.getWidgetId();
    }
  
    async getAction(name, data = {}) {
      if (!inIframe() && !window.ReactNativeWebView) {
        return false;
      }
  
      const msg = {
        projectId: this._projectId,
        widgetId: this._widgetId,
        location: window.location.href,
        action: { name, data }
      };
  
      const _topWebview = window.ReactNativeWebView || window.parent;
      if (window.ReactNativeWebView) {
        _topWebview.postMessage(JSON.stringify(msg));
      } else {
        _topWebview.postMessage(JSON.stringify(msg), '*');
      }
  
      return new Promise((res) => {
        window._appfastDiv.addEventListener(name, e => {
          return res(e.detail);
        });
      });
    }

    getWidgetId() {
      return this.getAction('GET_WIDGET_ID');
    }
  
    getCurrentUser() {
      return this.getAction('GET_CURRENT_USER');
    }
  
    getWidgetConfigs() {
      return this.getAction('GET_WIDGET_CONFIGS');
    }
  
    getProject() {
      return this.getAction('GET_PROJECT');
    }
  
    getCurrentScreen() {
      return this.getAction('GET_CURRENT_SCREEN');
    }
  
    getStorage(name) {
      return this.getAction('GET_STORAGE', {
        name
      });
    }
  
    getPlatform() {
      return this.getAction('GET_PLATFORM');
    }
  
    getData(options) {
      return this.getAction('GET_DATA', {
        options
      });
    }
  
    getCustomConfigs(name) {
      return this.getAction('GET_CUSTOM_CONFIGS', {
        name
      });
    }
  
    setStorage(name, value) {
      return this.getAction('SET_STORAGE', {
        name,
        value
      });
    }
  
    goToScreen(data) {
      return this.getAction('GO_TO_SCREEN', data);
    }
  
    goToProject(data) {
      return this.getAction('GO_TO_PROJECT', data);
    }
  
    setCustomConfigs(name, value) {
      return this.getAction('SET_CUSTOM_CONFIGS', {
        name,
        value
      });
    }
  
    alert(data) {
      return this.getAction('ALERT', data);
    }
  
    graphQuery(query, variables, extraInfo) {
      return this.getAction("GRAPH_QUERY", {query, variables, ...extraInfo})
    }
  
    graphMutate(mutation, variables, extraInfo) {
      return this.getAction("GRAPH_MUTATE", {mutation, variables, ...extraInfo})
    }
    
    updatePoint() {
      return this.getAction("UPDATE_POINT");
    }

    setViewSize(width, height) {
      return this.getAction("SET_VIEW_SIZE", {width, height});
    }

    reloadWebview() {
      return this.getAction("RELOAD_WEBVIEW");
    }
  }
  