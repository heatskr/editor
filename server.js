const express = require ("express");
const Sequelize = require ('sequelize');

const { STRING, INTEGER, DECIMAL, DATE } = Sequelize.DataTypes;

let app = express ()

.set ('view engine', 'pug')

.use (express.json ())
.use (express.static ('public'))
.use (express.static ('node_modules'))

.get ('/apps', async function (req, res, next) {
  let apps = await db.models.App.findAll ();
  res.json (apps);
})

.post ('/apps', async function (req, res, next) {
  let app = await db.models.App.create (req.body.app);
  res.json (app);
})

.get ('/apps/:id', async function (req, res, next) {
  let app = await db.models.App.findOne ({
    where: {
      id: req.params.id,
      // UserId: req.session.user.id,
    }
  });
  res.json (app);
})

.post ('/apps/:id', async function (req, res, next) {
  let app = await db.models.App.findOne ({
    where: {
      id: req.params.id,
      // UserId: req.session.user.id,
    }
  });
  await app.update (req.body.app);
  res.json (app);
})

;

const db = new Sequelize ('sqlite://data.sqlite3', {
  define: {
    underscored: 'all'
  }
});

class App extends Sequelize.Model
{

};

App.init ({
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
  'js': {
    type: STRING,
    allowNull: true,
  },
  'css': {
    type: STRING,
    allowNull: true,
  },
}, {
  sequelize: db
});

db.sync ().then (() => {
  app.listen (process.env.PORT || 5000);
});
