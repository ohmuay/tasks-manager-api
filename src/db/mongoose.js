const mongoose = require("mongoose");
// const validator = require("validator");

mongoose.connect(process.env.MONGOOSE_CONNECTION_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// const User = mongoose.model("User", {
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     lowercase: true,
//     required:true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error("Email is Invalid!");
//       }
//     },
//   },
//   password: {
//     type:String,
//     required:true,
//     trim:true,
//     validate(value){
//       if(value.length<6){
//         throw new Error("Password must have 6 or more characters!")
//       }
//       if(value.includes('password')){
//         throw new Error("Can not contain text 'password'")
//       }
//     }
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value) {
//       if (value < 0) {
//         throw new Error("Age must be positive number!");
//       }
//     },
//   },
// });

// const user = new User({ name: "  SAWARUDOO  ", email: "stuchi@sega.cod",password:'p1assword'});

// user
//   .save()
//   .then(() => {
//     console.log(user.name, " saved");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// const Task = mongoose.model("Task", {
//   description: {
//     required:true,
//     type: String,
//     trim:true
//   },
//   completed: {
//     type: Boolean,
//     default:false
//   },
// });

// const task = new Task({
//   description: "Master Mongoose",
// });

// task
//   .save()
//   .then(() => {
//     console.log(task.description, " saved");
//   })
//   .catch((error) => {
//     console.log(error);
//   });
