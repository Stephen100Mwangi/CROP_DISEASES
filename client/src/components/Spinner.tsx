import { FaSpinner } from "react-icons/fa6";
import PropTypes from "prop-types";

interface SpinnerProps{
    text:string
}

const Spinner:React.FC<SpinnerProps> = ({text}) => {
  return (
    <div className="flex space-x-5 items-center justify-center mx-auto">
      <p>{text}</p>
      <FaSpinner className="animate-spin"></FaSpinner>
    </div>
  )
}

Spinner.propTypes ={
    text:PropTypes.string.isRequired
}

export default Spinner
