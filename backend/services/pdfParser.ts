import { PDFParse } from "pdf-parse";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
	const parser = new PDFParse({ data: buffer });
	const data = await parser.getText();
	return data.text;
}

export function extractClauses(text: string): string[] {
	// Split by common clause indicators
	const clauses = text
		.split(/\n(?=\d+\.|[A-Z][a-z]+:|\([a-z]\)|\([0-9]\))/)
		.map((clause) => clause.trim())
		.filter((clause) => clause.length > 50) // filter out short fragments
		.slice(0, 20); // limit to first 20 clauses for MVP

	return clauses;
}
