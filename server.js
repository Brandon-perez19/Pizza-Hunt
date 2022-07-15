const express = require('express');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const uri = process.env.MONGOB_URI 

mongoose.connect(`mongodb://localhost:27017/pizza-hunt`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//use this to log mongo queries being excuted
mongoose.set('debug', true);

app.use(require('./routes'));

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
