'use strict';

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
    on: function(eventName, listenerFn, context, isOnce) {
      this._events[eventName] = this._events[eventName] || []; 
      this._events[eventName].push({
        handler: listenerFn, 
        once: (isOnce === true), 
        context: context || null
      }); 
      
      listenerFn[eventName] = listenerFn[eventName] || {};
      listenerFn[eventName]._id = parseInt(Math.random() * 10000000000, 32);
      
      return this;  
    },
    
    once: function(eventName, listenerFn, context) {
      var args = Array.prototype.slice.call(arguments, 0, 2);
      context = context || null;
      
      listenerFn[eventName] = listenerFn[eventName] || {};
      args = args.concat(context, true);
      this.on.apply(this, args);
      return this;
    },
    
    emit: function(eventName, data) {
      var _this = this;
      var args = arguments;
      if (eventName in this._events) {
        this._events[eventName].forEach(function(event) {
          var handlerFn = event.handler;
          handlerFn.call(event.context, data); 
          if (event.once) {
            _this.off.call(_this, eventName, handlerFn);
          }
        });
      }

      return this;
    },
    
    off: function(eventName, listenerFn) {
      var _this = this;
      if (!(eventName in this._events)) {
        return this;
      }
      
      if (typeof listenerFn !== 'function') {
        delete this._events[eventName];
        return this;
      } 
      
      // Can not remove listener without identifier
      if (typeof listenerFn[eventName]._id === 'undefined') {
        return this;
      }
        
      this._events[eventName].forEach(function(event, index) {
        var idsEqual = (listenerFn[eventName]._id === event.handler[eventName]._id);
        if (idsEqual) {
          // Remove specific event from the list of the event name handlers
          _this._events[eventName].splice(index, 1);
        }
      });
      
      return this;
    },

    removeAllListeners: function() {
      this._events = {};
      return this;
    }
  };

  return MicroEventEmitter;
});
