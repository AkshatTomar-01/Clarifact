import pdfParse from "pdf-parse/lib/pdf-parse.js";

/**
 * Extract plain text from a PDF buffer.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text || "";
}
