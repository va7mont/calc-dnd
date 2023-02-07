import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Theme.scss';
import './styles/App.scss';

import { Container, Row, Col } from 'react-bootstrap';
import ModeToggle from './components/ModeToggle';
import Display from './components/Display';
import Operators from './components/Operators';
import Digits from './components/Digits';
import Equals from './components/Equals';
import ContainerPlaceholder from './components/ContainerPlaceholder';

export default function App() {

  const [isInProduction, setIsInProduction] = useState(false);
  const [movingBlock, setMovingBlock] = useState(null);
  const [currentOperand, setCurrentOperand] = useState(0);
  const [clearValueToDisplay, setClearValueToDisplay] = useState(false);
  const [addFloatingPoint, setAddFloatingPoint] = useState(false);
  const [operandMem, setOperandMem] = useState(null);
  const [operator, setOperator] = useState(null);
  const [blocks, setBlocks] = useState([
    {
      name: "display",
      component: Display,
      dropped: false,
      order: 0
    },
    {
      name: "operators",
      component: Operators,
      dropped: false,
      order: 1
    },
    {
      name: "digits",
      component: Digits,
      dropped: false,
      order: 2
    },
    {
      name: "equals",
      component: Equals,
      dropped: false,
      order: 3
    }
  ]);

  const toggleMode = (mode) => {
    setIsInProduction(mode);
    setCurrentOperand(0);
    setOperandMem(null);
    setOperator(null);
    setAddFloatingPoint(false);
    setClearValueToDisplay(false);
  }

  const handleCalc = (val) => {
    if (typeof val === "number") {
      if (clearValueToDisplay) {
        setCurrentOperand(+val);
        setClearValueToDisplay(false);
      } else {
        if (addFloatingPoint) {
          setCurrentOperand(`${currentOperand}.${val}`);
          setAddFloatingPoint(false);
        } else {
          setCurrentOperand(currentOperand > 0 ? +`${currentOperand}${val}` : val);
        }
      }
    } else if (val === ",") {
      if (+currentOperand % 1 === 0) {
        setAddFloatingPoint(true);
      }
    } else if (val === "=") {
      if (operandMem && operator && currentOperand) {
        setCurrentOperand(eval(operandMem + operator + currentOperand));
        setOperandMem(null);
        setOperator(null);
        setClearValueToDisplay(true);
      }
    } else {
      setOperandMem(+currentOperand);
      setOperator(val);
      setClearValueToDisplay(true);
    }
  }

  const startMovingBlock = (event, id) => {
    event.dataTransfer.setData("id", id);
    setMovingBlock(id);
  }

  const moveBlockOnDrop = (id, dropped) => {
    let newBlocks = blocks.filter(block => {
      if (block.name === id) block.dropped = dropped;
      return block;
    });

    setBlocks([...newBlocks]);
  }

  const rearrangeBlocks = (event, id) => {
    event.preventDefault();
    removeDivider(event, id);
    setBlocks(blocks => blocks.map(block => {
      if (block.name === id) {
        block.order = blocks.findIndex(el => el.name === movingBlock);
      }
      if (block.name === movingBlock) {
        block.order = blocks.findIndex(el => el.name === id);
      }
      return block;
    }))
  }

  const addDivider = (event) => {
    event.preventDefault();
    if (event.currentTarget.classList.contains("parent-block")) {
      event.currentTarget.classList.add('divider');
    }
  }

  const removeDivider = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('divider');
  }

  const getAllBlocks = () => {
    const blocksToRender = [];

    blocks.forEach(block => {
      blocksToRender.push(
        <Col
          xs={12}
          className={`${block.dropped ? "opacity-50" : ""} cursor-move px-0 pb-3`}
          draggable={!isInProduction && !block.dropped}
          onDragStart={e => startMovingBlock(e, block.name)}
          key={block.name}
        >
          <div className='bg-white shadow-md rounded-1'>
            <block.component dropped={block.dropped} />
          </div>
        </Col>
      );
    });

    return blocksToRender;
  }

  const getDroppedBlocks = () => {
    const blocksToRender = [];

    blocks.forEach(block => {
      if (block.dropped) {
        blocksToRender.push(
          <Col
            xs={12}
            className={`order-lg-${block.order} parent-block px-0 pb-2`}
            key={block.name}
            id={block.name}
            draggable={!isInProduction}
            onDragStart={e => startMovingBlock(e, block.name)}
            onDragOver={addDivider}
            onDragLeave={removeDivider}
            onDrop={e => rearrangeBlocks(e, block.name)}
            onDoubleClick={() => { !isInProduction && moveBlockOnDrop(block.name, false) }}
          >
            <block.component
              currentOperand={currentOperand}
              onClick={handleCalc}
              isInProduction={isInProduction}
              selectedOperator={operator === "*" ? "x" : operator}
            />
          </Col>
        );
      }
    });

    if (blocksToRender.length > 0) return blocksToRender
    else return <ContainerPlaceholder />;
  }

  return (
    <div className='App'>
      <Container className='p-5'>

        <Row className='justify-content-center mb-4 mx-0'>
          <Col lg={4} className='px-5' />
          <Col lg={4} className='px-5'>
            <ModeToggle isInProduction={isInProduction} toggleMode={toggleMode} />
          </Col>
        </Row>

        <Row className='justify-content-center m-0'>
          <Col lg={4} className='px-5'>
            {!isInProduction &&
              <Container fluid className='px-0'>
                <Row
                  className='m-0'
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { moveBlockOnDrop(e.dataTransfer.getData("id"), false) }}
                >
                  {getAllBlocks()}
                </Row>
              </Container>
            }
          </Col>

          <Col lg={4} className='px-5'>
            <Container fluid className='px-0'>
              <Row
                className='blocks-placeholder flex-column m-0'
                onDragOver={e => e.preventDefault()}
                onDrop={e => { moveBlockOnDrop(e.dataTransfer.getData("id"), true) }}
              >
                {getDroppedBlocks()}
              </Row>
            </Container>
          </Col>
        </Row>

      </Container>
    </div >
  );
}
