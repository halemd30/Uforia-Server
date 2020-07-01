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
