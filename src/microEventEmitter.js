(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["MicroEventEmitter"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.MicroEventEmitter = factory();
  }
})(this,function() {
  function MicroEventEmitter() {
    this._events = {};
  }

  MicroEventEmitter.prototype = {
    on: function(eventName, listenerFn, context) {
      this._events[eventName] = this._events[eventName] || []; 
      this._events[eventName].push(listenerFn); 
      listenerFn._id = parseInt(Math.random() * 10000000000, 32);
      listenerFn._context = context || null;  
      listenerFn._called = 0;
      return this;  
    },
    
    once: function(eventName, listenerFn, context) {
      listenerFn._isOnce = true;
      this.on.apply(this, arguments);
      return this;
    },
    
    emit: function(eventName, data) {
      var _this = this;
      var args = arguments;
      if (eventName in this._events) {
        this._events[eventName].forEach(function(handlerFn) {
          handlerFn.call(handlerFn._context, data); 
          handlerFn._called++;
          if (handlerFn._isOnce) {
            delete handlerFn._isOnce;
            _this.off.apply(_this, args);
          }
        });
      }

      return this;
    },
    
    off: function(eventName, listenerFn) {
      var _this = this;
      if (eventName in this._events) {
        if (typeof listenerFn !== 'function') {
          delete this._events[eventName];
        } else {
          // Can not remove listener without identifier
          if (!listenerFn._id) {
            return;
          }
          
          this._events[eventName].forEach(function(handlerFn, index) {
            if (listenerFn._id && listenerFn._id === handlerFn._id) {
              _this._events[eventName].splice(index, 1);
            }
          });
        }
      }

      return this;
    },

    removeAllListeners: function() {
      this._events = {};
      return this;
    }
  };

  return MicroEventEmitter;
});
