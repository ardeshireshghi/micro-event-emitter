'use strict';

///////////////////////////////////////////////////////////////////////////////
// Dependencies
//
// 3rd-party
var expect       = require('chai').expect;
var sinon        = require('sinon');

// Unit-under-test
var MicroEventEmitter = require('../src/microEventEmitter.js');

///////////////////////////////////////////////////////////////////////////////
// Tests
//
describe('MicroEventEmitter', function() {
  describe('#constructor', function() {
    it('should create a correct instance', function() {
      var emitter = new MicroEventEmitter();
      expect(emitter).to.be.instanceof(MicroEventEmitter);
    });
  });

  describe('#on', function() {
    var emitter;
    var handler = function(){};

    before(function(){
      emitter = new MicroEventEmitter();

      sinon.spy(emitter, 'on');
      emitter.on('testeventname', handler)
             .on('anotherevent', handler);
    });
    
    it('should be called with correct arguments', function() {
      expect(emitter.on.calledWith('testeventname', handler)).to.be.true;
      expect(emitter.on.calledWith('anotherevent', handler)).to.be.true;
    });

    it('should add event metadata attributes to the handler function/object correctly', function() {
      expect(handler).to.have.property('anotherevent');
      expect(handler).to.have.property('testeventname');
      expect(handler.testeventname).to.have.property('_id');
      expect(handler.anotherevent).to.have.property('_id');
      expect(handler.anotherevent._id).to.not.equal(handler.testeventname._id);
    });

    after(function() {
      emitter.on.restore();
    });
  });

  describe('#off/emit', function() {
    var emitter;
    var handler;
    var handler2;

    beforeEach(function() {
      emitter = new MicroEventEmitter();
      handler = sinon.spy();
      handler2 = sinon.spy();
      emitter.on('testeventname', handler)
             .on('anotherevent', handler)
             .on('anotherevent', handler2)
             .on('thirdevent', handler);
    });
    
    it('should not emit "testeventname" handler after handler is off', function() {
      emitter.off('testeventname', handler);
      emitter.emit('testeventname');
      expect(handler.calledOnce).to.be.false;
    })

    it('should emit "anotherevent" handler after "testeventname" handler is off', function() {
      emitter.off('testeventname', handler);
      emitter.emit('testeventname');
      expect(handler.calledOnce).to.be.false;
      emitter.emit('anotherevent', {foo: 'bar'});
      expect(handler.calledWith({foo: 'bar'})).to.be.true;
    });

    it('should not emit any of the event handlers when we remove all', function() {
      emitter.emit('anotherevent', {should: 'call'});
      emitter.off('anotherevent');
      emitter.emit('anotherevent', {nice: 'try'});

      expect(handler.calledWith({should: 'call'})).to.be.true;
      expect(handler2.calledWith({should: 'call'})).to.be.true;
      expect(handler.calledWith({nice: 'try'})).to.be.false;
      expect(handler2.calledWith({nice: 'try'})).to.be.false;
    });
  });

  describe('#once', function() {
    var emitter;
    var handler;
    
    beforeEach(function() {
      emitter = new MicroEventEmitter();
      handler = sinon.spy();
      emitter.once('testeventname', handler);
    });

    it('should emit "testeventname" handler ONLY once', function() {
      var i = -1;
      while (++i < 100) {
        emitter.emit('testeventname', {foo: 'bar'});
      }
      
      expect(handler.calledOnce).to.be.true;
      expect(handler.calledWith({foo: 'bar'})).to.be.true;

    });

    it('should emit "testeventname" handler several times when "on" is used after "once"', function() {
      var i = -1;
      var expectedCalls = 5;
      emitter.on('testeventname', handler);
      while (++i < expectedCalls) {
        emitter.emit('testeventname', {foo: 'bar'});
      }
      expect(handler.calledOnce).to.be.false;
      expect(handler.callCount).to.equal(expectedCalls);
      expect(handler.calledWith({foo: 'bar'})).to.be.true;
    });
  });
});
