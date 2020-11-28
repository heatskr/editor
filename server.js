require ('dotenv').config ();

const crypto = require ('crypto');
const express = require ("express");
const ExpressSession = require ('express-session');
const FileStore = require ('session-file-store') (ExpressSession);
const Sequelize = require ('sequelize');
const Pug = require ('pug');
const hljs = require ('highlight.js');
const MarkdownIt = require ('markdown-it') ({
  html: false,
  xhtmlOut: true,
  breaks: false,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage (lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight (lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + MarkdownIt.utils.escapeHtml(str) + '</code></pre>';
  }
})
.use (require ('markdown-it-deflist'))
.use (require ('markdown-it-footnote'))
;
const CoffeeScript = require ('coffeescript');
const Stylus = require ('stylus');

const { STRING, TEXT, INTEGER, DECIMAL, DATE } = Sequelize.DataTypes;

const db = new Sequelize (process.env.DATABASE_URL, {
  define: {
    underscored: 'all'
  }
});

class User extends Sequelize.Model
{
  static sha1 (text) {
    return crypto.createHmac ('sha1', process.env.SECRET)
      .update (text).digest ('hex');
  }
};

class App extends Sequelize.Model
{

  get scriptURL () {
    return `/apps/${this.id}.js`;
  }

  get styleURL () {
    return `/apps/${this.id}.css`;
  }

  get styleTag () {
    if (this.isNewRecord) {
      return `<style type="${this.cssType}">${this.compileCSS ()}</style>`;
    }
    return `<link type="${this.cssType}" rel="stylesheet" href="${this.styleURL}"/>`;
  }

  get scriptTag () {
    if (this.isNewRecord) {
      return `<script type="${this.jsType}">${this.compileJS ()}</script>`;
    }
    return `<script type="${this.jsType}" src="${this.scriptURL}"></script>`;
  }

  get styleTags () {
    return this.links.trim ()
      .split (/\s+/)
      .filter ((l) => l)
      .map ((l) => `<link rel="stylesheet" type="text/css" href="${l}"/>`)
      .concat (this.styleTag)
      .join ('');
  }

  get scriptTags () {
    return this.scripts.trim ()
      .split (/\s+/)
      .filter ((s) => s)
      .map ((s) => `<script type="text/javascript" src="${s}">${'<'}/script>`)
      .concat (this.scriptTag)
      .join ('');
  }

  compileCSS () {
    let content = this.css;
    switch (this.cssMode) {
      case 'text/x-styl' :
        try {
          content = Stylus.render (content);
        } catch (error) {
          content = `/* ${error.stack} */`;
        }
        break;
    }
    return content;
  }

  compileJS () {
    let content = this.js;
    switch (this.jsMode) {
      case 'text/coffeescript' :
        try {
          content = CoffeeScript.compile (content);
        } catch (error) {
          content = `console.error (${JSON.stringify (error.stack)})`;
        }
        break;
    }
    return content;
  }

  compileHTML () {
    let content = this.html;
    try {
      switch (this.htmlMode) {
        case 'text/x-pug' :
          content = Pug.render (content);
          break;
        case 'text/markdown' :
          content = MarkdownIt.render (content);
          content = `<article class="markdown-body">${content}</article>`;
          break;
      }
    } catch (error) {
      content = `<pre>${error.stack}</pre>`;
    }
    return content;
  }

  render () {
    return `<!DOCTYPE html>
    <html lang="${this.language}">
    <head>
      <meta charset="${this.charset}"/>
      <title>${this.title}</title>
      <meta name="author" content="${this.author}"/>
      <meta name="description" content="${this.description}"/>
      <meta name="keywords" content="${this.keywords}"/>
      <meta name="viewport" content="${this.viewport}"/>
      ${this.styleTags}
    </head>
    <body class="${this.bodyClass}">
      ${this.compileHTML ()}
      ${this.scriptTags}
    </body>
    </html>`;
  }

  get author () {
    if (this.User) {
      return `${this.User.firstName} ${this.User.lastName}`;
    }
    return '';
  }
};

User.init ({
  'username': {
    type: STRING,
    allowNull: false,
    unique: true
  },
  'password': {
    type: STRING,
    allowNull: false
  },
  'email': {
    type: STRING,
    allowNull: false,
    unique: true
  },
  'firstName': {
    type: STRING,
    allowNull: false
  },
  'lastName': {
    type: STRING,
    allowNull: false
  },
}, {
  sequelize: db
});

App.init ({
  'name': {
    type: STRING,
    allowNull: false,
    unique: true
  },
  'title': {
    type: STRING,
    allowNull: false,
  },
  'description': {
    type: TEXT,
    allowNull: false,
    defaultValue: '',
  },
  'keywords': {
    type: TEXT,
    allowNull: false,
    defaultValue: '',
  },
  'language': {
    type: STRING,
    allowNull: false,
    defaultValue: 'en',
  },
  'charset': {
    type: STRING,
    allowNull: false,
    defaultValue: 'UFT-8',
  },
  'viewport': {
    type: STRING,
    allowNull: false,
    defaultValue: '',
  },
  'bodyClass': {
    type: STRING,
    allowNull: false,
    defaultValue: '',
  },
  'html': {
    type: STRING,
    allowNull: true,
  },
  'htmlMode': {
    type: STRING,
    allowNull: false,
    defaultValue: 'text/html',
  },
  'js': {
    type: STRING,
    allowNull: true,
  },
  'jsMode': {
    type: STRING,
    allowNull: false,
    defaultValue: 'text/javascript',
  },
  'jsType': {
    type: STRING,
    allowNull: false,
    defaultValue: 'text/javascript',
  },
  'css': {
    type: STRING,
    allowNull: true,
  },
  'cssMode': {
    type: STRING,
    allowNull: false,
    defaultValue: 'text/css',
  },
  'cssType': {
    type: STRING,
    allowNull: false,
    defaultValue: 'text/css',
  },
  'links': {
    type: TEXT,
    allowNull: false,
    defaultValue: '',
  },
  'scripts': {
    type: TEXT,
    allowNull: false,
    defaultValue: '',
  },
}, {
  sequelize: db
});

App.belongsTo (User);

let app = express ()

.set ('view engine', 'pug')
// .set ('trust proxy', 1)

.use (ExpressSession ({
  store: new FileStore ({}),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}))

.use (express.json ())
.use (express.static ('public'))
.use (express.static ('node_modules'))


.use (/\/(apps|editor).{0,}/, async function (req, res, next) {
  if (req.session.user) {
    next ();
    return;
  }
  res.redirect ('/login');
})

.get ('/', async function (req, res, next) {
  if (req.session.user) {
    res.redirect ('/editor');
    return;
  }
  res.redirect ('/login');
})

.get ('/login', async function (req, res, next) {
  res.render ('login');
})

.post ('/login', async function (req, res, next) {
  let user = await User.findOne ({
    where: {
      [Sequelize.Op.or]: {
        email: req.body.email,
        username: req.body.email
      },
      password: User.sha1 (req.body.password)
    }
  });

  if (user == null) {
    res.status (422).json ({ status: 1 });
    return;
  }

  req.session.user = user;

  res.json ({ status: 0 });
})

.delete ('/login', async function (req, res, next) {
  delete req.session.user;
  res.json ({ status: 0 });
})

.get ('/editor', async function (req, res, next) {
  res.render ('editor');
})

.get ('/apps', async function (req, res, next) {
  let apps = await App.findAll ({
    where: {
      UserId: req.session.user.id
    }
  });
  res.json (apps);
})

.post ('/apps', async function (req, res, next) {
  let app = App.build (req.body.app);
  app.UserId = req.session.user.id;
  try {
    await app.save ();
    res.json (app);
  } catch (error) {
    res.status (422).json (error);
  }
})

.post ('/apps/preview', async function (req, res, next) {
  let app = App.build (req.body.app);
  res.end (app.render ());
})

.get ('/apps/export', async function (req, res, next) {
  let apps = await App.findAll ({
    where: {
      UserId: req.session.user.id
    }
  });
  res.json (apps);
})

.post ('/apps/import', async function (req, res, next) {
  let logs = [];
  for (let value of req.body) {
    let app = App.build (value);
    app.id = null;
    app.UserId = req.session.user.id;
    try {
      await app.save ();
      logs.push (`Created ${app.name}`);
    } catch (error) {
      logs.push (`${app.name}: ${error}`);
    }
  }
  res.json (logs);
})

.get ('/apps/:id.html', async function (req, res, next) {
  let app = await App.findOne ({
    attributes: [
      'id',
      'language',
      'charset',
      'viewport',
      'bodyClass',
      'title',
      'description',
      'keywords',
      'html',
      'htmlMode',
      'jsType',
      'cssType',
      'links',
      'scripts',
    ],
    where: {
      id: req.params.id,
      UserId: req.session.user.id,
    },
    include: [
      {
        association: 'User',
        attributes: ['firstName', 'lastName']
      }
    ],
  });
  if (app == null) {
    req.sendStatus (404);
    return;
  }
  res.end (app.render ());
})

.get ('/apps/:id.css', async function (req, res, next) {
  let app = await App.findOne ({
    attributes: ['css', 'cssMode'],
    where: {
      id: req.params.id,
      UserId: req.session.user.id,
    }
  });
  if (app == null) {
    req.sendStatus (404);
    return;
  }
  res.type ('text/css').end (app.compileCSS ());
})

.get ('/:user/:name.css', async function (req, res, next) {
  let app = await App.findOne ({
    attributes: ['css', 'cssMode'],
    where: {
      name: req.params.name,
      // UserId: req.session.user.id,
    }
  });
  if (app == null) {
    req.sendStatus (404);
    return;
  }
  res.type ('text/css').end (app.compileCSS ());
})

.get ('/apps/:id.js', async function (req, res, next) {
  let app = await App.findOne ({
    attributes: ['js', 'jsMode'],
    where: {
      id: req.params.id,
      UserId: req.session.user.id,
    }
  });
  if (app == null) {
    req.sendStatus (404);
    return;
  }
  res.type ('text/javascript').end (app.compileJS ());
})

.get ('/:user/:name.js', async function (req, res, next) {
  let app = await App.findOne ({
    attributes: ['js', 'jsMode'],
    where: {
      name: req.params.name,
      // UserId: req.session.user.id,
    }
  });
  if (app == null) {
    res.sendStatus (404);
    return;
  }
  res.type ('text/javascript').end (app.compileJS ());
})


.get ('/apps/:id', async function (req, res, next) {
  let app = await App.findOne ({
    where: {
      id: req.params.id,
      UserId: req.session.user.id,
    }
  });
  if (app == null) {
    res.sendStatus (404);
    return;
  }
  res.json (app);
})

.post ('/apps/:id', async function (req, res, next) {
  let app = await App.findOne ({
    where: {
      id: req.params.id,
      UserId: req.session.user.id,
    }
  });
  if (app == null) {
    res.sendStatus (404);
    return;
  }
  app.set (req.body.app);
  app.UserId = req.session.user.id;
  try {
    app.compileHTML ();
    app.compileJS ();
    app.compileCSS ();
    await app.save ();
    res.json (app);
  } catch (error) {
    res.status (422).end (error.toString ());
  }
})

.delete ('/apps/:id', async function (req, res, next) {
  let app = await App.findOne ({
    where: {
      id: req.params.id,
      UserId: req.session.user.id,
    }
  });
  if (app == null) {
    req.sendStatus (404);
    return;
  }
  await app.destroy ();
  res.json (app);
})

;

db.sync ({ force: false }).then (async function () {

  let su = await User.findByPk (1);
  if (su == null) {
    await User.create ({
      username: 'admin',
      email: 'admin@example.com',
      password: User.sha1 ('admin'),
      firstName: 'System',
      lastName: 'Administrator',
    });
  }

  app.listen (process.env.PORT || 5000);
});
