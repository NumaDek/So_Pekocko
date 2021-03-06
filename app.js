const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/apiRoutes');
const userRoute = require('./routes/userRoutes');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const app = express();
const path = require('path');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb+srv://so_pekocko_rw:atg6Ll0CAec859vp@cluster0.b29hq.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connection to MongoDB succeeded.'))
    .catch(() => console.log('Connection to MongoDB failled.'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());
app.use(mongoSanitize());
app.use(bodyParser.json());

app.use('/api/auth', userRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', apiRoutes);


module.exports = app;
