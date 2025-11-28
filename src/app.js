import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

app.use("/api", router);

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
