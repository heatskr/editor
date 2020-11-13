// ...

requirejs.config ({
  "packages": [
    {
      "name": "jquery",
      "location": "/jquery/dist",
      "main": "jquery",
    },
    {
      "name": "codemirror",
      "location": "/codemirror",
      "main": "lib/codemirror",
    },
    {
      "name": "ckeditor",
      "location": "/ck",
      "main": "ckeditor",
    }
  ],
  "paths": {
    "css"               : "/require-css/css",
    "markdownConverter" : "/requirejs-plugins/lib/Markdown.Converter",
    "text"              : "/requirejs-plugins/lib/text",
    "async"             : "/requirejs-plugins/src/async",
    "font"              : "/requirejs-plugins/src/font",
    "goog"              : "/requirejs-plugins/src/goog",
    "image"             : "/requirejs-plugins/src/image",
    "json"              : "/requirejs-plugins/src/json",
    "noext"             : "/requirejs-plugins/src/noext",
    "mdown"             : "/requirejs-plugins/src/mdown",
    "propertyParser"    : "/requirejs-plugins/src/propertyParser",
  }
});

requirejs ([
  'jquery',
  '/golden-layout/dist/goldenlayout.js',



  "codemirror",
  // comment
  "codemirror/addon/comment/comment",
  "codemirror/addon/comment/continuecomment",
  // dialog
  "codemirror/addon/dialog/dialog",
  // display
  "codemirror/addon/display/autorefresh",
  "codemirror/addon/display/fullscreen",
  "codemirror/addon/display/panel",
  "codemirror/addon/display/placeholder",
  "codemirror/addon/display/rulers",

  // edit
  "codemirror/addon/edit/closebrackets",
  "codemirror/addon/edit/closetag",
  "codemirror/addon/edit/continuelist",
  "codemirror/addon/edit/matchbrackets",
  "codemirror/addon/edit/matchtags",
  "codemirror/addon/edit/trailingspace",
  // fold
  "codemirror/addon/fold/brace-fold",
  "codemirror/addon/fold/comment-fold",
  "codemirror/addon/fold/foldcode",
  "codemirror/addon/fold/foldgutter",
  "codemirror/addon/fold/indent-fold",
  "codemirror/addon/fold/markdown-fold",
  "codemirror/addon/fold/xml-fold",
  // hint
  "codemirror/addon/hint/anyword-hint",
  // "codemirror/addon/hint/css-hint",
  // "codemirror/addon/hint/html-hint",
  // "codemirror/addon/hint/javascript-hint",
  "codemirror/addon/hint/show-hint",
  // "codemirror/addon/hint/sql-hint",
  // "codemirror/addon/hint/xml-hint",
  // scroll
  "codemirror/addon/scroll/simplescrollbars",
  "codemirror/addon/scroll/annotatescrollbar",
  // search
  "codemirror/addon/search/jump-to-line",
  "codemirror/addon/search/match-highlighter",
  "codemirror/addon/search/matchesonscrollbar",
  "codemirror/addon/search/search",
  "codemirror/addon/search/searchcursor",
  // wrap
  "codemirror/addon/wrap/hardwrap",
  // mode
  "codemirror/addon/mode/loadmode",
  "codemirror/mode/meta",


  // 'codemirror/addon/mode/multiplex',
  'codemirror/mode/css/css',
  'codemirror/mode/javascript/javascript',
  'codemirror/mode/xml/xml',
  'codemirror/mode/htmlmixed/htmlmixed',
  'codemirror/mode/htmlembedded/htmlembedded',


  // keymap
  "codemirror/keymap/sublime",

  'css!https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-base.css',
  'css!https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-dark-theme.css',
  'css!/codemirror/lib/codemirror.css',
  'css!/codemirror/theme/monokai.css',
  'css!/client.css',

], function (jQuery, GoldenLayout, CodeMirror) {

let model = {
  title: 'New App',
  language: 'en',
  charset: 'UTF-8',
  html: '',
  js: '',
  css: '',
};

var config = {
  content: [
    {
      type: 'row',
      content: [
        {
          title: 'Misc',
          width: 20,
          isClosable: false,
          type: 'component',
          componentName: 'testComponent',
          componentState: {
            label: 'A',
          },
        },
        {
          type: 'column',
          content: [
            {
              type: 'row',
              content: [
                {
                  type: 'component',
                  componentName: 'htmlComponent',
                  componentState: { label: 'A' },
                  title: 'HTML',
                  isClosable: false,
                },
                {
                  type: 'component',
                  componentName: 'jsComponent',
                  componentState: { label: 'C' },
                  title: 'JavaScript',
                  isClosable: false,
                },
                {
                  type: 'component',
                  componentName: 'cssComponent',
                  componentState: { label: 'D' },
                  title: 'CSS',
                  isClosable: false,
                }
              ]
            },
            {
              type: 'component',
              componentName: 'previewComponent',
              componentState: { label: 'B' },
              title: 'Preview',
              isClosable: false,
            },
          ]
        },
      ]
    },
  ]
};

var myLayout = new GoldenLayout( config );

var editors = {};

myLayout.registerComponent ('htmlComponent', function (container, componentState) {
  container.getElement ().html ('<div class="editor-handler"><textarea id="htmlEditor"></textarea></div>');

  requestAnimationFrame (() => {
    editors.html = CodeMirror.fromTextArea (document.querySelector ('#htmlEditor'), {
      mode: 'text/html',
      value: model.html,
    });
  });

});

myLayout.registerComponent ('jsComponent', function (container, componentState) {
  container.getElement ().html ('<div class="editor-handler"><textarea id="jsEditor"></textarea></div>');

  requestAnimationFrame (() => {
    editors.js = CodeMirror.fromTextArea (document.querySelector ('#jsEditor'), {
      mode: 'text/javascript',
      value: model.js,
    });
  });

});

myLayout.registerComponent ('cssComponent', function (container, componentState) {
  container.getElement ().html ('<div class="editor-handler"><textarea id="cssEditor"></textarea></div>');

  requestAnimationFrame (() => {
    editors.css = CodeMirror.fromTextArea (document.querySelector ('#cssEditor'), {
      mode: 'text/css',
      value: model.css
    });
  });

});


myLayout.registerComponent ('previewComponent', function (container, componentState) {
  container.getElement ().html ('<iframe id="previewFrame"></iframe>');
});

myLayout.registerComponent ('testComponent', function (container, componentState) {

  fetch ('/apps').then (res => res.json ()).then (data => {
    let e = container.getElement ();

    e.html (`
<fieldset class="form">
<legend>Settings</legend>
<table>
<tr>
<td>Title</td>
<td><input id="titleEditor" value="${model.title}"/></td>
</tr>
<tr>
<td>Language</td>
<td><input id="languageEditor" value="${model.language}"/></td>
</tr>
<tr>
<td>Charset</td>
<td><input id="charsetEditor" value="${model.charset}"/></td>
</tr>
</tr>
</table>
</fieldset>

<p>
  <button>New</button>
  <button>Save</button>
  <button>Run</button>
  <button>View</button>
  <input type="checkbox"/> Auto
</p>

`);



    let ul = jQuery ('<ul class="apps">');
    for (let app of data) {
      let li = jQuery ('<li>');
      let a;

      a = jQuery ('<button>X</button>');
      li.append (a);

      a = jQuery ('<a>').attr ({
        href: `/apps/${app.id}`,
      })
      .text (app.title)
      .click (async function (event) {
        event.preventDefault ();
        let res = await fetch (this.href);
        let app = await res.json ();

        model = app;

        editors.title.value = app.title;
        editors.language.value = app.language;
        editors.charset.value = app.charset;

        let htmlDoc = new CodeMirror.Doc (app.html, 'text/html');
        editors.html.swapDoc (htmlDoc);

        let jsDoc = new CodeMirror.Doc (app.js, 'text/javascript');
        editors.js.swapDoc (jsDoc);

        let cssDoc = new CodeMirror.Doc (app.css, 'text/css');
        editors.css.swapDoc (cssDoc);
      })
      ;
      li.append (a);

      ul.append (li);
    }

    e.append (ul);

    editors.title    = document.querySelector ('#titleEditor');
    editors.language = document.querySelector ('#languageEditor');
    editors.charset  = document.querySelector ('#charsetEditor');
  });

});

CodeMirror.commands.save = function (cm) {
  let preview = document.querySelector ('#previewFrame');
  let doc = preview.contentWindow.document;

  model.title = editors.title.value;
  model.language = editors.language.value;
  model.charset = editors.charset.value;
  model.html = editors.html.getValue ();
  model.js = editors.js.getValue ();
  model.css = editors.css.getValue ();

  if (model.id) {
    fetch (`/apps/${model.id}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        app: model
      })
    }).then (res => {
      if (res.ok) {
        res.json ().then (app => {
          model = app;
        })
      }
    });
  } else {
    fetch ('/apps', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        app: model
      })
    }).then (res => {
      if (res.ok) {
        res.json ().then (app => {
          model = app;
        })
      }
    });
  }

  let tpl = `
<!DOCTYPE html>
<html lang="${model.language}">
<head>
<meta charset="${model.charset}"/>
<title>${model.title}</title>
<style>
${model.css}
</style>
</head>
<body>
${model.html}
<script type="module">
${model.js}
</script>
</body>
</html>
`;

  doc.open ();
  try {
    doc.write (tpl);
  } catch (error) {
    doc.write (errors.stack);
  }
  doc.close ();
};

Object.assign (CodeMirror.defaults, {
  autoCloseBrackets: true,
  autoCloseTags: true,
  autoRefresh: true,
  highlightSelectionMatches: true,
  matchBrackets: true,
  matchTags: true,
  scrollbarStyle: "overlay",

  addModeClass: true,
  keyMap: "sublime",
  lineNumbers: true,
  tabSize: 2,
  theme: "monokai", // "wk",
  showCursorWhenSelecting: true,
  showTrailingSpace: true,
  // lineWrapping: true,
  foldGutter: true,
  // fullScreen: true,
  viewportMargin: Infinity,
  gutters: [
    "CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"
  ],
  rulers: [
    { color: "#808080", column: 80 }
  ],
  extraKeys: {
    Tab: function (cm) {
      if (cm.somethingSelected ()) {
        cm.indentSelection ("add");
      } else {
        var replace = cm.options.indentWithTabs ?
          "\t" : Array (cm.options.tabSize + 1).join (" ");
        cm.replaceSelection (replace, "end", "+input");
      }
    },
    F11: function (cm) {
      cm.setOption ("fullScreen", !cm.getOption ("fullScreen"));
    },
    "Ctrl-Space": "autocomplete",
    hintOptions: {
      hint: CodeMirror.hint.anyword
    },
    "Shift-Alt-Up": "addCursorToPrevLine",
    "Shift-Alt-Down": "addCursorToNextLine"
  }
});

myLayout.init ();

















})
