/** A project's pipeline as a top-to-bottom chain of stages. */
export function FlowDiagram({ steps, label }: { steps: readonly string[]; label: string }) {
  return (
    <div className="panel flow">
      <ol className="flow-steps" aria-label={label}>
        {steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </div>
  );
}
