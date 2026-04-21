const GoalFormSummary = ({ totalGoal, calculatedData }) => (
  <div className="gf-summary">
    <h3 className="gf-summary-title">Goal Summary</h3>
    <div className="gf-summary-grid">
      <div className="gf-summary-item">
        <span className="gf-summary-label">Monthly Needed</span>
        <span className="gf-summary-value">
          {totalGoal && totalGoal > 0 && calculatedData.monthlySavingsNeeded > 0
            ? `$${calculatedData.monthlySavingsNeeded.toFixed(2)}`
            : '\u2014'}
        </span>
      </div>
      <div className="gf-summary-item">
        <span className="gf-summary-label">Target Date</span>
        <span className="gf-summary-value">
          {totalGoal && totalGoal > 0 && calculatedData.calculatedCompletionDate
            ? new Date(calculatedData.calculatedCompletionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : '\u2014'}
        </span>
      </div>
      <div className="gf-summary-item">
        <span className="gf-summary-label">Your Age</span>
        <span className="gf-summary-value">
          {totalGoal && totalGoal > 0 && calculatedData.ageAtCompletion > 0
            ? `${calculatedData.ageAtCompletion} years`
            : '\u2014'}
        </span>
      </div>
    </div>
  </div>
);

export default GoalFormSummary;
