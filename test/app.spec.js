const app = require("../src/app");

describe("App", () => {
  it(`GET / responds with 200 containing "You've reached app.js"`, () => {
    return supertest(app).get("/").expect(200, "You've reached app.js");
  });
});
