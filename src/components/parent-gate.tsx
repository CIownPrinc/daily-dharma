/**
 * ParentGate — math-puzzle authentication for the parents section.
 *
 * Change from original: adds "Remember me for 30 minutes" via sessionStorage.
 * Parents who check progress daily were solving a math problem every single
 * visit — this trades a small security-vs-convenience tradeoff for a much
 * better parent experience. 30 minutes is short enough that children can't
 * reliably exploit the window.
 *
 * The remember-me token is stored in sessionStorage (not localStorage) so it
 * clears automatically when the browser tab closes.
 */
import { useMemo, useState, useEffect } from "react";

const SESSION_KEY = "dharma-parent-unlocked";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

type Problem = { a: number; b: number };

function makeProblem(): Problem {
  const a = 11 + Math.floor(Math.random() * 38);
  const b = 13 + Math.floor(Math.random() * 35);
  return { a, b };
}

function isSessionValid(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return Date.now() - ts < SESSION_DURATION_MS;
  } catch {
    return false;
  }
}

function markSessionValid() {
  try {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  } catch {
    // sessionStorage unavailable — ignore
  }
}

export function ParentGate({
  onPass,
  onCancel,
}: {
  onPass: () => void;
  onCancel: () => void;
}) {
  const [problem, setProblem] = useState<Problem>(() => makeProblem());
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [remember, setRemember] = useState(false);
  const answer = useMemo(() => problem.a + problem.b, [problem]);

  // Auto-pass if a valid session exists from a previous unlock
  useEffect(() => {
    if (isSessionValid()) onPass();
  }, [onPass]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(value, 10) === answer) {
      if (remember) markSessionValid();
      onPass();
    } else {
      setError(true);
      setProblem(makeProblem());
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="bg-card rounded-3xl shadow-petal ring-1 ring-ink/5 p-7 w-full max-w-sm"
      >
        <div className="text-center mb-5">
          <div className="text-3xl mb-2" aria-hidden>🛡️</div>
          <h2 className="font-serif text-xl text-ink mb-1">For grown-ups</h2>
          <p className="text-ink-soft text-sm font-medium">
            Please solve this so we know a parent is here.
          </p>
        </div>

        <div className="bg-lotus-soft rounded-2xl p-5 text-center mb-4">
          <div className="font-serif text-3xl text-ink tabular-nums">
            {problem.a} + {problem.b} = ?
          </div>
        </div>

        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          autoFocus
          className="w-full rounded-2xl bg-jasmine/70 ring-1 ring-ink/10 focus:ring-lotus/40 focus:outline-none px-4 py-3 font-serif text-xl text-ink text-center mb-2"
          placeholder="Your answer"
          aria-label="Your answer to the math problem"
        />

        {error && (
          <p className="text-xs font-bold text-center mb-2 text-red-500" aria-live="polite">
            Hmm, not quite — try this new one.
          </p>
        )}

        {/* Remember me */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded accent-lotus"
          />
          <span className="text-xs font-medium text-ink-soft">
            Remember me for 30 minutes
          </span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-full font-bold text-sm text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!value}
            className="flex-1 bg-lotus text-primary-foreground py-3 rounded-full font-bold text-sm hover:bg-lotus-deep disabled:opacity-40 transition-colors"
          >
            Enter
          </button>
        </div>
      </form>
    </div>
  );
}
