import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

type Conflict = {
	topic: string;
	partyA: string;
	partyB: string;
	conflict: string;
	compromise: string;
	riskLevel: "low" | "medium" | "high";
	requiresLegalReview: boolean;
};

type AnalysisResult = {
	conflicts: Conflict[];
	summary: string;
};

function App() {
	const [contractA, setContractA] = useState<File | null>(null);
	const [contractB, setContractB] = useState<File | null>(null);
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!contractA || !contractB) return;

		setLoading(true);
		setError(null);
		setResult(null);

		const formData = new FormData();
		formData.append("contractA", contractA);
		formData.append("contractB", contractB);

		try {
			const res = await fetch("/api/negotiate", {
				method: "POST",
				body: formData,
			});

			const data = (await res.json()) as AnalysisResult | { error?: string };

			if (!res.ok) {
				setError(
					"error" in data && typeof data.error === "string"
						? data.error
						: "Something went wrong",
				);
				return;
			}

			if (!("conflicts" in data) || !("summary" in data)) {
				setError("Unexpected response from server");
				return;
			}

			setResult(data);
		} catch (err) {
			setError("Failed to connect to server");
		} finally {
			setLoading(false);
		}
	};

	const riskColor = (level: string) => {
		if (level === "high") return "risk-high";
		if (level === "medium") return "risk-medium";
		return "risk-low";
	};

	return (
		<div className='container'>
			<header>
				<h1>Contract Negotiator</h1>
				<p>Upload two contracts and get AI-powered compromise suggestions</p>
			</header>

			<form onSubmit={handleSubmit} className='upload-form'>
				<div className='upload-grid'>
					<div className='upload-zone'>
						<label>Your Contract (Party A)</label>
						<input
							type='file'
							accept='.pdf'
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setContractA(e.target.files?.[0] || null)
							}
							required
						/>
						{contractA && <p className='file-name'>{contractA.name}</p>}
					</div>

					<div className='upload-zone'>
						<label>Counterparty Contract (Party B)</label>
						<input
							type='file'
							accept='.pdf'
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setContractB(e.target.files?.[0] || null)
							}
							required
						/>
						{contractB && <p className='file-name'>{contractB.name}</p>}
					</div>
				</div>

				<button type='submit' disabled={loading || !contractA || !contractB}>
					{loading ? "Analyzing contracts..." : "Negotiate"}
				</button>
			</form>

			{error && <div className='error'>{error}</div>}

			{result && (
				<div className='results'>
					<div className='summary'>
						<h2>Summary</h2>
						<p>{result.summary}</p>
					</div>

					<h2>Conflicts & Compromises ({result.conflicts.length})</h2>

					{result.conflicts.map((conflict, i) => (
						<div
							key={i}
							className={`conflict-card ${riskColor(conflict.riskLevel)}`}>
							<div className='conflict-header'>
								<h3>{conflict.topic}</h3>
								<span className={`risk-badge ${riskColor(conflict.riskLevel)}`}>
									{conflict.riskLevel} risk
								</span>
								{conflict.requiresLegalReview && (
									<span className='legal-badge'>Requires Legal Review</span>
								)}
							</div>

							<div className='clause-grid'>
								<div className='clause'>
									<h4>Party A</h4>
									<p>{conflict.partyA}</p>
								</div>
								<div className='clause'>
									<h4>Party B</h4>
									<p>{conflict.partyB}</p>
								</div>
							</div>

							<div className='conflict-explanation'>
								<h4>The Conflict</h4>
								<p>{conflict.conflict}</p>
							</div>

							<div className='compromise'>
								<h4>Suggested Compromise</h4>
								<p>{conflict.compromise}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(<App />);
