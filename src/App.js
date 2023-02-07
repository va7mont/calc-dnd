import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Theme.scss';
import './styles/App.scss';

import { Container, Row, Col } from 'react-bootstrap';
import Display from './components/Display';
import Operators from './components/Operators';
import Digits from './components/Digits';
import Equals from './components/Equals';
import ContainerPlaceholder from './components/ContainerPlaceholder';

function App() {

  const [isInProduction, setIsInProduction] = useState(false);
  const [currentOperand, setCurrentOperand] = useState(0);
  const [clearValueToDisplay, setClearValueToDisplay] = useState(false);
  const [addFloatingPoint, setAddFloatingPoint] = useState(false);
  const [operandMem, setOperandMem] = useState(null);
  const [operator, setOperator] = useState(null);
  const [blocks, setBlocks] = useState([
    {
      name: "display",
      component: Display,
      dropped: false
    },
    {
      name: "operators",
      component: Operators,
      dropped: false
    },
    {
      name: "digits",
      component: Digits,
      dropped: false
    },
    {
      name: "equals",
      component: Equals,
      dropped: false
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

  const handleClick = (val) => {
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

  const onDragStart = (event, id) => {
    event.dataTransfer.setData("id", id);
  }

  const onDrop = (id, dropped) => {
    let newBlocks = blocks.filter(block => {
      if (block.name === id) block.dropped = dropped;
      return block;
    });

    setBlocks([...newBlocks]);
  }

  const getAllBlocks = () => {
    const blocksToRender = [];

    blocks.forEach(block => {
      blocksToRender.push(
        <Col
          xs={12}
          className={`${block.dropped ? "opacity-50" : ""} px-0 pb-3`}
          draggable={!isInProduction && !block.dropped}
          onDragStart={e => onDragStart(e, block.name)}
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
            className='px-0 pb-3'
            draggable={!isInProduction}
            onDragStart={e => onDragStart(e, block.name)}
            key={block.name}
            onDoubleClick={() => { !isInProduction && onDrop(block.name, false) }}
          >
            <div className='bg-white shadow-md rounded-1'>
              <block.component
                currentOperand={currentOperand}
                onClick={handleClick}
                isInProduction={isInProduction}
                selectedOperator={operator === "*" ? "x" : operator}
              />
            </div>
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
            <div className="switches-container">
              <input type="radio" id="switchRuntime" name="switchPlan" value="Runtime" checked={isInProduction} onChange={() => toggleMode(true)} />
              <input type="radio" id="switchConstructor" name="switchPlan" value="Constructor" checked={!isInProduction} onChange={() => toggleMode(false)} />
              <label className='d-flex align-items-center justify-content-center' htmlFor="switchRuntime">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678Z" stroke="#4D5562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.04834 9.99999C3.11001 6.61916 6.26917 4.16666 10 4.16666C13.7317 4.16666 16.89 6.61916 17.9517 9.99999C16.89 13.3808 13.7317 15.8333 10 15.8333C6.26917 15.8333 3.11001 13.3808 2.04834 9.99999Z" stroke="#4D5562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className='ps-2'>Runtime</span>
              </label>
              <label className='d-flex align-items-center justify-content-center' htmlFor="switchConstructor">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.49984 13.3333L4.1665 10L7.49984 6.66668M12.4998 6.66668L15.8332 10L12.4998 13.3333" stroke="#4D5562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className='ps-2'>Constructor</span>
              </label>
              <div className="switch-wrapper">
                <div className="switch">
                  <div className='d-flex align-items-center justify-content-center'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678Z" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2.04834 9.99999C3.11001 6.61916 6.26917 4.16666 10 4.16666C13.7317 4.16666 16.89 6.61916 17.9517 9.99999C16.89 13.3808 13.7317 15.8333 10 15.8333C6.26917 15.8333 3.11001 13.3808 2.04834 9.99999Z" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className='ps-2'>Runtime</span>
                  </div>
                  <div className='d-flex align-items-center justify-content-center'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.49984 13.3333L4.1665 10L7.49984 6.66668M12.4998 6.66668L15.8332 10L12.4998 13.3333" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className='ps-2'>Constructor</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className='justify-content-center m-0'>
          <Col lg={4} className='px-5'>
            <Container fluid className='px-0'>
              <Row
                className='m-0'
                onDragOver={e => e.preventDefault()}
                onDrop={e => { onDrop(e.dataTransfer.getData("id"), false) }}
              >
                {getAllBlocks()}
              </Row>
            </Container>
          </Col>
          <Col lg={4} className='px-5'>
            <Container fluid className='px-0'>
              <Row
                className='blocks-placeholder flex-column m-0'
                onDragOver={e => e.preventDefault()}
                onDrop={e => { onDrop(e.dataTransfer.getData("id"), true) }}
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

export default App;
