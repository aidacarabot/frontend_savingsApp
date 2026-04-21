import { ArrowRightLeft } from 'lucide-react';
import DropDown from '../DropDown/DropDown';
import { getCategoryStyle, getIconComponent, formatAmount } from './transactionBoxUtils';

const TransactionItem = ({ transaction, isLast, lastRef, onDeleteRequest, onEditRequest }) => {
  const style = getCategoryStyle(transaction);
  const IconComponent = getIconComponent(style.icon);

  return (
    <div className="transaction-item" ref={isLast ? lastRef : null}>
      <div className="transaction-icon-wrapper">
        <div className="transaction-icon-circle" style={{ backgroundColor: style.color }}>
          <IconComponent className="transaction-icon" strokeWidth={2} />
        </div>
      </div>

      <div className="transaction-details">
        <h3 className="transaction-name">{transaction.name}</h3>
      </div>

      <div className="transaction-category-center">
        <ArrowRightLeft className={`category-icon ${transaction.type === 'Income' ? 'category-income' : 'category-expense'}`} />
        <p className={`transaction-category ${transaction.type === 'Income' ? 'category-income' : 'category-expense'}`}>
          {transaction.category || transaction.type}
        </p>
      </div>

      <div className="transaction-right">
        <p className={transaction.type === 'Income' ? 'income-amount' : 'expense-amount'}>
          {transaction.type === 'Income' ? '+' : '-'}${formatAmount(transaction.amount)}
        </p>
        <DropDown
          transactionId={transaction._id}
          onDeleteRequest={onDeleteRequest}
          onEditRequest={onEditRequest}
        />
      </div>
    </div>
  );
};

export default TransactionItem;
