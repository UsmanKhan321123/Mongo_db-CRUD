// import express from "express";
// import "dotenv/config";
// import mongoose from "mongoose";
// import productRouter from "./routes/productRoutes.mjs";

// let app = express();
// let port = 3000;
// let db_url = process.env.MONGO_DB_URL;
// mongoose
//   .connect(db_url)
//   .then(() => {
//     console.log("Database Connected");
//   })
//   .catch((err) => {
//     console.error("Error Message : ", err.message);
//   });

// app.use(express.json());
// app.use(express.urlencoded());
// app.use("/",productRouter)
// app.listen(port, () => {
//   console.log(`App is running on port ${port}`);
// });

import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.mjs";

const app = express();

// middlewares are here
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


// Mongo_DB connector Function
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

// connect before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// routes
app.use("/", productRouter);

// Export as a Vercel function (NOT listening)
export default app;
