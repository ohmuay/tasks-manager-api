const express = require("express");
const userRouter = new express.Router();
const User = require("./../models/users");
const auth = require("./../middleware/auth");
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendGoodbyeEmail} = require('./../emails/account')

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.getToken();
    user.tokens = user.tokens.concat({ token });
    sendWelcomeEmail(user.email,user.name)
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

userRouter.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const data = await User.findById(_id);
    if (!data) {
      return res.status(404).send();
    }
    res.send(data);
  } catch (e) {
    res.status(500).send(e);
  }
});

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendGoodbyeEmail(req.user.email,req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

userRouter.patch("/users/me", auth,async (req, res) => {
  // const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValid = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValid) {
    return res.status(400).send({ error: "Updates is invalid." });
  }

  try {
    //const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
    const user = req.user

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Login
userRouter.post("/users/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    const token = await user.getToken();
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// LogOut

userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  // dest:'avatar',
  limits:{
    fileSize:100000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error("Please upload a jpg, jpeg or png file extensions"))
    }
    cb(undefined,true)
  }
})

userRouter.post('/users/me/avatar',auth,upload.single('avatar'), async(req,res)=>{
  const buffer = await sharp(req.file.buffer).resize({
    width:250,
    height:250
  }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()

  res.send()
},(error,req,res,next)=>{
  res.status(500).send({error:error.message})
})

userRouter.delete('/users/me/avatar',auth, async(req,res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

userRouter.get('/users/:id/avatar', async(req,res)=>{
  try{
      const user = await User.findById(req.params.id)
      if(!user || !user.avatar)
      {
        throw new Error()
      }

      res.set('Content-type','image/jpg')
      res.send(user.avatar)
  }catch(e){
    res.status(404).send()
  }
})

module.exports = userRouter;
