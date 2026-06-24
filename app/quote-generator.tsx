"use client";

import { useActionState } from "react";
import { generateQuote, type QuoteState } from "./actions";
import styles from "./page.module.css";

const initialState: QuoteState = { status: "idle" };

export function QuoteGenerator() {
  const [state, action, pending] = useActionState(generateQuote, initialState);

  return (
    <div className={styles.generator}>
      <form action={action} className={styles.quoteForm}>
        <input
          type="text"
          name="person"
          placeholder="Pl. Albert Einstein"
          required
          maxLength={100}
          disabled={pending}
          className={styles.personInput}
        />
        <button type="submit" disabled={pending} className={styles.quoteButton}>
          {pending ? "Keresés…" : "Idézet kérése"}
        </button>
      </form>

      {state.status === "success" && (
        <blockquote className={styles.resultQuote}>
          „{state.quote}”
          <footer className={styles.resultFooter}>— {state.person}</footer>
        </blockquote>
      )}
      {state.status === "error" && (
        <p className={styles.quoteError}>✗ {state.message}</p>
      )}
    </div>
  );
}
