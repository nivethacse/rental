require("dotenv").config();
const { ObjectId } = require("bson");
const express = require("express");
const app = express();
const db = require("./mongo");
const cors = require("cors");
const bikeservice = require("./modules/bike");
const userRoutes = require("./routes/user_routes");
const verifyRoute = require("./routes/verifyMail_route");
const forgetService = require("./modules/forgetPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sortServices = require("./routes/sortService");

const Port = process.env.PORT || 3001;

app.use(cors());

db.connect();

app.use(express.json());

// endPoint for verifying user email
app.use("/verify", verifyRoute);

// endPoint for user login flow and registeration
app.use("/user", userRoutes);

app.put("/reset", forgetService.reset);

// endpoint for password update
app.put("/updatePassword", forgetService.updatePassword);

// bike info
app.get("/bike", bikeservice.bike);

// sortind data
app.use("/sort", sortServices);
// authorization middleware
app.use((req, res, next) => {
  const token = req.headers["auth-token"];

  if (token) {
    try {
      req.user = jwt.verify(token, "admin123");

      next();
    } catch (error) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
});

// booking bike
app.post("/booking", bikeservice.bookBike);

// deleting or cancelling the booking
app.put("/deleteBooking", async (req, res) => {
  try {
    const data = await db.rentalData.findOneAndUpdate(
      { _id: ObjectId(req.body._id) },
      { $pull: { booking: { bookId: ObjectId(req.body.bookId) } } },
      { returnDocument: "after" }
    );
    res.send(data.value);
  } catch (error) {
    console.log(error);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(Port, () => {
  console.log("your server startd at", Port);
});
