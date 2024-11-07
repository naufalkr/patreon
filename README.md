# patreon-vue

## Project setup
SERVER SIDE

go to /server and then do these

run to install all the dependencies

```
npm i
```

create .env according to the .env.example files and your database settings, as of now we are using postgrest

run the server.js

```
node server.js
```

CLIENT SIDE
go to /client and then do these

Create .env.development.local for development then .env.production.local for production ready app.
Then put in your api URL

```
VUE_APP_URL=http://localhost:3001
```

### Install packages

```
npm install
```

### Compiles for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

