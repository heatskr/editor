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
  'codemirror/mode/pug/pug',
  'codemirror/mode/stylus/stylus',
  'codemirror/mode/coffeescript/coffeescript',


  // keymap
  "codemirror/keymap/sublime",

  // css

  'css!/material-design-icons/iconfont/material-icons.css',

  'css!/golden-layout/src/css/goldenlayout-base.css',
  'css!/golden-layout/src/css/goldenlayout-dark-theme.css',
  // 'css!/golden-layout/src/css/goldenlayout-light-theme.css',
  // 'css!/golden-layout/src/css/goldenlayout-soda-theme.css',
  // 'css!/golden-layout/src/css/goldenlayout-translucent-theme.css',

  'css!/codemirror/lib/codemirror.css',
  'css!/codemirror/addon/dialog/dialog.css',
  'css!/codemirror/addon/display/fullscreen.css',
  'css!/codemirror/addon/fold/foldgutter.css',
  'css!/codemirror/addon/hint/show-hint.css',
  'css!/codemirror/addon/lint/lint.css',
  'css!/codemirror/addon/merge/merge.css',
  'css!/codemirror/addon/scroll/simplescrollbars.css',
  'css!/codemirror/addon/search/matchesonscrollbar.css',
  'css!/codemirror/addon/tern/tern.css',

  'css!/codemirror/theme/monokai.css',

  'css!/client.css',
], function (jQuery, GoldenLayout, CodeMirror) {

let modes = {
  html: [
    { name: 'HTML', type: 'text/html' },
    { name: 'Pug', type: 'text/x-pug' },
  ],
  js: [
    { name: 'JavaScript', type: 'text/javascript' },
    { name: 'CoffeeScript', type: 'text/coffeescript' },
  ],
  css: [
    { name: 'CSS', type: 'text/css' },
    { name: 'Stylus', type: 'text/x-styl' },
  ],
};

function newModel () {
  let dt = Date.now ();
  return {
    id: null,
    name: `app-${dt}`,
    title: `App ${dt}`,
    description: '',
    keywords: '',
    language: 'en',
    charset: 'UTF-8',
    viewport: '',
    bodyClass: '',
    html: `// ${dt}\n`,
    js: `# ${dt}\n`,
    css: `// ${dt}\n`,
    htmlMode: 'text/x-pug',
    jsMode: 'text/coffeescript',
    jsType: 'text/javascript',
    cssMode: 'text/x-styl',
    cssType: 'text/css',
    scripts: '',
    links: '',
  };
}

let model = newModel ();

function refreshApps () {
  fetch ('/apps').then (res => res.json ()).then (data => {
    let ul = jQuery ('.apps');
    ul.html (null);
    for (let app of data) {
      let href = `/apps/${app.id}`;
      let li = jQuery ('<li>');
      let a;

      let act = jQuery (`<div class="act"></div>`);
      li.append (act);

      a = jQuery (`<a href="${href}"><span class="material-icons">pageview</span></a>`)
      .click (function (event) {
        event.preventDefault ();
        open (`${this.href}.html`);
      });
      act.append (a);

      a = jQuery (`<a href="${href}"><span class="material-icons">delete</span></a>`)
      .click (async function (event) {
        event.preventDefault ();
        if (!confirm ()) {
          return;
        }
        let res = await fetch (this.href, {
          method: 'delete',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        if (res.ok) {
          let app = await res.json ();
          if (app.id == model.id) {
            newPage ();
          }
          refreshApps ();
        }
      });
      act.append (a);

      a = jQuery ('<a>')
      .attr ({ href })
      .text (app.title)
      .click (async function (event) {
        event.preventDefault ();
        let res = await fetch (this.href);
        model = await res.json ();
        loadPage ();
        previewPage ();
      })
      ;
      li.append (a);

      ul.append (li);
    }

    editors.name        = document.querySelector ('#nameEditor');
    editors.title       = document.querySelector ('#titleEditor');
    editors.description = document.querySelector ('#descriptionEditor');
    editors.keywords    = document.querySelector ('#keywordsEditor');
    editors.language    = document.querySelector ('#languageEditor');
    editors.charset     = document.querySelector ('#charsetEditor');
    editors.viewport    = document.querySelector ('#viewportEditor');
    editors.bodyClass   = document.querySelector ('#bodyClassEditor');
    editors.htmlMode    = document.querySelector ('#htmlModeEditor');
    editors.jsMode      = document.querySelector ('#jsModeEditor');
    editors.cssMode     = document.querySelector ('#cssModeEditor');
    editors.jsType      = document.querySelector ('#jsTypeEditor');
    editors.cssType     = document.querySelector ('#cssTypeEditor');
    editors.links       = document.querySelector ('#linksEditor');
    editors.scripts     = document.querySelector ('#scriptsEditor');

    editors.htmlMode.addEventListener ('change', (event) => {
      editors.html.setOption ('mode', editors.htmlMode.value);
    });

    editors.jsMode.addEventListener ('change', (event) => {
      editors.js.setOption ('mode', editors.jsMode.value);
    });

    editors.cssMode.addEventListener ('change', (event) => {
      editors.css.setOption ('mode', editors.cssMode.value);
    });
  });
};

let defaultConfig = {
  settings: {
    showPopoutIcon:false,
  },
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'column',
          width: 20,
          content: [
            {
              title: 'Settings',
              isClosable: false,
              type: 'component',
              componentName: 'settingsComponent',
              componentState: {
                label: 'A',
              },
            },
            {
              title: 'Library',
              isClosable: false,
              type: 'component',
              componentName: 'libraryComponent',
              componentState: {
                label: 'A',
              },
            },
          ]
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
                  title: 'Markup',
                  isClosable: false,
                },
                {
                  type: 'component',
                  componentName: 'jsComponent',
                  componentState: { label: 'C' },
                  title: 'Script',
                  isClosable: false,
                },
                {
                  type: 'component',
                  componentName: 'cssComponent',
                  componentState: { label: 'D' },
                  title: 'Style',
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

let config;

if (sessionStorage.layout) {
  config = JSON.parse (sessionStorage.layout);
} else {
  config = Object.assign ({}, defaultConfig);
}

addEventListener ('beforeunload', function () {
  sessionStorage.layout = JSON.stringify (myLayout.toConfig ());
});

window.myLayout = new GoldenLayout( config );

var editors = {};

myLayout.registerComponent ('htmlComponent', function (container, componentState) {
  container.getElement ().html ('<div class="editor-handler"><textarea id="htmlEditor"></textarea></div>');

  requestAnimationFrame (() => {
    editors.html = CodeMirror.fromTextArea (document.querySelector ('#htmlEditor'), {
      mode: model.htmlMode,
      value: model.html,
    });
  });

});

myLayout.registerComponent ('jsComponent', function (container, componentState) {
  container.getElement ().html ('<div class="editor-handler"><textarea id="jsEditor"></textarea></div>');

  requestAnimationFrame (() => {
    editors.js = CodeMirror.fromTextArea (document.querySelector ('#jsEditor'), {
      mode: model.jsMode,
      value: model.js,
    });
  });

});

myLayout.registerComponent ('cssComponent', function (container, componentState) {
  container.getElement ().html ('<div class="editor-handler"><textarea id="cssEditor"></textarea></div>');

  requestAnimationFrame (() => {
    editors.css = CodeMirror.fromTextArea (document.querySelector ('#cssEditor'), {
      mode: model.cssMode,
      value: model.css
    });
  });

});


myLayout.registerComponent ('previewComponent', function (container, componentState) {
  container.getElement ().html ('<div id="previewFrame"></div>');
});

myLayout.registerComponent ('libraryComponent', function (container, componentState) {
  container.getElement ().html (`<ul class="apps"></ul>`);
  refreshApps ();
});

myLayout.registerComponent ('settingsComponent', function (container, componentState) {
  container.getElement ().html (`<div class="settings">
<div class="actions">
  <button id="btnRun" title="Run">
    <span class="material-icons">play_arrow</span>
  </button>
  <button id="btnSave" title="save">
    <span class="material-icons">save</span>
  </button>
  <button id="btnView" title="View">
    <span class="material-icons">pageview</span>
  </button>
  <button id="btnNew" title="New">
    <span class="material-icons">note_add</span>
  </button>
  <button id="btnAuto" title="Auto">
    <span class="material-icons">check</span>
  </button>
  <button id="btnLogOut" title="Log out">
    <span class="material-icons">power_settings_new</span>
  </button>
</div>

<div class="forms">
<fieldset class="form">
  <legend>Header</legend>
  <table>
    <tr>
      <td>Name</td>
      <td><input id="nameEditor" value="${model.name}"/></td>
    </tr>
    <tr>
      <td>Title</td>
      <td><input id="titleEditor" value="${model.title}"/></td>
    </tr>
    <tr>
      <td colspan="2">Description</td>
    </tr>
    <tr>
      <td colspan="2">
        <textarea id="descriptionEditor">${model.description}</textarea>
      </td>
    </tr>
    <tr>
      <td colspan="2">Keywords</td>
    </tr>
    <tr>
      <td colspan="2">
        <textarea id="keywordsEditor">${model.keywords}</textarea>
      </td>
    </tr>
  </table>
</fieldset>

<fieldset class="form">
  <legend>Markup</legend>
  <table>
    <tr>
      <td>Language</td>
      <td><input id="languageEditor" value="${model.language}"/></td>
    </tr>
    <tr>
      <td>Charset</td>
      <td><input id="charsetEditor" value="${model.charset}"/></td>
    </tr>
    <tr>
      <td>Viewport</td>
      <td><input id="viewportEditor" value="${model.viewport}"/></td>
    </tr>
    <tr>
      <td>Body class</td>
      <td><input id="bodyClassEditor" value="${model.bodyClass}"/></td>
    </tr>
    <tr>
      <td>Mode</td>
      <td>
        <select id="htmlModeEditor">
        <option value="text/html">HTML</option>
        <option value="text/x-pug">Pug</option>
        <option value="text/markdown">Markdown</option>
        </select>
      </td>
    </tr>
  </table>
</fieldset>

<fieldset class="form">
  <legend>Script</legend>
  <table>
    <tr>
      <td>Mode</td>
      <td>
        <select id="jsModeEditor">
          <option value="text/javascript">JavaScript</option>
          <option value="text/coffeescript">CoffeeScript</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Type</td>
      <td>
        <select id="jsTypeEditor">
          <option value="text/javascript">Script</option>
          <option value="module">Module</option>
        </select>
      </td>
    </tr>
    <tr>
      <td colspan="2">Imports</td>
    </tr>
    <tr>
      <td colspan="2">
        <textarea id="scriptsEditor">${model.scripts}</textarea>
      </td>
    </tr>
  </table>
</fieldset>

<fieldset class="form">
  <legend>Style</legend>
  <table>
    <tr>
      <td>Mode</td>
      <td>
        <select id="cssModeEditor">
          <option value="text/css">CSS</option>
          <option value="text/x-styl">Stylus</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Type</td>
      <td>
        <select id="cssTypeEditor">
          <option value="text/css">CSS</option>
        </select>
      </td>
    </tr>
    <tr>
      <td colspan="2">Imports</td>
    </tr>
    <tr>
      <td colspan="2">
        <textarea id="linksEditor">${model.links}</textarea>
      </td>
    </tr>
  </table>
</fieldset>
</div>
</div>`);

  requestAnimationFrame (function () {
    jQuery ('#btnRun').click ((event) => {
      previewPage ();
    });

    jQuery ('#btnSave').click ((event) => {
      savePage ();
    });

    jQuery ('#btnView').click ((event) => {
      openPage ();
    });

    jQuery ('#btnNew').click ((event) => {
      newPage ();
    });

    jQuery ('#btnLogOut').click ((event) => {
      fetch ('/login', {
        method: 'delete'
      }).then ((res) => {
        location.href = '/login';
      });
    });
  });

});

async function previewPage () {
  console.clear ();
  loadModel ();

  let res = await fetch ('/apps/preview', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify ({ app: model })
  });
  let text = await res.text ();

  let previewFrame = document.querySelector ('#previewFrame');
  previewFrame.innerHTML = null;
  let frame = document.createElement ('iframe');
  previewFrame.appendChild (frame);
  let doc = frame.contentWindow.document;
  doc.open ();
  doc.write (text);
  doc.close ();
}

function openPage () {
  if (!model.id) {
    return;
  }
  open (`/apps/${model.id}.html`);
}

function loadModel () {
  model.name = editors.name.value;
  model.title = editors.title.value;
  model.description = editors.description.value;
  model.keywords = editors.keywords.value;
  model.language = editors.language.value;
  model.charset = editors.charset.value;
  model.viewport = editors.viewport.value;
  model.bodyClass = editors.bodyClass.value;
  model.html = editors.html.getValue ();
  model.js = editors.js.getValue ();
  model.css = editors.css.getValue ();
  model.htmlMode = editors.htmlMode.value;
  model.jsMode = editors.jsMode.value;
  model.cssMode = editors.cssMode.value;
  model.jsType = editors.jsType.value;
  model.cssType = editors.cssType.value;
  model.links = editors.links.value;
  model.scripts = editors.scripts.value;
}

function savePage () {
  loadModel ();

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
          refreshApps ();
          previewPage ();
        });
      } else {
        switch (res.status) {
          case 422 :
            res.text ().then (error => {
              console.log (error);
            });
            break;
        }
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
          refreshApps ();
          previewPage ();
        })
      }
    });
  }
}

function newPage () {
  model = newModel ();
  loadPage ();
}

function loadPage () {
  editors.name.value = model.name;
  editors.title.value = model.title;
  editors.description.value = model.description;
  editors.keywords.value = model.keywords;
  editors.language.value = model.language;
  editors.charset.value = model.charset;
  editors.viewport.value = model.viewport;
  editors.bodyClass.value = model.bodyClass;
  editors.htmlMode.value = model.htmlMode;
  editors.jsMode.value = model.jsMode;
  editors.cssMode.value = model.cssMode;
  editors.jsType.value = model.jsType;
  editors.cssType.value = model.cssType;
  editors.links.value = model.links;
  editors.scripts.value = model.scripts;

  let htmlDoc = new CodeMirror.Doc (model.html, model.htmlMode);
  editors.html.swapDoc (htmlDoc);

  let jsDoc = new CodeMirror.Doc (model.js, model.jsMode);
  editors.js.swapDoc (jsDoc);

  let cssDoc = new CodeMirror.Doc (model.css, model.cssMode);
  editors.css.swapDoc (cssDoc);
}

CodeMirror.commands.save = function (cm) {
  savePage ();
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
  // fullScreen: true,
  foldGutter: true,
  lineWrapping: false,
  gutters: [
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
    "breakpoints"
  ],
  viewportMargin: Infinity,
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
