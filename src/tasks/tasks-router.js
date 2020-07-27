const express = require("express");
const path = require("path");
const TasksService = require("./tasks-service");
const { requireAuth } = require("../middleware/jwt-auth");
//const db = req.app.get("db");

const tasksRouter = express.Router();

tasksRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    TasksService.getAllTasks(knexInstance)
      .then((tasks) => {
        res.json(tasks.map(TasksService.serializeTask));
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const { name, start_time, duration, category } = req.body;
    const newTask = {
      user_id: req.user.id,
      name,
      start_time,
      duration,
      category,
    };

    for (const [key, value] of Object.entries(newTask))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    TasksService.insertTask(req.app.get("db"), newTask)
      .then((task) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${task.id}`))
          .json(TasksService.serializeTask(task));
      })
      .catch(next);
  });

tasksRouter.route("/:userId").get((req, res) => {
  const id = req.params.userId;
  TasksService.getByUserId(req.app.get("db"), id).then((userTasks) => {
    res.json(userTasks.map(TasksService.serializeTask));
  });
});

tasksRouter
  .route("/:taskId")
  .delete((req, res, next) => {
    const id = parseInt(req.params.taskId);
    TasksService.deleteTask(req.app.get("db"), id)
      .then(res.status(204).end())
      .catch(next);
  })
  .patch((req, res, next) => {
    const id = parseInt(req.params.taskId);
    // const date = new Date();
    // const dateFormat = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    TasksService.updateStartTask(req.app.get("db"), id, {
      start_date: new Date(),
    })
      .then(res.status(204).end())
      .catch(next);
  });

tasksRouter.route("/end/:taskId").patch((req, res) => {
  const id = req.params.taskId;
  TasksService.updateEndTask(req.app.get("db"), id, {
    end_date: new Date(),
  }).then(res.status(204).end());
});

tasksRouter.route("/:taskId/modify").patch((req, res) => {
  //req.query.streak - modify?streak=5
  //req.params.
  // post
  const id = req.params.taskId;
  TasksService.findTaskAndReturn(req.app.get("db"), id).then(([task]) => {
    TasksService.updateStreak(req.app.get("db"), id, {
      streak: task.streak + 1,
    }).then(res.status(204).end());
  });
});

tasksRouter.route("/reset/:taskId").patch((req, res) => {
  const id = req.params.taskId;
  TasksService.updateResetTask(req.app.get("db"), id, {
    streak: 0,
    start_date: null,
  }).then(res.status(204).end());
});

module.exports = tasksRouter;
