"use client";

import { type FormEvent, type KeyboardEvent, useState } from "react";

export default function TerminalInput({ onSubmit, commandHistory, disabled }: { onSubmit: (value: string) => void; commandHistory: string[]; disabled?: boolean }) {
  const [value, setValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(commandHistory.length);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleaned = value.trim();
    if (!cleaned) return;
    onSubmit(cleaned);
    setValue("");
    setHistoryIndex(commandHistory.length + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && commandHistory.length) {
      event.preventDefault();
      const next = Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(commandHistory[next] ?? "");
    } else if (event.key === "ArrowDown" && commandHistory.length) {
      event.preventDefault();
      const next = Math.min(commandHistory.length, historyIndex + 1);
      setHistoryIndex(next);
      setValue(next === commandHistory.length ? "" : commandHistory[next] ?? "");
    }
  };

  return (
    <form className="terminal-input" onSubmit={submit}>
      <label htmlFor="terminal-command" className="prompt-label">visitor@krishna:~$</label>
      <div className="input-wrap">
        <input id="terminal-command" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} maxLength={240} autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={disabled} aria-describedby="input-hint" />
        <span className="cursor" aria-hidden="true" />
      </div>
      <button type="submit" disabled={disabled || !value.trim()} aria-label="Submit question">RUN</button>
      <span id="input-hint" className="sr-only">Ask a question or enter a supported command. Use up and down arrows to recall history.</span>
    </form>
  );
}
