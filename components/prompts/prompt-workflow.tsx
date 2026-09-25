import type { PromptWorkflow as Workflow } from "@/content/prompt-workflows";

export function PromptWorkflow({ workflow }: { workflow?: Workflow }) {
  if (!workflow) return null;
  return (
    <section
      className="section prompt-workflow"
      aria-labelledby="workflow-heading"
    >
      <div className="section-head">
        <div>
          <div className="eyebrow">From idea to a result you can use</div>
          <h2 id="workflow-heading">Try this look, step by step</h2>
          <p>
            Practical guidance. Results depend on your reference and image tool.
          </p>
        </div>
      </div>
      <div className="reel-scenes">
        <div className="reel-scene">
          <h3>Before you start</h3>
          <p>{workflow.preparation}</p>
        </div>
        <div className="reel-scene">
          <h3>Make it yours</h3>
          <ol className="list-decimal pl-5 space-y-3">
            {workflow.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      <div className="faq">
        <h3>If the result misses the idea</h3>
        <p>
          Use the relevant correction as a follow-up in the same image
          conversation. These are suggested edits, not guaranteed fixes.
        </p>
        {workflow.fixes.map((fix) => (
          <details key={fix.symptom}>
            <summary>{fix.symptom}</summary>
            <blockquote className="mt-3">{fix.correction}</blockquote>
          </details>
        ))}
      </div>
      <div className="reel-scene mt-5">
        <h3>Before you save or share</h3>
        <ul className="list-disc pl-5 space-y-2">
          {workflow.checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
