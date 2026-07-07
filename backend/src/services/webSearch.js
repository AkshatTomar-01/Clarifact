import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

/**
 * Search the web using Tavily — built for AI agents, returns clean snippets.
 * @param {string} query
 * @returns {Promise<string>} concatenated search result snippets
 */
export async function searchWeb(query) {
  try {
    const response = await client.search(query, {
      maxResults: 5,
      searchDepth: "basic",
      includeAnswer: false,
    });

    const results = response.results || [];
    if (results.length === 0) return "";

    return results
      .map((r, i) =>
        `[${i + 1}] ${r.title}\n${r.content || ""}${r.url ? `\nSource: ${r.url}` : ""}`
      )
      .join("\n\n");
  } catch (err) {
    console.error(`Tavily search failed for "${query}":`, err.message);
    return "";
  }
}
