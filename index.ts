import { extractTextFromPDF, extractClauses } from "./services/pdfParser";
import { analyzeContracts } from "./services/geminiService";
import index from "./index.html";

Bun.serve({
	port: process.env.PORT || 3000,
	routes: {
		"/": index,

		"/api/negotiate": {
			POST: async (req) => {
				try {
					const formData = await req.formData();

					const contractA = formData.get("contractA") as File;
					const contractB = formData.get("contractB") as File;

					if (!contractA || !contractB) {
						return new Response(
							JSON.stringify({ error: "Both contracts are required" }),
							{ status: 400, headers: { "Content-Type": "application/json" } },
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
							{ status: 400, headers: { "Content-Type": "application/json" } },
						);
					}

					// Analyze with Groq
					const analysis = await analyzeContracts(clausesA, clausesB);
					const result = JSON.parse(analysis);

					return new Response(JSON.stringify(result), {
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Negotiation error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to analyze contracts" }),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}
			},
		},

		"/api/health": {
			GET: () =>
				new Response(JSON.stringify({ status: "ok" }), {
					headers: { "Content-Type": "application/json" },
				}),
		},
	},

	development: {
		hmr: true,
		console: true,
	},
});

console.log("Contract Negotiator running on http://localhost:3000");
