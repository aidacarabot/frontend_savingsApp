import { useState } from "react";
import GoalBox from "../components/GoalBox/GoalBox";
import GoalForm from "../components/GoalForm/GoalForm";
import GoalsDistribution from "../components/GoalsDistribution/GoalsDistribution";
import { FinancialProvider } from "../context/FinancialContext";
import Title from "../components/Title/Title";
import { ChessQueen } from 'lucide-react';


const Goals = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [refreshGoals, setRefreshGoals] = useState(0);
  const [refreshDistribution, setRefreshDistribution] = useState(0);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddNewGoal = () => {
    setEditingGoal(null);
    setShowGoalForm(true);
  };

  const handleCloseForm = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleGoalAdded = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
    setRefreshGoals((prev) => prev + 1);
    setRefreshDistribution((prev) => prev + 1);
  };

  const handleGoalUpdated = () => {
    setRefreshDistribution((prev) => prev + 1);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  return (
    <FinancialProvider>
      <div className="goals-page">
        <div className="goals-page-header">
          <Title icon={<ChessQueen size={30} color="#27ebc8" />} title="GOALS" className="title-transactions" />
          <button className="goals-add-btn" onClick={handleAddNewGoal}>
            + Add
          </button>
        </div>

        <GoalsDistribution refreshTrigger={refreshDistribution} />

        <div className="goals-section-label">Your Goals</div>

        <div className="goals-list-scroll">
        <GoalBox
            onGoalUpdated={handleGoalUpdated}
            onEditGoal={handleEditGoal}
            refreshTrigger={refreshGoals}
          />
        </div>

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
