"use client";

import { useState } from "react";
import styles from "./ai.module.css";

export function AiPlayground() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("openai/gpt-4o-mini");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Hiba történt.");
      } else {
        setAnswer(data.text);
      }
    } catch {
      setError("Nem sikerült elérni a szervert.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.playground}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="provider/model"
          className={styles.modelInput}
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Írj egy kérdést vagy utasítást…"
          rows={4}
          className={styles.textarea}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Generálás…" : "Küldés"}
        </button>
      </form>

      {error && <p className={styles.error}>✗ {error}</p>}
      {answer && <pre className={styles.answer}>{answer}</pre>}
    </div>
  );
}
