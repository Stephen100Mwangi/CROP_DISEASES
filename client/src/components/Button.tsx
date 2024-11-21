import PropTypes from 'prop-types'
interface ButtonProps {
    text:string,
    color:string,
    textColor:string,
    clickFunction: () => void
}

const Button:React.FC<ButtonProps> = ({text,color,textColor,clickFunction}) => {
  return (
    <button onClick={clickFunction} className={`bg-${color} text-${textColor} hover:bg-${textColor} hover:text-${color} rounded-full hover:shadow-xl p-3 px-10 border`}>
        {text}      
    </button>
   
  )
}

Button.propTypes = {
    text:PropTypes.string.isRequired,
    color:PropTypes.string.isRequired,
    textColor:PropTypes.string.isRequired,
    clickFunction: PropTypes.func.isRequired
}

export default Button
