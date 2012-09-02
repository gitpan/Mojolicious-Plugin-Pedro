/**
 * Starts Pedro... :)
 */
function StartPedro(editorId) {

	function winHeight() {
		return window.innerHeight || (document.documentElement || document.body).clientHeight;
	}
	function goFullScreen(cm) {
		var wrap = cm.getWrapperElement(), scroll = cm.getScrollerElement();
		wrap.className += " CodeMirror-fullscreen";
		scroll.style.height = winHeight() + "px";
		document.documentElement.style.overflow = "hidden";
		cm.refresh();
	}
	CodeMirror.connect(window, "resize", function() {
		var showing = document.body.getElementsByClassName("CodeMirror-fullscreen")[0];
		if (!showing) return;
		showing.CodeMirror.getScrollerElement().style.height = winHeight() + "px";
	});

	$("#theme_selector").change(function() {
		var input = document.getElementById("theme_selector");
		var theme = input.options[input.selectedIndex].innerHTML;
		editor.setOption("theme", theme);
	});

	var jsResultEditor = CodeMirror.fromTextArea(document.getElementById("js-result"), {
		lineNumbers: true,
		matchBrackets: true,
		mode: "text/javascript",
		readOnly: true,
	});
	
	var editor = CodeMirror.fromTextArea(document.getElementById(editorId), {
		lineNumbers: true,
		matchBrackets: true,
		tabSize: 4,
		indentUnit: 4,
		indentWithTabs: true,
		mode: "text/x-perl",
		extraKeys: {
			"F1": function(cm) {
				var selection = cm.getSelection();
				if(selection) {
					alert("The following is selected: '" + selection + "'");
				} else {
					alert("No selection found!");
				}
			},
		},
		onCursorActivity: function() {
			// Highlight active line
			editor.setLineClass(hlLine, null, null);
			hlLine = editor.setLineClass(editor.getCursor().line, null, "activeline");

			// Highlight selection matches
			editor.matchHighlight("CodeMirror-matchhighlight");
		},
		onGutterClick: function(cm, n) {
			var info = cm.lineInfo(n);
			if (info.markerText) {
				cm.clearMarker(n);
			} else {
				cm.setMarker(n, "<span style=\"color: #900\">*</span> %N%");
			}
		}
	});

	// Pedro should be fullscreen
	goFullScreen(editor);

	// Highlight active line
	var hlLine = editor.setLineClass(0, "activeline");

	$("#run_in_browser_button").click(function() {
		$("#actions_dialog").dialog("close");
		$("#output_dialog").dialog("open");
		runOnPerlito(jsResultEditor, editor.getValue());
	}).button();

	$("#perl_tidy_button").click(function() {
		$.post('/pedro/perl_tidy', {"source": editor.getValue()}, function(data) {
			if(data.error == '') {
				editor.setValue(data.source);
			} else {
				alert('Error:\n' + data.error);
			}
			$("#actions_dialog").dialog("close");
		});
	}).button();

	$("#run_button").click(function() { 
		alert("Not implemented yet!");
	}).button().hide();
	
	$("#open_button").click(function() {
		alert("Not implemented yet!");
	}).button().hide();

	$("#save_button").click(function() {
		alert("Not implemented yet!");
	}).button().hide();
	
	$("#save_as_button").click(function() {
		alert("Not implemented yet!");
	}).button().hide();

	$("#output_tabs").tabs();
	$("#output_dialog").dialog({autoOpen: false, title: "Output", width: 500});
	$("#options_dialog").dialog({autoOpen: false, title: "Options"});
	$("#actions_dialog").dialog({autoOpen: false, title: "Actions"});
	$("#help_dialog").dialog({autoOpen: false});

	$("#js-result + .CodeMirror").css("width", "100%");
	$("#editor + .CodeMirror").css("box-shadow", "0px 0px 81px 11px gray");

	$("#options_dialog_selector").mouseover(function() {
		$(this).animate({
			opacity: 1.0,
		});
		$("#selector_text").html("Options");
	}).mouseout(function() {
		$(this).animate({opacity: 0.3});
		$("#selector_text").html("");
	}).click(function() {
		$("div").dialog("close");
		$("#options_dialog").dialog("open");
	});
	$("#actions_dialog_selector").mouseover(function() {
		$(this).animate({
			opacity: 1.0,
		});
		$("#selector_text").html("Actions");
	}).mouseout(function() {
		$(this).animate({opacity: 0.3});
		$("#selector_text").html("");
	}).click(function() {
		$("div").dialog("close");
		$("#actions_dialog").dialog("open");
	});
	$("#output_dialog_selector").mouseover(function() {
		$(this).animate({
			opacity: 1.0,
		});
		$("#selector_text").html("Output");
	}).mouseout(function() {
		$(this).animate({opacity: 0.3});
		$("#selector_text").html("");
	}).click(function() {
		$("div").dialog("close");
		$("#output_dialog").dialog("open");
	});

}

function runOnPerlito(jsResultEditor, source) {

	var $printResult = $('#print-result');
	var $logResult = $("#log-result");

	p5pkg.CORE.print = function(List__) {
		var i;
		for (i = 0; i < List__.length; i++) {
			$printResult.val( $printResult.val() + p5str(List__[i]));
		}
		return true;
	};
	p5pkg.CORE.warn = function(List__) {
		var i;
		List__.push("\n");
		for (i = 0; i < List__.length; i++) {
			$logResult.val( $logResult.val() + p5str(List__[i]));
		}
		return true;
	};
	p5pkg["main"]["v_^O"] = "browser";
	p5pkg["main"]["Hash_INC"]["Perlito5/strict.pm"] = "Perlito5/strict.pm";
	p5pkg["main"]["Hash_INC"]["Perlito5/warnings.pm"] = "Perlito5/warnings.pm";

	$logResult.val('');
	jsResultEditor.setValue('');
	$printResult.val('');
	try {
		// Compile Perl 5 source code into JavaScript
		$logResult.val($logResult.val() + "Compiling.\n");
		var start = new Date().getTime();
		var js_source = p5pkg["Perlito5"].compile_p5_to_js([source]);
		$logResult.val($logResult.val() + "Compilation time: " + (new Date().getTime() - start) + "ms\n");
		jsResultEditor.setValue(js_source + ";\n");
		jsResultEditor.setOption("mode", jsResultEditor.getOption("mode"))

		// Run JavaScript inside your browser
		start = new Date().getTime();
		eval(js_source);
		$logResult.val( $logResult.val() + "Running time: " + (new Date().getTime() - start) + "ms\n");
	}
	catch(err) {
		$logResult.val("Error:\n" + err + "\nCompilation aborted.\n");
		$("#bottom_panel").tabs( "select" , 1 );
	}
}