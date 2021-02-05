const mongoose = require('../../database');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Task = require("../models/task");


const ProjectSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Task'
    }],
});


const Projrct = mongoose.model('Project', ProjectSchema);

module.exports = Projrct;