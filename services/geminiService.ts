import { GoogleGenerativeAI } from "@google/generative-ai"

const DEFAULT_MODELS = [
	process.env.GEMINI_MODEL || "gemini-3.6-flash",
	"gemini-3.5-flash",
	"gemini-3.5-flash-lite",
]

export const analyzeContracts = async (
	clausesA: string[],
	clausesB: string[],
): Promise<string> => {
	const apiKey = process.env.GEMINI_API_KEY
	if (!apiKey) {
		throw new Error(
			"GEMINI_API_KEY is not set. Add your Gemini API key to the .env file.",
		)
	}

	const prompt = `You are a legal contract negotiation expert.

You have been given two sets of contract clauses from two different parties.

Party A clauses:
${clausesA.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Party B clauses:
${clausesB.map((c, i) => `${i + 1}. ${c}`).join("\n")}

For each conflicting clause:
1. Identify the conflict clearly
2. Explain why it matters
3. Suggest a fair compromise clause that both parties could accept
4. Flag if any clause is high risk and requires human legal review

Respond ONLY with valid JSON in exactly this format, no markdown, no backticks, no extra text:
{
  "conflicts": [
    {
      "topic": "Payment Terms",
      "partyA": "original clause from A",
      "partyB": "original clause from B",
      "conflict": "explanation of the conflict",
      "compromise": "suggested compromise language",
      "riskLevel": "low",
      "requiresLegalReview": false
    }
  ],
  "summary": "overall negotiation summary"
}`

	let lastError: unknown

	for (const model of DEFAULT_MODELS) {
		try {
			const genAI = new GoogleGenerativeAI(apiKey)
			const generativeModel = genAI.getGenerativeModel({
				model,
				generationConfig: {
					temperature: 0.3,
					responseMimeType: "application/json",
				},
			})

			const result = await generativeModel.generateContent(prompt)
			const text = result.response.text()

			if (!text) {
				throw new Error("Empty response from Gemini")
			}

			return text
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			const lowerMessage = message.toLowerCase()
			const isModelAccessIssue =
				lowerMessage.includes("not found") ||
				lowerMessage.includes("deprecated") ||
				lowerMessage.includes("not supported") ||
				lowerMessage.includes("permission_denied") ||
				lowerMessage.includes("does not exist") ||
				lowerMessage.includes("no longer available") ||
				lowerMessage.includes("404") ||
				lowerMessage.includes("503") ||
				lowerMessage.includes("unavailable") ||
				lowerMessage.includes("high demand")

			if (isModelAccessIssue) {
				lastError = error
				continue
			}

			throw error
		}
	}

	const attemptedModels = DEFAULT_MODELS.join(", ")
	throw new Error(
		`All configured Gemini models are unavailable for this API key. ` +
		`Models attempted: ${attemptedModels}. ` +
		`Visit aistudio.google.com to verify your key and check model availability.`
	)
}