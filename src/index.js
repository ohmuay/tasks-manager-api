const express = require("express");
require("./db/mongoose.js");

const app = express();
const port = process.env.PORT;

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


// app.use((req,res,next)=>{
//   res.status(503).send("Cannot "+ req.method + " request right now server in under attack!")
// })
app.use(express.json());
app.use(userRouter,taskRouter)


app.listen(port, () => {
  console.log("server is up on port " + port);
});
