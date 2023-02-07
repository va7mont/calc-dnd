export default function Display(props) {
  return (
    <div className='p-2'>
      <div className='rounded-2 bg-grey text-end p-3'>
        {props.currentOperand !== undefined ? props.currentOperand : 0}
      </div>
    </div>
  )
}