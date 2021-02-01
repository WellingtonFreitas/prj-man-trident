const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

    try {
        mongoose.connect('mongodb://localhost/project_managementeDB', { useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true });
        console.log('Conecting databese sucessful');
    } catch (err) {
        console.log('Conecting database error. '+err);
    };  

module.exports = mongoose;


