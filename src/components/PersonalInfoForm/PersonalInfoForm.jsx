import { House, ShoppingCart, Beer, Car, ShoppingBag, Drama, HeartPulse, Plane, Landmark, Coins, ChartNoAxesCombined, BarChart2 } from 'lucide-react';
import useApiFetch from "../../hooks/useApiFetch";
import useCalculateAge from "../../hooks/useCalculateAge";
import useProfileEditor from "../../hooks/useProfileEditor";
import ProfilePictureEdit from '../ProfilePictureEdit/ProfilePictureEdit';
import Loader from "../Loader/Loader";
import { ErrorMessage } from '../Messages/Messages';
import { CATEGORIES, CATEGORY_STYLES } from '../../utils/constants';
import Button from '../Button/Button';
import './PersonalInfoForm.css';

const LUCIDE_ICONS = { House, ShoppingCart, Beer, Car, ShoppingBag, Drama, HeartPulse, Plane, Landmark, Coins, ChartNoAxesCombined };

const CategoryIcon = ({ category, size = 14 }) => {
  const style = CATEGORY_STYLES[category];
  const Icon = style ? (LUCIDE_ICONS[style.icon] || Coins) : Coins;
  return <Icon size={size} />;
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const PersonalInfoForm = () => {
  const { responseData, loading, error, refetch } = useApiFetch('/users', 'GET');

  const {
    isEditingProfile,
    setIsEditingProfile,
    editedProfile,
    handleProfileChange,
    handleSave
  } = useProfileEditor(responseData, refetch);

  const age = useCalculateAge(responseData?.birthDate);

  const expenses = responseData?.monthlyExpectedExpenses || {};
  const totalExpectedExpenses = CATEGORIES.reduce((sum, cat) => sum + (Number(expenses[cat]) || 0), 0);
  const monthlySalary = responseData?.monthlySalary || 0;
  const savingsPotential = monthlySalary - totalExpectedExpenses;
  const expenseRatio = monthlySalary > 0 ? Math.min((totalExpectedExpenses / monthlySalary) * 100, 100) : 0;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage text={`Error: ${error.message}`} duration={null} />;

  // Always iterate over the fixed CATEGORIES list
  const expenseSource = isEditingProfile ? editedProfile.monthlyExpectedExpenses : expenses;

  return (
    <div className='pif-wrapper'>

      {/* ── Top: avatar + name/age ── */}
      <div className='pif-top'>
        <ProfilePictureEdit />
        <div className='pif-identity'>
          <h2 className='pif-name'>{responseData?.name}</h2>
          <span className='pif-age-badge'>{age} yrs</span>
        </div>
      </div>

      {/* ── Monthly Income ── */}
      <div className='pif-card'>
        <div className='pif-card-label'>
          <ChartNoAxesCombined size={14} />
          Monthly Income
        </div>
        {isEditingProfile ? (
          <div className='pif-input-row'>
            <span className='pif-currency-prefix'>$</span>
            <input
              type='text'
              inputMode='decimal'
              value={editedProfile.monthlySalary === '0' ? '' : editedProfile.monthlySalary}
              onChange={(e) =>
                handleProfileChange('monthlySalary', e.target.value.replace(/[^0-9.]/g, ''))
              }
              placeholder='0'
              autoComplete='off'
              className='pif-input'
            />
          </div>
        ) : (
          <p className='pif-card-value pif-income'>${formatCurrency(monthlySalary)}</p>
        )}
      </div>

      {/* ── Expenses ── */}
      <div className='pif-section-label'>
        <BarChart2 size={13} />
        Expected Monthly Expenses
      </div>

      <ul className='pif-expenses-list'>
        {CATEGORIES.map((category) => {
          const amount = expenseSource[category] ?? 0;
          return (
          <li key={category} className='pif-expense-item'>
            <span className='pif-expense-icon'>
              <CategoryIcon category={category} size={13} />
            </span>
            <span className='pif-expense-name'>{category}</span>
            {isEditingProfile ? (
              <div className='pif-input-row pif-input-row--inline'>
                <span className='pif-currency-prefix'>$</span>
                <input
                  type='text'
                  inputMode='decimal'
                  value={amount === 0 ? '' : amount}
                  onChange={(e) =>
                    handleProfileChange(
                      'monthlyExpectedExpenses',
                      e.target.value.replace(/[^0-9.]/g, ''),
                      category
                    )
                  }
                  placeholder='0'
                  autoComplete='off'
                  className='pif-input pif-input--sm'
                />
              </div>
            ) : (
              <span className='pif-expense-amount'>${formatCurrency(amount)}</span>
            )}
          </li>
          );
        })}
      </ul>

      {/* ── Summary ── */}
      <div className='pif-summary'>
        <div className='pif-summary-row'>
          <span className='pif-summary-label'>Total expenses</span>
          <span className='pif-summary-total'>${formatCurrency(totalExpectedExpenses)}</span>
        </div>
        {monthlySalary > 0 && (
          <>
            <div className='pif-progress-bar'>
              <div className='pif-progress-fill' style={{ width: `${expenseRatio}%` }} />
            </div>
            <div className='pif-savings-row'>
              <span className='pif-savings-label'>Savings potential</span>
              <span className={`pif-savings-value ${savingsPotential >= 0 ? 'pif-savings--positive' : 'pif-savings--negative'}`}>
                {savingsPotential >= 0 ? '+' : ''}${formatCurrency(savingsPotential)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Actions ── */}
      <div className='pif-actions'>
        {!isEditingProfile ? (
          <Button className='pif-btn pif-btn--outline' onClick={() => setIsEditingProfile(true)} text="Edit Profile" />
        ) : (
          <>
            <Button className='pif-btn pif-btn--ghost' onClick={() => setIsEditingProfile(false)} text="Cancel" />
            <Button className='pif-btn pif-btn--primary' onClick={handleSave} text="Save Changes" />
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;