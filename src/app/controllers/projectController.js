const express = require('express');
const bodyParser = require('body-parser');

const authMiddleware = require('../middleware/auth');
const Project = require('../models/project');
const Task = require('../models/task');
const Projrct = require('../models/project');


const router = express();

router.use(authMiddleware);

router.get('/', bodyParser.json() ,async (req, res) => {
    try {
        const projects = await Projrct.find().populate(['user', 'task']);
        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({error: "Error loading projects - " + err});
    }
});

router.post('/', bodyParser.json() ,async (req, res) => {
    try {
        const { title, description} = req.body;
        console.log(" O req body title é: " + title);
        const { tasks } = req.body.tasks;
        console.log(" O req body tasks é: " + tasks);
        const project = await Project.create({ title, description, user:req.userId});

        await Promise.all(tasks.map( async task => { 
            const projectTask = new Task({... task, project: project._id});

            await projectTask.save();

            project.tasks.push(projectTask);
    
            console.log("Salvou e enviou a task");
        }));

        await project.save();

        return res.send({ project });

        
    } catch (err) {
        return res.status(400).send({error: "Error creating new project - " + err });
    }
});

module.exports = app => app.use('/projects', router);