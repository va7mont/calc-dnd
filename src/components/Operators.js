import BtnBlock from "./BtnBlock";

export default function Operators(props) {
  const btnsList = [
    {
      label: "/",
      size: 3,
      className: "bg-white text-black",
      onClick: () => { props.onClick("/") }
    },
    {
      label: "x",
      size: 3,
      className: "bg-white text-black",
      onClick: () => { props.onClick("*") }
    },
    {
      label: "-",
      size: 3,
      className: "bg-white text-black",
      onClick: () => { props.onClick("-") }
    },
    {
      label: "+",
      size: 3,
      className: "bg-white text-black",
      onClick: () => { props.onClick("+") }
    }
  ];

  return (
    <BtnBlock active={props.selectedOperator} buttons={btnsList} disabled={props.disabled} />
  )
}