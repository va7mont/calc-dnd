export default function Display(props) {
  return (
    <div className='p-2'>
      <div className='Font-ExtraBold fs-1 rounded-2 bg-grey text-end py-2 px-3'>
        {props.currentOperand !== undefined ? props.currentOperand : 0}
      </div>
    </div>
  )
}