# Just Edit

Simple playground for web content. (WIP)

* Node.js v12.4.0

Install

Create a .env file with settings using uuid utility or
just provide your own keys. Then run npm package installer.

```sh
echo SECRET=$(uuid) > .env
echo SESSION_SECRET=$(uuid) >> .env
echo DATABASE_URL=sqlite://database.sqlite3 >> .env

# Alternative database could be postgre, mysql, etc.
# echo DATABASE_URL=postgresql://user:pass@host:5432/dbname

npm install
```

Start

```sh
# PORT=5000 npm start
npm start
```

Development
```
node dev
```

