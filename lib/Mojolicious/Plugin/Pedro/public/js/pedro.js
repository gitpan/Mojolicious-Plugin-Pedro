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

	$("#run_on_perlito").click(function() {
		runOnPerlito(editor.getValue());
	});

	$("#run_on_perlito").button();
	$("#tabs").tabs();
}

function runOnPerlito(source) {

	p5pkg.CORE.print = function(List__) {
		var i;
		for (i = 0; i < List__.length; i++) {
			document.getElementById('print-result').value += p5str(List__[i]);
		}
		return true;
	};
	p5pkg.CORE.warn = function(List__) {
		var i;
		List__.push("\n");
		for (i = 0; i < List__.length; i++) {
			document.getElementById('log-result').value += p5str(List__[i]);
		}
		return true;
	};
	p5pkg["main"]["v_^O"] = "browser";
	p5pkg["main"]["Hash_INC"]["Perlito5/strict.pm"] = "Perlito5/strict.pm";
	p5pkg["main"]["Hash_INC"]["Perlito5/warnings.pm"] = "Perlito5/warnings.pm";

	var pos = 0;
	var ast;
	var match;
	document.getElementById('log-result').value   = "";
	document.getElementById('js-result').value    = "";
	document.getElementById('print-result').value = "";
	try {
		// compile
		document.getElementById('log-result').value += "Compiling.\n";
		var start = new Date().getTime();
		var js_source = p5pkg["Perlito5"].compile_p5_to_js([source]);
		var end = new Date().getTime();
		var time = end - start;
		document.getElementById('log-result').value +=  "Compilation time: " + time + "ms\n";
		document.getElementById('js-result').value  += js_source + ";\n";

		// run
		start = new Date().getTime();
		eval(js_source);
		end = new Date().getTime();
		time = end - start;
		document.getElementById('log-result').value += "Running time: " + time + "ms\n";
		p5pkg.CORE.print(["\nDone.\n"]);
	}
	catch(err) {
		document.getElementById('log-result').value += "Error:\n";
		document.getElementById('log-result').value += err + "\n";
		document.getElementById('log-result').value += "Compilation aborted.\n";
	}
}