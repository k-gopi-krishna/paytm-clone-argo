const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    // allowedHeaders: ["*"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.options(
  "/api/v1/user/sigin",
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(
  bodyParser({
    limit: "50mb",
  })
);
async function connetToDB() {
  await mongoose.connect(process.env.MONGO_URL);
}

connetToDB();

app.use("/api/v1", router);

app.listen(3000, () => {
  console.log("App running on port 3000");
});
