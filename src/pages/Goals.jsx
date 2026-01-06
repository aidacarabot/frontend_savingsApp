import { useState } from "react";
import Button from "../components/Button/Button";
import GoalBox from "../components/GoalBox/GoalBox";
import GoalForm from "../components/GoalForm/GoalForm";
import GoalsDistribution from "../components/GoalsDistribution/GoalsDistribution";
import { FinancialProvider } from "../context/FinancialContext";

const Goals = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [refreshGoals, setRefreshGoals] = useState(0);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddNewGoal = () => {
    setEditingGoal(null); // Asegurarse de que no hay goal en edición
    setShowGoalForm(true);
  };

  const handleCloseForm = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleGoalAdded = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
    setRefreshGoals((prev) => prev + 1); // Trigger refresh
  };

  const handleGoalUpdated = () => {
    setRefreshGoals((prev) => prev + 1); // Trigger refresh
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  return (
    <FinancialProvider>
      <div className="goals-container">
        <GoalsDistribution />
        <Button text="+ Add New Goal" onClick={handleAddNewGoal} />
        <h2>🎯 YOUR GOALS</h2>
        <GoalBox
          key={refreshGoals}
          onGoalUpdated={handleGoalUpdated}
          onEditGoal={handleEditGoal}
        />

        {/* Mostrar GoalForm cuando showGoalForm es true */}
        {showGoalForm && (
          <GoalForm
            onClose={handleCloseForm}
            onGoalAdded={handleGoalAdded}
            initialData={editingGoal}
            isEditing={!!editingGoal}
          />
        )}
      </div>
    </FinancialProvider>
  );
};

export default Goals;