import Groq from "groq-sdk";
import { searchWeb } from "./webSearch.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const VERDICT_SYSTEM = `You are a strict fact-checking judge. Given a claim and web search evidence, determine the verdict.

Verdict options:
- "Verified": The claim is accurate and supported by evidence.
- "Inaccurate": The claim has wrong figures or outdated stats — correct information is available.
- "False": The claim is directly contradicted by evidence or has no support at all.
- "Unverifiable": Insufficient evidence to confirm or deny.

Respond with ONLY a JSON object:
{
  "verdict": "Verified" | "Inaccurate" | "False" | "Unverifiable",
  "explanation": "1-2 sentences explaining your verdict",
  "correction": "The correct fact if verdict is Inaccurate or False, otherwise null",
  "sources": ["url1", "url2"]
}

Return ONLY raw JSON — no markdown, no extra text.`;

// Retry with exponential backoff on 429s
async function groqWithRetry(params, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await groq.chat.completions.create(params);
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("429");
      if (is429 && attempt < retries) {
        const wait = (attempt + 1) * 8000; // 8s, 16s, 24s, 32s
        console.log(`Rate limited — retrying in ${wait / 1000}s...`);
        await new Promise((r) => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
  }
}

async function verifySingleClaim(claimObj) {
  const { claim, context, search_query } = claimObj;
  const evidence = await searchWeb(search_query);

  const response = await groqWithRetry({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: VERDICT_SYSTEM },
      {
        role: "user",
        content: `CLAIM: "${claim}"
CONTEXT FROM DOCUMENT: "${context}"
WEB SEARCH EVIDENCE:
${evidence || "No relevant search results found."}

Give your verdict.`,
      },
    ],
    temperature: 0.1,
    max_tokens: 300,
  });

  let raw = response.choices[0].message.content.trim();
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  try {
    const parsed = JSON.parse(raw);
    return {
      claim,
      context,
      verdict: parsed.verdict || "Unverifiable",
      explanation: parsed.explanation || "",
      correction: parsed.correction || null,
      sources: parsed.sources || [],
    };
  } catch {
    return {
      claim,
      context,
      verdict: "Unverifiable",
      explanation: "Could not parse verification result.",
      correction: null,
      sources: [],
    };
  }
}

// Sequential processing to stay within 12k TPM free tier
export async function verifyClaims(claims) {
  const results = [];
  for (const claim of claims) {
    const result = await verifySingleClaim(claim);
    results.push(result);
    // 3s gap between claims to spread token usage over time
    await new Promise((r) => setTimeout(r, 3000));
  }
  return results;
}
