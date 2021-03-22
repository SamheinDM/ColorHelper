export default function Button (props) {
  return <button onClick={props.clickHandler}>{props.name}</button>;
}
