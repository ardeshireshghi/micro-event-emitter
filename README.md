# micro-event-emitter
### Intro
This is a very lightweight javascript events (Publisher/ Subscriber pattern) library which provides an easy to use API very similar to node EventEmitter.

### How to use
```
var emitter = new MicroEventEmitter();
var customEventHandler = function(data) {
 // Do something
}

// Bind and emit events
emitter.on('customevent', customEventHandler);
emitter.emit('customevent', {foo: 'bar'});
emitter.off('customevent', customEventHandler);

// On off event listeners
emitter.once('customevent', customEventHandler);
emitter.emit('customevent', {foo: 'bar'});
```

### Api
#### MicroEventEmitter.on(eventName, handlerFunction, context*)
Adds a new event listener to the particular `eventName`. `context` is optional.
#### MicroEventEmitter.off(eventName, handlerFunction*)
Removes a particular event listener from `eventName`. If no handler is specified it will remove all event listener functions for the given `eventName`.
#### MicroEventEmitter.once(eventName, handlerFunction, context*)
Adds a new event listener to the particular `eventName` which will be invoked only once and then will be removed. `context` is optional.
#### MicroEventEmitter.removeAllListeners()
Removes all the event listeners on the emitter
