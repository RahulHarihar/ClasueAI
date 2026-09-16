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

					// Convert files to buffers
					const bufferA = Buffer.from(await contractA.arrayBuffer());
					const bufferB = Buffer.from(await contractB.arrayBuffer());

					// Extract text from PDFs
					const textA = await extractTextFromPDF(bufferA);
					const textB = await extractTextFromPDF(bufferB);

					// Extract clauses
					const clausesA = extractClauses(textA);
					const clausesB = extractClauses(textB);

					if (clausesA.length === 0 || clausesB.length === 0) {
						return new Response(
							JSON.stringify({
								error: "Could not extract clauses from one or both contracts",
							}),
							{ status: 400, headers: corsHeaders },
						);
					}

					// Analyze with Gemini
					const analysis = await analyzeContracts(clausesA, clausesB);
					const result = JSON.parse(analysis);

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
