import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert fact-checking assistant. Extract specific, verifiable claims from the provided document text.

Focus ONLY on claims that contain:
- Statistics or percentages (e.g., "revenue grew by 42%", "65% of users...")
- Specific monetary figures (e.g., "the market is worth $4.2 trillion")
- Dates tied to events (e.g., "Company X was founded in 2004")
- Named entities with attributed facts (e.g., "Elon Musk owns 13% of Tesla")
- Scientific or technical claims with measurable values
- Rankings or record-breaking statements

Do NOT extract vague opinions, predictions without figures, or obvious common knowledge.

Return a JSON array (max 15 items). Each item must have:
- "claim": the exact claim as written in the document (max 160 chars)
- "context": brief surrounding sentence for context
- "search_query": an optimized Google search query to verify this specific claim

Return ONLY raw JSON — no markdown fences, no explanation.`;

export async function extractClaims(text) {
  const truncated = text.length > 6000 ? text.slice(0, 6000) + "\n\n[Document truncated...]" : text;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Extract all verifiable claims from this document:\n\n${truncated}` },
    ],
    temperature: 0.1,
    max_tokens: 1500,
  });

  let raw = response.choices[0].message.content.trim();
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
  } catch {
    console.error("Failed to parse claims JSON:", raw.slice(0, 300));
    return [];
  }
}
