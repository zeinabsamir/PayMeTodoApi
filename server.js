const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const db = require('./queries')
app.set('port', (process.env.PORT || 3000));

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/users', db.getUsers);

app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}`));