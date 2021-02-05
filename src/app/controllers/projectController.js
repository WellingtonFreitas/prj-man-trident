const express = require('express');
const bodyParser = require('body-parser');

const authMiddleware = require('../middleware/auth');
const Project = require('../models/project');
const Task = require('../models/task');
const Projrct = require('../models/project');


const router = express();

router.use(authMiddleware);

router.get('/', bodyParser.json(), async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);
        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: "Error loading projects - " + err });
    }
});

router.get("/:projectId", bodyParser.json(), async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(["user", "tasks"]);
        if (!project)
            return res.status(404).send({ error: "Project not found." });
        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: "Error loading project - " + err });
    };
});

router.post('/', bodyParser.json(), async (req, res) => {
    try {
        const { title, description, tasks } = req.body;
        // ID vem no token pelo middleware
        // percorrendo as task para depois atribuir no projeto
        const project = await Project.create({ title, description, user: req.userId });

        if (tasks != undefined) {
            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id, assingedTo: req.userId });

                await projectTask.save();

                project.tasks.push(projectTask);
            }));
        }

        await project.save();

        return res.send({ project });


    } catch (err) {
        return res.status(400).send({ error: "Error creating new project - " + err });
    }
});

router.put("/:projectId", bodyParser.json(), async (req, res) => {
    try {
        const { title, description, tasks } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.projectId, { title, description }, { new: true });
        // new: true para retornar o valor atualizado
        //como estou recebendo todas as task novamente para criar mesmo atualizando primeiro deleto //antes de criar novamente
        if (project) {
            project.tasks = [];
            await Task.deleteOne({ project: project._id });

            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id });
                // await projectTask.save();

                await project.tasks.push(projectTask);

            }));
            await project.save();
            return res.send({ project });
        }
        else {
            return res.status(404).send({ error: "Project not found." });
        }
    } catch (err) {
        return res.status(400).send({ error: "Error updating project - " + err });
    };
});



router.delete('/:projectId', bodyParser.json(), async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);
        return res.send();
    } catch (err) {
        return res.status(400).send({ error: "Error delete project- " + err });
    };
});

module.exports = app => app.use('/projects', router);