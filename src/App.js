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
  const [currentOperand, setCurrentOperand] = useState(0);
  const [clearValueToDisplay, setClearValueToDisplay] = useState(false);
  const [addFloatingPoint, setAddFloatingPoint] = useState(false);
  const [operandMem, setOperandMem] = useState(null);
  const [operator, setOperator] = useState(null);
  const [currentContainer, setCurrentContainer] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [containers, setContainers] = useState([{ id: "dev", blocks: [{ id: "display", component: Display }, { id: "operators", component: Operators }, { id: "digits", component: Digits }, { id: "equals", component: Equals }] }, { id: "prod", blocks: [] }]);

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

  const handleDragStart = (container, block) => {
    setCurrentContainer(container);
    setCurrentBlock(block);
  }

  const handleContainerDrop = (event, container) => {
    event.preventDefault();
    event.stopPropagation();

    const currentIndex = currentContainer.blocks.indexOf(currentBlock);

    if (container.id === 'dev')
      currentContainer.blocks.splice(currentIndex, 1);
    else if (container.id === 'prod')
      container.blocks.push(currentBlock);

    setContainers(containers.map(c => {
      if (c.id === container.id) {
        return container;
      }
      if (c.id === currentContainer.id) {
        return currentContainer;
      }
      return c;
    }))

    event.target.style.boxShadow = 'none';
  }

  const handleBlockDrop = (event, container, block) => {
    event.preventDefault();
    event.stopPropagation();

    const currentIndex = currentContainer.blocks.indexOf(currentBlock);
    const dropIndex = container.blocks.indexOf(block);

    if (container.id === 'dev') {
      currentContainer.blocks.splice(currentIndex, 1);
    } else if (currentContainer.id === 'prod' && container.id === 'prod') {
      currentContainer.blocks.splice(currentIndex, 1);
      container.blocks.splice(dropIndex === currentIndex ? dropIndex + 1 : dropIndex, 0, currentBlock);
    } else if (currentContainer.id === 'dev' && container.id === 'prod') {
      container.blocks.push(currentBlock);
    }

    setContainers(containers.map(c => {
      if (c.id === container.id) {
        return container;
      }
      if (c.id === currentContainer.id) {
        return currentContainer;
      }
      return c;
    }))

    event.currentTarget.classList.remove('divider');
  }

  const handleDragover = (event) => {
    event.preventDefault();
    if (event.currentTarget.classList.contains('parent-block')) {
      event.currentTarget.classList.add('divider');
    }
  }

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove('divider');
  }

  const handleDragEnd = (event) => {
    event.currentTarget.classList.remove('divider');
  }

  const getBlocks = (container) => {
    const blocksToRender = [];

    if (container.id === 'dev') {

      container.blocks.forEach(block => {
        const dragged = containers[1].blocks.filter(e => e.id === block.id).length > 0;
        blocksToRender.push(
          <Col
            xs={12}
            className={`${dragged ? "opacity-50" : ""} cursor-move px-0 pb-3`}
            key={block.id}
            draggable={!isInProduction && !dragged}
            onDragStart={() => handleDragStart(container, block)}
          >
            <div className='bg-white shadow-md rounded-1'>
              <block.component />
            </div>
          </Col>
        );
      });

      if (isInProduction) return <></>;

    } else if (container.id === 'prod') {

      container.blocks.forEach(block => {
        blocksToRender.push(
          <Col
            xs={12}
            className='parent-block px-0 pb-2'
            key={block.id}
            draggable={!isInProduction}
            onDragStart={() => handleDragStart(container, block)}
            onDrop={e => handleBlockDrop(e, container, block)}
            onDragOver={e => handleDragover(e)}
            onDragLeave={e => handleDragLeave(e)}
            onDragEnd={e => handleDragEnd(e)}
          >
            <block.component
              currentOperand={currentOperand}
              onClick={handleCalc}
              isInProduction={isInProduction}
              selectedOperator={operator === "*" ? "x" : operator}
            />
          </Col>
        );
      });

      if (blocksToRender.length < 1) return <ContainerPlaceholder />;
    }

    return blocksToRender;
  }

  return (
    <div className='App'>
      <Container className='p-4 p-lg-5'>

        <Row className='justify-content-center mb-4 mx-0'>
          <Col lg={4} className='px-lg-5' />
          <Col lg={4} className='px-lg-5'>
            <ModeToggle isInProduction={isInProduction} toggleMode={toggleMode} />
          </Col>
        </Row>

        <Row className='justify-content-center m-0'>
          <Col lg={4} className='px-lg-5'>
            <Container fluid className='px-0'>
              <Row
                className='flex-column blocks-placeholder m-0'
                onDragOver={e => handleDragover(e)}
                onDrop={e => handleContainerDrop(e, containers[0])}
              >
                {getBlocks(containers[0])}
              </Row>
            </Container>
          </Col>

          <Col lg={4} className='px-lg-5'>
            <Container fluid className='px-0'>
              <Row
                className='flex-column blocks-placeholder m-0'
                onDragOver={e => handleDragover(e)}
                onDrop={e => handleContainerDrop(e, containers[1])}
              >
                {getBlocks(containers[1])}
              </Row>
            </Container>
          </Col>
        </Row>

      </Container>
    </div >
  );
}