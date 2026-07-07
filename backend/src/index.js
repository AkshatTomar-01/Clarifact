import "dotenv/config";
import express from "express";
import cors from "cors";
import factCheckRouter from "./routes/factcheck.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", factCheckRouter);

app.listen(PORT, () => {
  console.log(`✅ Fact-check server running on http://localhost:${PORT}`);
});
