const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
    try {
        mongoose.connect('mongodb+srv://wellington:Wl@02062017@trident-db.8vqxp.mongodb.net/trident-db?retryWrites=true&w=majority', {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true });
            console.log('Conecting databese sucessful');
    } catch (err) {
        console.log('Conecting database error. '+err);
    };  

module.exports = mongoose;


