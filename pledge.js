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
		succ = false;
	}
	if(!(typeof err === 'function')) {
		err = false;
	}
	this.handlerGroups.push({successCb: succ, errorCb: err});
	
	if(this.state === 'resolved') {
		for (var x = 0; x < this.handlerGroups.length; x++){
			this.value = this.handlerGroups[x].successCb(this.value);
		}
		this.handlerGroups = [];
	}
}

Deferral.prototype.resolve = function(value){
	if (this.$promise.state === 'pending') {
		this.$promise.state = 'resolved';
		this.$promise.value = value;
		if (this.$promise.handlerGroups.length > 1) {
			for (var x = 0; x < this.$promise.handlerGroups.length; x++){
				this.$promise.value = this.$promise.handlerGroups[x].successCb(this.$promise.value);
			}
			this.$promise.handlerGroups = [];
		}
	}
}

Deferral.prototype.reject = function(value){
	if (this.$promise.state === 'pending') {
		this.$promise.state = 'rejected';
		this.$promise.value = value;
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
