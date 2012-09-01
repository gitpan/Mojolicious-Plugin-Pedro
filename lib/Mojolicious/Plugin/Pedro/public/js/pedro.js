/**
 * Starts Pedro... :)
 */
function StartPedro(editorId) {

    function isFullScreen(cm) {
      return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
    }
    function winHeight() {
      return window.innerHeight || (document.documentElement || document.body).clientHeight;
    }
    function setFullScreen(cm, full) {
      var wrap = cm.getWrapperElement(), scroll = cm.getScrollerElement();
      if (full) {
        wrap.className += " CodeMirror-fullscreen";
        scroll.style.height = winHeight() + "px";
        document.documentElement.style.overflow = "hidden";
      } else {
        wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
        scroll.style.height = "";
        document.documentElement.style.overflow = "";
      }
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
        "F11": function(cm) {
          setFullScreen(cm, !isFullScreen(cm));
        },
        "Esc": function(cm) {
          if (isFullScreen(cm)) setFullScreen(cm, false);
        }
      },
	onCursorActivity: function() {
		// highlight active line
		editor.setLineClass(hlLine, null, null);
		hlLine = editor.setLineClass(editor.getCursor().line, null, "activeline");

		// Highlight selection matches
		editor.matchHighlight("CodeMirror-matchhighlight");
	  },
	 onGutterClick: function(cm, n) {
    var info = cm.lineInfo(n);
    if (info.markerText)
      cm.clearMarker(n);
    else
      cm.setMarker(n, "<span style=\"color: #900\">*</span> %N%");
  }
	});

	var hlLine = editor.setLineClass(0, "activeline");

	$("#run_in_browser_button").click(function() {
		runOnPerlito(jsResultEditor, editor.getValue());
	}).button();
	
	$("#run_button").click(function() { 
		alert("Not implemented yet!");
	}).button();
	
	$("#open_button").click(function() {
		alert("Not implemented yet!");
	}).button();

	$("#save_button").click(function() {
		alert("Not implemented yet!");
	}).button();
	
	$("#save_as_button").click(function() {
		alert("Not implemented yet!");
	}).button();

	$("#bottom_panel").tabs();

	$(".CodeMirror", "#bottom_panel").css("width", "100%");
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
		$("#log-result").val("Error:\n" + err + "\nCompilation aborted.\n");
	}
}