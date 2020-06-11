require("dotenv").config();

const PORT = 8080;
const app = require("./app");

app.listen(PORT, () => {
  console.log(`server listening at ${PORT}`);
});
