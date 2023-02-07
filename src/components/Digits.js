import BtnBlock from "./BtnBlock";

export default function Digits(props) {

  const btnsList = [
    {
      label: "1",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(1) }
    },
    {
      label: "2",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(2) }
    },
    {
      label: "3",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(3) }
    },
    {
      label: "4",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(4) }
    },
    {
      label: "5",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(5) }
    },
    {
      label: "6",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(6) }
    },
    {
      label: "7",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(7) }
    },
    {
      label: "8",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(8) }
    },
    {
      label: "9",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(9) }
    },
    {
      label: "0",
      size: 8,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(0) }
    },
    {
      label: ",",
      size: 4,
      className: "bg-white text-black",
      onClick: () => { props.isInProduction && props.onClick(",") }
    },
  ];

  return (
    <BtnBlock buttons={btnsList} disabled={props.disabled} />
  )
}