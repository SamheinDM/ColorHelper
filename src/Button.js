export default function Button (props) {
  return <button onClick={props.clickHandler} disabled={props.isDisabled}>{props.name}</button>;
}
