const express = require("express");
require("./db/mongoose");
const userRouter = require("./Routes/user");
const taskRouter = require("./Routes/task");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("listening on port 3000");
});
