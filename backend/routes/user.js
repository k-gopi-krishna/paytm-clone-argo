const z = require("zod");
const User = require("../models/UserSchema");
const Account = require("../models/BankSchema");
const userRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware/authMiddleware.js");
const signupSchema = z.object({
  name: z.string().min(5).email(),
  firstname: z.string().min(3),
  lastname: z.string().min(1),
  password: z.string().min(5),
});

const loginSchema = z.object({
  name: z.string().min(5).email(),
  password: z.string().min(5),
});
const updateSchema = z.object({
  firstname: z.string().min(3).optional(),
  lastname: z.string().min(3).optional(),
  password: z.string().min(5).optional(),
});
userRouter.post("/signup", async (req, res) => {
  const user = req.body;
  if (!signupSchema.safeParse(user).success) {
    res.status(404).json("Invalid credentials");
  }
  const listedUser = await User.findOne({
    name: user.name,
  });
  if (listedUser) {
    res.status(411).json("A user with this name already exsists");
  }
  const newUser = await User.create(user);
  await Account.create({
    userId: newUser._id,
    balance: 1 + Math.random() * 10000,
  });
  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({ token, message: "User created successfully" });
});

userRouter.post("/signin", async (req, res) => {
  const user = req.body;
  if (!loginSchema.safeParse(user).success) {
    return res.status(411).json("Incorrect Inputs");
  }
  const listedUser = await User.findOne({ name: user.name });
  if (!listedUser) {
    return res.status(411).json("Incorrect credentials");
  }
  if (listedUser.password != user.password) {
    return res.status(411).json("Incorrect password");
  }
  const token = jwt.sign({ userId: listedUser._id }, JWT_SECRET);
  res
    .cookie("token", token, { httpOnly: true, path: "/" })
    .status(200)
    .json({ token, message: "Logged in successfully" });
});

userRouter.put("/update", authMiddleware, async (req, res) => {
  const details = req.body;
  if (!updateSchema.safeParse(details).success) {
    return res.status(411).json("Incorrect Inputs");
  }
  await User.findByIdAndUpdate(req.userId, details);
  res.json({
    message: "Updated successfully",
  });
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });
  res.status(200).json({
    users: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  });
});

userRouter.get("/getuser", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(411).json("Incorrect inputs");
  }
  res.status(200).json(user);
});

module.exports = userRouter;
