const mongoose = require('../../database');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    //task pertence  um project entao referencio assim
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required: true
    },
    assingedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;

