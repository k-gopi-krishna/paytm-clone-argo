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
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    // allowedHeaders: ["*"],
    credentials: true,
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
