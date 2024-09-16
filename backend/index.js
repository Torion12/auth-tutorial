import express from "express";
import { connectionDB } from "./db/connectionDB.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hellow Word1234!");
});

app.use("/api/auth", authRoutes);

connectionDB().then(()=> {
  app.listen(3000, () => {
    console.log("Server is Running in Port 3000");
  });
})

