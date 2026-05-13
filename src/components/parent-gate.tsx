import { useMemo, useState } from "react";

type Problem = { a: number; b: number };

function makeProblem(): Problem {
  // Two-digit + one-digit addition — easy for adults, hard for little ones.
  const a = 11 + Math.floor(Math.random() * 38); // 11-48
  const b = 13 + Math.floor(Math.random() * 35); // 13-47
  return { a, b };
}

export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [problem, setProblem] = useState<Problem>(() => makeProblem());
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const answer = useMemo(() => problem.a + problem.b, [problem]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(value, 10) === answer) {
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
        />
        {error && (
          <p className="text-xs text-saffron-deep font-bold text-center mb-2" aria-live="polite">
            Hmm, not quite — try this new one.
          </p>
        )}

        <div className="flex gap-2 mt-3">
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
            className="flex-1 bg-lotus text-primary-foreground py-3 rounded-full font-bold text-sm hover:bg-lotus-deep disabled:opacity-40"
          >
            Enter
          </button>
        </div>
      </form>
    </div>
  );
}
