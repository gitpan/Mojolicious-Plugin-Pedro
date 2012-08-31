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
}
