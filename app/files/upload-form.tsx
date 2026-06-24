"use client";

import { useActionState } from "react";
import { uploadFile, type UploadState } from "./actions";
import styles from "./files.module.css";

const initialState: UploadState = { status: "idle" };

export function UploadForm() {
  const [state, action, pending] = useActionState(uploadFile, initialState);

  return (
    <form action={action} className={styles.form}>
      <input
        type="file"
        name="file"
        required
        disabled={pending}
        className={styles.fileInput}
      />
      <button type="submit" disabled={pending} className={styles.button}>
        {pending ? "Feltöltés…" : "Feltöltés"}
      </button>

      {state.status === "success" && (
        <p className={styles.success}>
          ✓ Feltöltve:{" "}
          <a href={state.url} target="_blank" rel="noopener noreferrer">
            {state.pathname}
          </a>
        </p>
      )}
      {state.status === "error" && (
        <p className={styles.error}>✗ {state.message}</p>
      )}
    </form>
  );
}
