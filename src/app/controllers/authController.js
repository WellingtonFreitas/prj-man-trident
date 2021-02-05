const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const mailer = require('../../modules/mailler');

const crypto = require('crypto');
const User = require('../models/user');

const router = express.Router();

function generationToken(params ={}){

	return jwt.sign(params, authConfig.secret, { expiresIn: 86400})
}

router.post('/register', bodyParser.json(),async (req, res) =>{
    try {  
        const { email } = req.body;
        
        if(userExists = await User.findOne({ email: email }).exec()){   
           return res.status(400).send({error : 'User already exists'});
        };

        const user = await User.create(req.body);

        user.password = undefined;

        return  res.send({ 
            user,
            token: generationToken({ id: user.id}),
        });
        
    } catch (err) {
        console.log(err);
        return res.status(400).send({error : 'Registration failed. '+err});
    }
});

router.post('/authenticate', bodyParser.json(), async (req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'User not found. '});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password. '});

    user.password = undefined; 

    return  res.send({ 
        user,
        token: generationToken({ id: user.id}),
    });
});

router.post('/forgot_password', bodyParser.json(), async (req, res) =>{
    const {email} = req.body;
    try {
		const user =  await User.findOne({ email });
		if(!user)
			return res.status(400).send({ error: 'User not found'});
		const token = crypto.randomBytes(20).toString('hex');
 	    const now = new Date();
		now.setHours(now.getHours()+1);
        await User.findByIdAndUpdate(user.id,{
            '$set':{
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });
        mailer.sendMail({
	        to: email,
            from: 'wellington@reset.com.br',
            subject: "Reset password",    
            template: '/auth/forgotPassword',
            context: { token },  
        }, (err) => {
            if(err){          
                console.log(err)     
                return res.status(400).send({error: 'Cannot send forgot password email '+ err});
            }
            return res.send();
        }); 
	} catch (err) {
        console.log(err)
		res.status(400).send({error: 'Error on forgot password, try again '+ err});
    };

});

router.post('/reset_password', bodyParser.json(),async (req, res) => {
	const {email, token, password} = req.body;
    try {
		const user = await User.findOne({email})
			.select('+passwordResetToken passwordResetExpires');
		if(!user)
            return res.status(400).send({ error: 'User not found. ' });
		if(token!== user.passwordResetToken)
            return res.status(400).send({error: 'Token invalid'});
		const now = new Date();
		if( now > user.passwordResetExpire)
			return res.status(400).send({error: 'Token expired, generate a new one.'});
		user.password = password;
		await user.save();
		res.send();

	}catch (err) {
		res.status(400).send({error: 'Cannot reset password, try again'});
	}
});   


module.exports = app => app.use('/auth', router);