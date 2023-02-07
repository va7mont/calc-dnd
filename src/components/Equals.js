import BtnBlock from "./BtnBlock";

export default function Equals(props) {
  const btnsList = [
    {
      label: "=",
      size: 12,
      className: "bg-primary",
      onClick: () => { props.isInProduction && props.onClick("=") }
    }
  ];

  return (
    <BtnBlock buttons={btnsList} disabled={props.disabled} />
  )
}