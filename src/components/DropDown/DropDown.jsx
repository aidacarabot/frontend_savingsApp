import './DropDown.css';

const DropDown = () => {
  return (
    <div className="select">
      <div className="selected">
        <span className="dots">...</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className="arrow"
        >
          <path
            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
          ></path>
        </svg>
      </div>
      <div className="options">
        <div title="option-edit">
          <input
            id="option-edit"
            name="option"
            type="radio"
          />
          <label className="option" htmlFor="option-edit" data-txt="Edit"></label>
        </div>
        <div title="option-delete">
          <input
            id="option-delete"
            name="option"
            type="radio"
          />
          <label className="option" htmlFor="option-delete" data-txt="Delete"></label>
        </div>
      </div>
    </div>
  );
};

export default DropDown;