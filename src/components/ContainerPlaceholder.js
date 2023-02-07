import { Container, Row, Col } from "react-bootstrap";
import newBlock from '../assets/images/add_new_block.svg';

export default function ContainerPlaceholder() {

  const onDragEnter = (event) => {
    event.preventDefault();
    event.target.classList.add("bg-blue");
  }

  const onDragLeave = (event) => {
    event.preventDefault();
    event.target.classList.remove("bg-blue");
  }

  return (
    <Container onDragEnter={onDragEnter} onDragLeave={onDragLeave} fluid className="blocks-placeholder border border-2 border-dashed border-grey-30 px-0">
      <Row className='blocks-placeholder justify-content-center align-items-center m-0'>
        <Col lg="auto" className='text-center px-0'>
          <img src={newBlock} className='img-fluid mb-3' alt="new block" />
          <p className='fs-5 text-primary mb-1'>Перетащите сюда</p>
          <p className='fs-6 text-grey-20 mb-1'>любой элемент</p>
          <p className='fs-6 text-grey-20 mb-1'>из левой панели</p>
        </Col>
      </Row>
    </Container>
  )
}