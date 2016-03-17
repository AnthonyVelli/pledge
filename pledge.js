'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise() {
	this.state = 'pending'
	this.value = null;
	this.handlerGroups = [];
}

function Deferral(){
	this.$promise = new $Promise();
}

$Promise.prototype.then = function(succ, err) {
	
	if(!(typeof succ === 'function')) {
		succ = null;
	}
	if(!(typeof err === 'function')) {
		err = null;
	}
	this.handlerGroups.push({successCb: succ, errorCb: err, forwarder: new Deferral()});
	return this.callHandlers();
}

$Promise.prototype.callHandlers = function() {
	while (this.state === 'resolved' && this.handlerGroups.length > 0){
		this.handlerGroups.shift().successCb(this.value);
	}
	if (this.state === 'rejected' && this.handlerGroups.length > 0){
		var x = 0;
		while (x < this.handlerGroups.length){
			if (this.handlerGroups[x].errorCb){
				var errorHandler = this.handlerGroups.splice(x,1);
				errorHandler[0].errorCb(this.value);
			} else {
				x++
			}
		}
	}
	if (this.handlerGroups.length > 0){return this.handlerGroups[0].forwarder.$promise};
}

$Promise.prototype.catch = function(errorhandler){
	return this.then(null, errorhandler);
}

Deferral.prototype.resolve = function(value){
	if (this.$promise.state === 'pending') {
		this.$promise.state = 'resolved';
		this.$promise.value = value;
		$Promise.prototype.callHandlers.call(this.$promise);
	}
}

Deferral.prototype.reject = function(value){
	if (this.$promise.state === 'pending') {
		this.$promise.state = 'rejected';
		this.$promise.value = value;
		$Promise.prototype.callHandlers.call(this.$promise);
	}
}

function defer(){
	return new Deferral();
}




/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
