import { Check } from 'lucide-react';

const CircularProgress = ({ percentage, completed }) => {
  const radius = 44;
  const stroke = 5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', flexShrink: 0, width: radius * 2, height: radius * 2 }}>
      <svg width={radius * 2} height={radius * 2} className="gb-ring">
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke="var(--color-border)" strokeWidth={stroke} />
        <circle
          cx={radius} cy={radius} r={normalizedRadius} fill="none"
          stroke="var(--color-primary)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="gb-ring-progress"
        />
        {!completed && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="gb-ring-text">
            {`${Math.round(percentage)}%`}
          </text>
        )}
      </svg>
      {completed && (
        <Check
          size={22}
          color="var(--color-primary)"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      )}
    </div>
  );
};

export default CircularProgress;
