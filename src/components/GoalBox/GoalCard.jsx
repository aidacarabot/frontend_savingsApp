import { Minus, Plus, ChevronDown } from 'lucide-react';
import CircularProgress from './CircularProgress';
import DropDown from '../DropDown/DropDown';
import Button from '../Button/Button';
import { getGoalIcon, calculateAgeAtCompletion, calculateCompletionPercentage, formatCurrency } from './goalBoxUtils';

const GoalCard = ({
  goal,
  available,
  loadingFinancial,
  addVal,
  removeVal,
  onAddValChange,
  onRemoveValChange,
  isExpanded,
  onToggleExpand,
  onAddFunds,
  onRemoveFunds,
  onDeleteRequest,
  onEditRequest,
  birthDate,
}) => {
  const currentAmount = goal.currentAmount || 0;
  const percentage = calculateCompletionPercentage(currentAmount, goal.targetAmount);
  const isCompleted = currentAmount >= goal.targetAmount;
  const GoalIcon = getGoalIcon(percentage, isCompleted);
  const ageAtCompletion = calculateAgeAtCompletion(goal.completionDate, birthDate);
  const remaining = goal.targetAmount - currentAmount;
  const maxAdd = loadingFinancial ? remaining : Math.min(remaining, Math.max(0, available));
  const effectiveMonthly = Math.min(goal.monthlyContribution || 0, maxAdd);
  const noFreeBalance = !loadingFinancial && available <= 0;
  const addIsOver = addVal !== '' && parseFloat(addVal) > maxAdd && maxAdd > 0;
  const removeIsOver = removeVal !== '' && parseFloat(removeVal) > currentAmount;

  return (
    <div className={`gb-card${isCompleted ? ' gb-card-completed' : ''}${isCompleted && !isExpanded ? ' gb-card-collapsed' : ''}`}>
      {isCompleted ? (
        <div className="gb-card-header gb-card-header-collapsible" onClick={onToggleExpand}>
          <div className="gb-card-title-row">
            <h3 className="gb-card-name">
              <GoalIcon size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
              {goal.goalName}
            </h3>
            <span className="gb-completed-badge">Completed</span>
          </div>
          <ChevronDown size={18} color="var(--color-text-tertiary)" className={`gb-chevron${isExpanded ? ' gb-chevron-up' : ''}`} />
        </div>
      ) : (
        <div className="gb-card-header">
          <div className="gb-card-title-row">
            <h3 className="gb-card-name">
              <GoalIcon size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
              {goal.goalName}
            </h3>
          </div>
          <DropDown transactionId={goal._id} onDeleteRequest={onDeleteRequest} onEditRequest={onEditRequest} />
        </div>
      )}

      {isExpanded && (
        <div className="gb-card-body">
          <CircularProgress percentage={percentage} completed={isCompleted} />
          <div className="gb-card-info">
            <div className="gb-card-amounts">
              <span className={`gb-current${isCompleted ? ' gb-current-done' : ''}`}>{formatCurrency(currentAmount)}</span>
              <span className="gb-separator">/</span>
              <span className="gb-target">{formatCurrency(goal.targetAmount)}</span>
            </div>
            <div className="gb-card-stats">
              <div className="gb-stat">
                <span className="gb-stat-label">Monthly</span>
                <span className="gb-stat-value">${goal.monthlyContribution ? goal.monthlyContribution.toFixed(0) : '0'}/mo</span>
              </div>
              <div className="gb-stat">
                <span className="gb-stat-label">Deadline</span>
                <span className="gb-stat-value">
                  {goal.completionDate ? new Date(goal.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '--'}
                </span>
              </div>
              <div className="gb-stat">
                <span className="gb-stat-label">Age</span>
                <span className="gb-stat-value">{ageAtCompletion > 0 ? `${ageAtCompletion} yrs` : '--'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExpanded && !isCompleted && (
        <div className="gb-actions">
          {noFreeBalance && <div className="gb-no-balance">No free balance available to allocate</div>}
          <div className="gb-action-inputs">
            <div className={`gb-input-action gb-remove${removeIsOver ? ' gb-remove-over' : ''}`}>
              <Minus className="gb-action-symbol" size={14} />
              <input
                type="number" value={removeVal}
                onChange={(e) => onRemoveValChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && removeVal && parseFloat(removeVal) > 0 && !removeIsOver) onRemoveFunds(goal._id, removeVal); }}
                placeholder="Remove"
                className={`gb-action-input${removeIsOver ? ' gb-input-remove-over' : ''}`}
                min="0" max={currentAmount} step="0.01"
              />
              {removeIsOver && <div className="gb-remove-tooltip">Max ${currentAmount.toFixed(0)} saved</div>}
              {removeVal && parseFloat(removeVal) > 0 && !removeIsOver && (
                <Button className="gb-action-confirm gb-confirm-remove" onClick={() => onRemoveFunds(goal._id, removeVal)} text="OK" />
              )}
            </div>

            <Button
              className={`gb-monthly-btn${effectiveMonthly < (goal.monthlyContribution || 0) && effectiveMonthly > 0 ? ' gb-monthly-btn-partial' : ''}`}
              onClick={() => onAddFunds(goal._id, effectiveMonthly)}
              disabled={maxAdd <= 0}
              title={effectiveMonthly < (goal.monthlyContribution || 0) && effectiveMonthly > 0
                ? `Only $${effectiveMonthly.toFixed(0)} available (monthly: $${(goal.monthlyContribution || 0).toFixed(0)})`
                : undefined}
              text={<><Plus size={14} /> ${effectiveMonthly > 0 ? effectiveMonthly.toFixed(0) : (goal.monthlyContribution ? goal.monthlyContribution.toFixed(0) : '0')} monthly</>}
            />

            <div className={`gb-input-action gb-add${maxAdd <= 0 ? ' gb-add-locked' : addIsOver ? ' gb-add-over' : ''}`}>
              <Plus className="gb-action-symbol" size={14} />
              <input
                type="number" value={addVal}
                onChange={(e) => onAddValChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && addVal && parseFloat(addVal) > 0 && !addIsOver) onAddFunds(goal._id, addVal); }}
                placeholder={maxAdd <= 0 ? 'No balance' : 'Add'}
                className={`gb-action-input${addIsOver ? ' gb-input-over' : ''}`}
                min="0" max={maxAdd} step="0.01" disabled={maxAdd <= 0}
              />
              {addIsOver && <div className="gb-add-tooltip">Max ${maxAdd.toFixed(0)} free</div>}
              {addVal && parseFloat(addVal) > 0 && maxAdd > 0 && !addIsOver && (
                <Button className="gb-action-confirm gb-confirm-add" onClick={() => onAddFunds(goal._id, addVal)} text="OK" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
