require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_SK_KEY);

const port = process.env.PORT || 3000;
const app = express();
// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  const db = client.db("plantdb");
  const plantsCollection = db.collection("plants");
  const ordersCollection = db.collection("orders");
  const usersCollection = db.collection("users");

  try {
    // Admin Verify
    const verifyAdmin = async (req, res, next) => {
      const email = req?.user?.email
      const user = await usersCollection.findOne()


      next()
    }

    // Generate jwt token
    app.post("/jwt", async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Logout
    app.get("/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // add a plant in db
    app.post("/add-plant", async (req, res) => {
      const plant = req.body;
      const result = await plantsCollection.insertOne(plant);
      res.send(result);
    });

    // get all plants data form db
    app.get("/plants", async (req, res) => {
      const result = await plantsCollection.find().toArray();
      res.send(result);
    });

    // get a single  plants data form db
    app.get("/plant/:id", async (req, res) => {
      const id = req.params.id;
      const result = await plantsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // create payment inter for order
    app.post("/create-payment-intent", async (req, res) => {
      const { plantId, quantity } = req.body;
      const plant = await plantsCollection.findOne({
        _id: new ObjectId(plantId),
      });
      if (!plant) return res.status(404).send({ message: "plant not found" });
      const totalPrice = quantity * plant?.price * 100;

      // stripe...
      const { client_secret } = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({ clientSecret: client_secret });
    });

    // save or update a users a info in db
    app.post("/user", async (req, res) => {
      const userData = req.body;
      userData.role = "customer";
      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();
      const query = {
        email: userData?.email,
      };
      const alreadyExists = await usersCollection.findOne(query);
      console.log("User already exists:", !!alreadyExists);
      if (!!alreadyExists) {
        console.log("Update user data....");
        const result = await usersCollection.updateOne(query, {
          $set: { last_loggedIn: new Date().toISOString() },
        });
        res.send(result);
      }
      console.log("Creating user data........");

      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // get a user's role
    app.get("/user/role/:email", async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email });
      if (!result) return res.status(404).send({ message: "User Not Fount." });
      res.send({ role: result?.role });
    });

    // save order daa in orders collection n db
    app.post("/order", async (req, res) => {
      const orderData = req.body;
      const result = await ordersCollection.insertOne(orderData);
      res.send(result);
    });

    // update plant quantity(increase/decrease)
    app.patch("/quantity-update/:id", async (req, res) => {
      const id = req.params.id;
      const { quantityToUpdate, status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $inc: {
          quantity:
            status === "increment" ? quantityToUpdate : -quantityToUpdate,
        },
      };
      const result = await plantsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // get all user for admin
    app.get("/all-users", verifyToken, async (req, res) => {
      const filter = {
        email: { $ne: req?.user?.email },
      };
      const result = await usersCollection.find(filter).toArray();
      res.send(result);
    });

    // update a user's role
    app.patch("/user/role/update/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const { role } = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          role,
          status: "verified",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // become seller request
    app.patch(
      "/become-seller-request/:email",
      verifyToken,
      async (req, res) => {
        const email = req.params.email;

        const filter = { email: email };
        const updateDoc = {
          $set: {
            status: "requested",
          },
        };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
      }
    );

    // admin status
    app.get("/admin-status", verifyToken, verifyAdmin, async (req, res) => {
      // const totalSeller = await usersCollection.countDocuments()
      const totalUser = await usersCollection.estimatedDocumentCount();
      const totalPlant = await plantsCollection.estimatedDocumentCount();
      const totalOrder = await ordersCollection.estimatedDocumentCount();

      // mongodb aggregation
      const result = await ordersCollection
        .aggregate([
          {
            $addFields: {
              createdAt: { $toDate: "$_id" },
            },
          },
          {
            // Group data by data
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
              revenue: { $sum: "$price" },
              order: { $sum: 1 },
            },
          },
        ])
        .toArray()

        const barChartData = result.map(data => ({
          date:data._id,
          revenue: data.revenue,
          order: data.order,
        }))
        const totalRevenue = result.reduce((sum, data)=> sum + data?.revenue, 0)

      res.send({
        totalUser,
        totalPlant,
        barChartData,
        totalOrder,
        totalRevenue,
      })
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from plantNet Server..");
});

app.listen(port, () => {
  console.log(`plantNet is running on port http://localhost:${port}`);
});
