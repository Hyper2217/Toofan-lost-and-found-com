const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Item = require("./models/Item");
const auth = require("./middleware/Auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// CONNECT DB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

/* ---------------- AUTH ---------------- */

// REGISTER
app.post("/api/register", async (req,res)=>{
  const {email,password} = req.body;

  const hashed = await bcrypt.hash(password,10);
  const user = await User.create({email,password:hashed});

  res.json(user);
});

// LOGIN
app.post("/api/login", async (req,res)=>{
  const {email,password} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.json({msg:"User not found"});

  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.json({msg:"Wrong password"});

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
  res.json({token});
});

/* ---------------- ITEMS ---------------- */

// GET ITEMS
app.get("/api/items", async (req,res)=>{
  const items = await Item.find();
  res.json(items);
});

// ADD ITEM (protected)
app.post("/api/items", auth, async (req,res)=>{
  const item = await Item.create(req.body);
  res.json(item);
});

// DELETE ITEM
app.delete("/api/items/:id", async (req,res)=>{
  await Item.findByIdAndDelete(req.params.id);
  res.json({msg:"deleted"});
});

app.listen(process.env.PORT,()=>{
  console.log("Server running");
});
