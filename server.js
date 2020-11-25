const express = require ("express");
const Sequelize = require ('sequelize');
const Pug = require ('pug');
const CoffeeScript = require ('coffeescript');
const Stylus = require ('stylus');

const { STRING, INTEGER, DECIMAL, DATE } = Sequelize.DataTypes;

const db = new Sequelize ('sqlite://data.sqlite3', {
  define: {
    underscored: 'all'
  }
});

class App extends Sequelize.Model
{

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
    switch (this.htmlMode) {
      case 'text/x-pug' :
        try {
          content = Pug.render (content);
        } catch (error) {
          content = `<pre>${error.stack}</pre>`;
        }
        break;
    }
    return content;
  }

};

App.init ({
  'name': {
    type: STRING,
    allowNull: false,
    unique: true
  },
  'title': {
    type: STRING,
    allowNull: true,
  },
  'language': {
    type: STRING,
    allowNull: true,
  },
  'charset': {
    type: STRING,
    allowNull: true,
  },
  'html': {
    type: STRING,
    allowNull: true,
  },
  'htmlMode': {
    type: STRING,
    allowNull: true,
  },
  'js': {
    type: STRING,
    allowNull: true,
  },
  'jsMode': {
    type: STRING,
    allowNull: true,
  },
  'css': {
    type: STRING,
    allowNull: true,
  },
  'cssMode': {
    type: STRING,
    allowNull: true,
  },
}, {
  sequelize: db
});

let app = express ()

.set ('view engine', 'pug')

.use (express.json ())
.use (express.static ('public'))
.use (express.static ('node_modules'))

.get ('/apps', async function (req, res, next) {
  let apps = await App.findAll ();
  res.json (apps);
})

.post ('/apps', async function (req, res, next) {
  try {
    let app = await App.create (req.body.app);
    res.json (app);
  } catch (error) {
    res.status (422).json (error);
  }
})

.get ('/apps/:id.html', async function (req, res, next) {
  let id = req.params.id;
  let app = await App.findOne ({
    attributes: [
      'language',
      'charset',
      'title',
      'html',
      'htmlMode',
    ],
    where: {
      id,
      // UserId: req.session.user.id,
    }
  });
  res.render ('app', { app, id, content: app.compileHTML() });
})

.get ('/apps/:id.css', async function (req, res, next) {
  let app = await App.findOne ({
    attributes: ['css', 'cssMode'],
    where: {
      id: req.params.id,
      // UserId: req.session.user.id,
    }
  });
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
  res.type ('text/css').end (app.compileCSS ());
})

.get ('/apps/:id.js', async function (req, res, next) {
  let app = await App.findOne ({
    attributes: ['js', 'jsMode'],
    where: {
      id: req.params.id,
      // UserId: req.session.user.id,
    }
  });
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
      // UserId: req.session.user.id,
    }
  });
  res.json (app);
})

.post ('/apps/:id', async function (req, res, next) {
  let app = await App.findOne ({
    where: {
      id: req.params.id,
      // UserId: req.session.user.id,
    }
  });
  try {
    app.compileHTML ();
    app.compileJS ();
    app.compileCSS ();
    await app.update (req.body.app);
    res.json (app);
  } catch (error) {
    res.status (422).end (error.toString ());
  }
})

.delete ('/apps/:id', async function (req, res, next) {
  let app = await App.findOne ({
    where: {
      id: req.params.id,
      // UserId: req.session.user.id,
    }
  });
  await app.destroy ();
  res.json (app);
})

;

db.sync ().then (() => {
  app.listen (process.env.PORT || 5000);
});
