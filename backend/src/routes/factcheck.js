import express from "express";
import multer from "multer";
import { extractTextFromPDF } from "../services/pdfExtractor.js";
import { extractClaims } from "../services/claimExtractor.js";
import { verifyClaims } from "../services/factChecker.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are accepted."));
  },
});

router.post("/fact-check", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const text = await extractTextFromPDF(req.file.buffer);
    if (!text || text.trim().length < 50) {
      return res.status(422).json({ error: "Could not extract readable text from the PDF." });
    }

    const claims = await extractClaims(text);
    if (!claims || claims.length === 0) {
      return res.json({
        total_claims: 0,
        summary: { verified: 0, inaccurate: 0, false: 0, unverifiable: 0 },
        claims: [],
        message: "No verifiable claims found in the document.",
      });
    }

    const results = await verifyClaims(claims);

    const summary = results.reduce(
      (acc, r) => {
        const key = r.verdict.toLowerCase();
        if (key in acc) acc[key]++;
        return acc;
      },
      { verified: 0, inaccurate: 0, false: 0, unverifiable: 0 }
    );

    return res.json({ total_claims: results.length, summary, claims: results });
  } catch (err) {
    console.error("Fact-check error:", err);
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
});

export default router;
