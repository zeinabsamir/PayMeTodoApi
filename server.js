const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


const users = require('./routes/users');

app.set('port', (process.env.PORT || 3000));

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/users', users);

app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}`));