define('pedro/tokenizer', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

var Tokenizer = function(rules, flag) { };

(function() {

    this.getLineTokens = function(line, startState) {
        
        var tokens = [];
        tokens.push({"type" : "text", "value": line});
	$.ajax({
		type:  	  'POST',
		url:   	  '/pedro/line_tokens',
		dataType: 'json',
		async: 	  false,
		data: 	  { 'line' : line },
		success:  function(theTokens) { tokens = theTokens; }
	});
        
        return {
            tokens : tokens,
            state : startState
        };
    };

}).call(Tokenizer.prototype);

	exports.Tokenizer = Tokenizer;
});

define('ace/mode/example', function(require, exports, module) {

	var oop = require("ace/lib/oop");
	var TextMode = require("ace/mode/text").Mode;
	var Tokenizer = require("pedro/tokenizer").Tokenizer;
	var ExampleHighlightRules = require("ace/mode/example_highlight_rules").ExampleHighlightRules;

	var Mode = function() {
	    this.$tokenizer = new Tokenizer(new ExampleHighlightRules().getRules());
	};
	oop.inherits(Mode, TextMode);

	(function() {
	    // Extra logic goes here. (see below)
	}).call(Mode.prototype);

	exports.Mode = Mode;
});

define('ace/mode/example_highlight_rules', function(require, exports, module) {

	var oop = require("ace/lib/oop");
	var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

	var ExampleHighlightRules = function() {
	    this.$rules = new TextHighlightRules().getRules();

	}

	oop.inherits(ExampleHighlightRules, TextHighlightRules);

	exports.ExampleHighlightRules = ExampleHighlightRules;
});		

/**
 * Starts Pedro... :)
 */
function StartPedro(editorId) {
		var editor = ace.edit(editorId);
		editor.setTheme("ace/theme/eclipse");
		//var PerlMode = require("ace/mode/perl").Mode;
		var PerlMode = require("ace/mode/example").Mode;
		editor.getSession().setMode(new PerlMode());

}
