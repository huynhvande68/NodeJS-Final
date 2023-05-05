require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});



const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {console.log('http://localhost:'+ PORT)})

