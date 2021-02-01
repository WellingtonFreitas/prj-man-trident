const nodemailler = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');


const {host, port, user, pass} = require('../config/mail');
const transport = nodemailler.createTransport({
    host,
    port,
    auth: {user,pass}
});

transport.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: './src/resources/mail/',
        layoutsDir: './src/resources/mail/',
        defaultLayout: '',
      },
    viewPath: './src/resources/mail/',
    extName: '.html',
    defaultLayout: null
}));

module.exports = transport;