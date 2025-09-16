import Button from "../components/Button/Button"
import GoalBox from "../components/GoalBox/GoalBox"
import GoalForm from "../components/GoalForm/GoalForm"



const Goals = () => {
  return (
    <div className='goals-container'>
      <h2>Goals</h2>
      <Button text="+ Add New Goal" onClick={() => {}} /> 
      <GoalBox />
      <GoalForm />
    </div>
  )
}

export default Goals