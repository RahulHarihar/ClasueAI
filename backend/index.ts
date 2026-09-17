import { extractTextFromPDF, extractClauses } from "./services/pdfParser";
import { analyzeContracts } from "./services/geminiService";

const corsHeaders = {
	"Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
	"Access-Control-Allow-Methods": "POST, GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Content-Type": "application/json",
};

Bun.serve({
	port: process.env.PORT || 3000,
	routes: {
		"/api/negotiate": {
			OPTIONS: () =>
				new Response(null, {
					status: 204,
					headers: corsHeaders,
				}),

			POST: async (req) => {
				try {
					const formData = await req.formData();

					const contractA = formData.get("contractA") as File | null;
					const contractB = formData.get("contractB") as File | null;

					if (!contractA || !contractB) {
						return new Response(
							JSON.stringify({ error: "Both contracts are required" }),
							{ status: 400, headers: corsHeaders },
						);
					}

					// P2: enforce file size limit (10 MB per file)
					const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
					if (contractA.size > MAX_FILE_SIZE) {
						return new Response(
							JSON.stringify({ error: "Party A contract exceeds the 10 MB file size limit." }),
							{ status: 400, headers: corsHeaders },
						);
					}
					if (contractB.size > MAX_FILE_SIZE) {
						return new Response(
							JSON.stringify({ error: "Party B contract exceeds the 10 MB file size limit." }),
							{ status: 400, headers: corsHeaders },
						);
					}

					// Convert files to buffers
					const bufferA = Buffer.from(await contractA.arrayBuffer());
					const bufferB = Buffer.from(await contractB.arrayBuffer());

					// Extract text from PDFs
					const textA = await extractTextFromPDF(bufferA);
					const textB = await extractTextFromPDF(bufferB);

					// Extract clauses
					const clausesA = extractClauses(textA);
					const clausesB = extractClauses(textB);

					// P2: surface which contract failed with a clear, actionable message
					if (clausesA.length === 0) {
						return new Response(
							JSON.stringify({
								error:
									"Could not extract text from Party A contract. The PDF may be scanned or image-based.",
							}),
							{ status: 400, headers: corsHeaders },
						);
					}
					if (clausesB.length === 0) {
						return new Response(
							JSON.stringify({
								error:
									"Could not extract text from Party B contract. The PDF may be scanned or image-based.",
							}),
							{ status: 400, headers: corsHeaders },
						);
					}

					// Analyze with Gemini
					const analysis = await analyzeContracts(clausesA, clausesB);

					// P1: guard against malformed JSON from Gemini
					let result: unknown;
					try {
						result = JSON.parse(analysis);
					} catch {
						console.error("Gemini returned malformed JSON:", analysis);
						return new Response(
							JSON.stringify({
								error:
									"The AI returned an unreadable response. Please try again.",
							}),
							{ status: 500, headers: corsHeaders },
						);
					}

					return new Response(JSON.stringify(result), {
						headers: corsHeaders,
					});
				} catch (error) {
					console.error("Negotiation error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to analyze contracts" }),
						{ status: 500, headers: corsHeaders },
					);
				}
			},
		},

		"/api/health": {
			OPTIONS: () =>
				new Response(null, {
					status: 204,
					headers: corsHeaders,
				}),

			GET: () =>
				new Response(JSON.stringify({ status: "ok" }), {
					headers: corsHeaders,
				}),
		},
	},

	development: {
		hmr: true,
		console: true,
	},
});

console.log(`Contract Negotiator API running on http://localhost:${process.env.PORT || 3000}`);
