const OrdersModel = require("../models/OrdersModel");
const HoldingsModel = require("../models/HoldingsModel");

const newOrder = async (req, res) => {

  try {

    const { name, qty, price, mode } = req.body;

    // STEP 1
    // Save order history

    const order = new OrdersModel({

      userId: req.user._id,

      name,

      qty,

      price,

      mode,

    });

    await order.save();

    // STEP 2
    // Check if holding already exists

    const existingHolding =
      await HoldingsModel.findOne({

        userId: req.user._id,

        name,

      });

    // STEP 3
    // If stock already exists

    if (existingHolding) {

      const totalQty =
        existingHolding.qty + qty;

      const totalInvestment =
        (
          existingHolding.qty *
          existingHolding.avg
        )
        +
        (
          qty * price
        );

      const newAvg =
        totalInvestment / totalQty;

      existingHolding.qty = totalQty;

      existingHolding.avg = newAvg;

      await existingHolding.save();

    }

    // STEP 4
    // First time stock purchase

    else {

      const newHolding =
        new HoldingsModel({

          userId: req.user._id,

          name,

          qty,

          avg: price,

        });

      await newHolding.save();

    }

    res.status(201).json({

      message: "Stock bought successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Internal Server Error",

    });

  }

};

module.exports = { newOrder };