import { Container, Row, Col, Button } from "react-bootstrap";

export default function BtnBlock(props) {
  return (
    <Container fluid className="px-0">
      <Row className='m-0'>
        {props.buttons.map(btn => (
          <Col xs={btn.size} className='p-2' key={btn.label}>
            <Button
              className={`
                ${btn.className ? btn.className : ""}
                ${props.active === btn.label ? "border-primary" : "border-grey-10"}
                fs-5 w-100 rounded-2 border border-1 py-3
              `}
              onClick={btn.onClick}
              disabled={props.disabled}
            >
              {btn.label}
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  )
}