function StepsPath({ steps }: { steps: any }) {
  return (
    steps.length && (
      <div className="steps-visualization">
        {steps.map((step: string, index: any) => {
          return (
            <div>
              <h4>Step {index + 1}:</h4> <h5>{step}</h5>
            </div>
          );
        })}
      </div>
    )
  );
}

export default StepsPath;