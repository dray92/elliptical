var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var chai = require('chai');
var expect = chai.expect;
var lacona;
var sinon = require('sinon');

chai.use(require('sinon-chai'));

if (typeof window !== 'undefined' && window.lacona) {
	lacona = window.lacona;
} else {
	lacona = require('../src/lacona');
}


describe('Parser with fuzzy matching', function () {
	var parser;
	beforeEach(function() {
		parser = new lacona.Parser({fuzzy: true});
	});

	it('supports fuzzy matching', function (done) {
		var schema = {
			root: 'a simple test',
			run: ''
		}

		var onData = sinon.spy(function (data) {
			expect(data.suggestion.charactersComplete).to.equal(10);
			expect(data.suggestion.words[0].string).to.equal('a simple test');
		});

		var onEnd = function () {
			expect(onData).to.have.been.called.once;
			done();
		};

		parser
		.understand(schema)
		.on('data', onData)
		.on('end', onEnd)
		.parse('asmlt');
	});
});