require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const HoldingsModel =
require("./models/HoldingsModel");

const PositionsModel =
require("./models/PositionsModel");

const OrdersModel =
require("./models/OrdersModel");
const { register,login} = require("./Controllers/AuthController");
const { newOrder } = require("./Controllers/OrderController");
const {watchlist} = require("./data.js");

const {userVerification} = require("./middleware/AuthMiddleware");
const PORT= process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const app = express();

app.use(
  cors({
     origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// for all holdongs data fetching from the database
app.get("/allHoldings", userVerification, async (req, res) => {

   const holdings =
      await HoldingsModel.find({
         userId: req.user._id
      });

   const enrichedHoldings =
      holdings.map((holding) => {

         const stock =
            watchlist.find(
               item =>
                  item.name === holding.name
            );

         const net =
            (
               (
                  (stock.price - holding.avg)
                  /
                  holding.avg
               ) * 100
            ).toFixed(2) + "%";

         return {

            ...holding._doc,

            price: stock.price,

            day: stock.percent,

            net,

            isLoss:
               stock.percent.includes("-"),
         };
      });

   res.json(enrichedHoldings);
});
//authentication rotes

app.post("/register", register);
app.post('/login', login);
app.get(

  "/verify",

  userVerification,

  (req, res) => {

    res.status(200).json({

      status: true,

      user: {

        id: req.user._id,

        username: req.user.username,

        email: req.user.email,

      },

    });

  }

);
app.post(
  "/newOrder",
  userVerification,
  newOrder
);

// for all the positions data fetching from the database
app.get(

  "/allPositions",

  async (req, res) => {

    try {

      const positions =
        await PositionsModel.find({});

      res.json(positions);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Error fetching positions",

      });

    }

  }

);
//for a;; the orders
app.get(

  "/allOrders",

  userVerification,

  async (req, res) => {

    try {

      const orders =
        await OrdersModel.find({

          userId: req.user._id,

        })

        .sort({

          createdAt: -1,

        });

      res.json(orders);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Error fetching orders",

      });

    }

  }

);
//log out 

app.get("/logout", (req, res) => {

  res.clearCookie("token");

  res.json({
    message: "Logged out successfully",
  });

});



// this is for the injection positions data in teh database using the foreach loop
// app.get("/seed", async(req, res) => {
//     let tempPositions=[
//   {
//     product: "CNC",
//     name: "EVEREADY",
//     qty: 2,
//     avg: 316.27,
//     price: 312.35,
//     net: "+0.58%",
//     day: "-1.24%",
//     isLoss: true,
//   },
//   {
//     product: "CNC",
//     name: "JUBLFOOD",
//     qty: 1,
//     avg: 3124.75,
//     price: 3082.65,
//     net: "+10.04%",
//     day: "-1.35%",
//     isLoss: true,
//   },
// ];
//   try {
//     await PositionsModel.insertMany(tempPositions);

//     res.send("Positions data injected!");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error inserting data");
//   }

  
// });


// for injecting data in the database using the for each loop


// app.get("/", (req, res) => {
//     let tempHoldings=[
//   {
//     name: "BHARTIARTL",
//     qty: 2,
//     avg: 538.05,
//     price: 541.15,
//     net: "+0.58%",
//     day: "+2.99%",
//   },
//   {
//     name: "HDFCBANK",
//     qty: 2,
//     avg: 1383.4,
//     price: 1522.35,
//     net: "+10.04%",
//     day: "+0.11%",
//   },
//   {
//     name: "HINDUNILVR",
//     qty: 1,
//     avg: 2335.85,
//     price: 2417.4,
//     net: "+3.49%",
//     day: "+0.21%",
//   },
//   {
//     name: "INFY",
//     qty: 1,
//     avg: 1350.5,
//     price: 1555.45,
//     net: "+15.18%",
//     day: "-1.60%",
//     isLoss: true,
//   },
//   {
//     name: "ITC",
//     qty: 5,
//     avg: 202.0,
//     price: 207.9,
//     net: "+2.92%",
//     day: "+0.80%",
//   },
//   {
//     name: "KPITTECH",
//     qty: 5,
//     avg: 250.3,
//     price: 266.45,
//     net: "+6.45%",
//     day: "+3.54%",
//   },
//   {
//     name: "M&M",
//     qty: 2,
//     avg: 809.9,
//     price: 779.8,
//     net: "-3.72%",
//     day: "-0.01%",
//     isLoss: true,
//   },
//   {
//     name: "RELIANCE",
//     qty: 1,
//     avg: 2193.7,
//     price: 2112.4,
//     net: "-3.71%",
//     day: "+1.44%",
//   },
//   {
//     name: "SBIN",
//     qty: 4,
//     avg: 324.35,
//     price: 430.2,
//     net: "+32.63%",
//     day: "-0.34%",
//     isLoss: true,
//   },
//   {
//     name: "SGBMAY29",
//     qty: 2,
//     avg: 4727.0,
//     price: 4719.0,
//     net: "-0.17%",
//     day: "+0.15%",
//   },
//   {
//     name: "TATAPOWER",
//     qty: 5,
//     avg: 104.2,
//     price: 124.15,
//     net: "+19.15%",
//     day: "-0.24%",
//     isLoss: true,
//   },
//   {
//     name: "TCS",
//     qty: 1,
//     avg: 3041.7,
//     price: 3194.8,
//     net: "+5.03%",
//     day: "-0.25%",
//     isLoss: true,
//   },
//   {
//     name: "WIPRO",
//     qty: 4,
//     avg: 489.3,
//     price: 577.75,
//     net: "+18.08%",
//     day: "+0.32%",
//   },
// ];
// tempHoldings.forEach((item)=>{
//     let newHolding=new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//     });
//     newHolding.save();
// });

//   res.send("data injected!");
// });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
});