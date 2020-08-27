const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('tasks endpoints', () => {
  let db;
  const { testUsers } = helpers.makeTasksFixtures();
  const { testTasks } = helpers.makeTasksFixtures();
  const testUser = testUsers[0];
  const testTask = testTasks[0];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy(db));
  beforeEach('clean the table', () => helpers.cleanTables(db));

  beforeEach('insert users', () => {
    return db.into('users').insert(testUsers);
  });

  context('Given there are tasks in the database', () => {
    beforeEach('insert tasks', () => {
      return db.into('tasks').insert(testTasks);
    });

    it(`GET /api/tasks responds with 200 and all of the tasks for that user`, () => {
      const expectedTask = testTasks.filter((task) => task.user_id === testUser.id);
      console.log(expectedTask);
      return supertest(app)
        .get('/api/tasks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0].user_id).to.eql(expectedTask[0].user_id);
          expect(res.body[0].name).to.eql(expectedTask[0].name);
          expect(res.body[0].start_time).to.eql(expectedTask[0].start_time);
          expect(res.body[0].duration).to.eql(expectedTask[0].duration);
          expect(res.body[0].category).to.eql(expectedTask[0].category);
          expect(res.body[0].streak).to.eql(expectedTask[0].streak);
          expect(res.body[0]).to.have.property('start_date');
          expect(res.body[0]).to.have.property('end_date');
        });
    });

    it(`DELETE /api/tasks/:taskId responds with 204, deletes task`, () => {
      const task_id = 1;
      return supertest(app)
        .delete(`/api/tasks/${task_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(204);
    });

    it(`PATCH /api/tasks/:taskId responds with 204 and updates start_date`, () => {
      const task_id = 1;
      const newDate = {
        start_date: new Date(),
      };
      taskToChange = testTask;

      return supertest(app)
        .patch(`/api/tasks/${task_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newDate)
        .expect(204)
        .then((res) =>
          supertest(app)
            .get(`/api/tasks/${task_id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(res.body)
            .to.have.property('id')
            .expect(res.body.start_date)
            .to.eql(newDate.start_date)
            .expect(res.body.user_id)
            .to.eql(taskToChange.user_id)
            .expect(res.body.name)
            .to.eql(taskToChange.name)
            .expect(res.body.start_time)
            .to.eql(taskToChange.start_time)
            .expect(res.body.category)
            .to.eql(taskToChange.category)
        );
    });

    it(`PATCH /api/tasks/end/:taskId responds with 204 and updates end_date`, () => {
      const task_id = 1;
      const newDate = {
        end_date: new Date(),
      };
      taskToChange = testTask;

      return supertest(app)
        .patch(`/api/tasks/end/${task_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newDate)
        .expect(204)
        .then((res) =>
          supertest(app)
            .get(`/api/tasks/end/${task_id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(res.body)
            .to.have.property('id')
            .expect(res.body.end_date)
            .to.eql(newDate.end_date)
            .expect(res.body.user_id)
            .to.eql(taskToChange.user_id)
            .expect(res.body.name)
            .to.eql(taskToChange.name)
            .expect(res.body.start_time)
            .to.eql(taskToChange.start_time)
            .expect(res.body.category)
            .to.eql(taskToChange.category)
        );
    });

    it(`PATCH /api/tasks/:taskId/modify responds with 204 and updates streak`, () => {
      const task_id = 1;
      const newStreak = {
        streak: 2,
      };
      taskToChange = testTask;

      return supertest(app)
        .patch(`/api/tasks/${task_id}/modify`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newDate)
        .expect(204)
        .then((res) =>
          supertest(app)
            .get(`/api/tasks/end/${task_id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(res.body)
            .to.have.property('id')
            .expect(res.body.streak)
            .to.eql(newStreak.streak)
            .expect(res.body.user_id)
            .to.eql(taskToChange.user_id)
            .expect(res.body.name)
            .to.eql(taskToChange.name)
            .expect(res.body.start_time)
            .to.eql(taskToChange.start_time)
            .expect(res.body.category)
            .to.eql(taskToChange.category)
        );
    });

    it(`PATCH /api/tasks/reset/:taskId responds with 204 and updates streak and start_date`, () => {
      const task_id = 1;
      const updatedStreak = {
        streak: 0,
      };
      const updatedStart = {
        start_date: null,
      };

      taskToChange = testTask;

      return supertest(app)
        .patch(`/api/tasks/${task_id}/modify`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newDate)
        .expect(204)
        .then((res) =>
          supertest(app)
            .get(`/api/tasks/end/${task_id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(res.body)
            .to.have.property('id')
            .expect(res.body.streak)
            .to.eql(updatedStreak.streak)
            .expect(res.body.start_date)
            .to.eql(updatedStart.start_date)
            .expect(res.body.user_id)
            .to.eql(taskToChange.user_id)
            .expect(res.body.name)
            .to.eql(taskToChange.name)
            .expect(res.body.start_time)
            .to.eql(taskToChange.start_time)
            .expect(res.body.category)
            .to.eql(taskToChange.category)
        );
    });
  });

  it(`POST /api/tasks responds with 201 and new task`, () => {
    const newTask = {
      user_id: testUser.id,
      name: 'test task',
      start_time: '1:00pm',
      duration: '3 hours',
      category: 'Exercise',
    };

    return supertest(app)
      .post(`/api/tasks`)
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(newTask)
      .expect(201)
      .expect((res) => {
        expect(res.body).to.have.property('id');
        expect(res.body.user_id).to.eql(newTask.user_id);
        expect(res.body.name).to.eql(newTask.name);
        expect(res.body.start_time).to.eql(newTask.start_time);
        expect(res.body.duration).to.eql(newTask.duration);
        expect(res.body.category).to.eql(newTask.category);
        expect(res.headers.location).to.eql(`/api/tasks/${res.body.id}`);
      });
  });
});
