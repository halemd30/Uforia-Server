const { reset } = require("nodemon");

const TasksService = {
  getAllTasks(db) {
    return db.select("*").from("tasks");
  },
  insertTask(db, newTask) {
    return db
      .insert(newTask)
      .into("tasks")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db.select("*").from("tasks").where({ id }).first();
  },
  getByUserId(db, user_id) {
    return db.select("*").from("tasks").where({ user_id });
  },
  deleteTask(db, id) {
    return db.from("tasks").where({ id }).delete();
  },
  updateStartTask(db, id, startTask) {
    return db.from("tasks").where({ id }).update(startTask);
  },
  updateEndTask(db, id, endTask) {
    return db.from("tasks").where({ id }).update(endTask);
  },
  updateStreak(db, id, streak) {
    return db.from("tasks").where({ id }).update(streak);
  },
  findTaskAndReturn(db, id) {
    return db.select("*").from("tasks").where({ id });
  },
  updateResetTask(db, id, reset) {
    return db.from("tasks").where({ id }).update(reset);
  },
  serializeTask(task) {
    return {
      id: task.id,
      user_id: task.user_id,
      name: task.name,
      start_time: task.start_time,
      duration: task.duration,
      category: task.category,
      streak: task.streak,
      start_date: task.start_date,
      end_date: task.end_date,
    };
  },
};

module.exports = TasksService;
