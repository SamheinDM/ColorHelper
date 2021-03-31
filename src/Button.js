export default function Button (props) {
  return <button 
    onBlur={props.onBlur}
    onClick={props.clickHandler} 
    disabled={props.isDisabled}
    className={`button${props.isDisabled ? ' inactive' : ''}`}
    >
      {props.name}
    </button>;
}
