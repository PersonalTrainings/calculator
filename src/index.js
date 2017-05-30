import React, { Component } from 'react';
import { render } from 'react-dom';
import './index.css';

const Button = (props) => <button className="btn btn-primary" {...props}>{props.children}</button>

class AutoScalingText extends Component {
  state = {
    scale: 1
  };
  
  componentDidUpdate() {
    const { scale } = this.state;
    
    const node = this.node;
    const parentNode = node.parentNode;
    
    const availableWidth = parentNode.offsetWidth;
    const actualWidth = node.offsetWidth;
    const actualScale = availableWidth / actualWidth;
    
    
    if (scale === actualScale)
      return;
    
    if (actualScale < 1) {
      this.setState({ scale: actualScale })
    } else if (scale < 1) {
      this.setState({ scale: 1 })
    }
  }
  
  render() {
    const { scale } = this.state
    
    return (
      <div
        className="auto-scaling-text"
        style={{ transform: `scale(${scale},${scale})` }}
        ref={node => this.node = node}
      >{this.props.children}</div>
    );
  }
}

class Calculator extends Component {
  constructor() {
    super();
    this.state = {
      value: null,
      displayValue: "0",
      waitingForOperand: false,
      operator: null,
      displayClearMark: false
    };    
  }

  clearDisplay() {    
    this.setState({
      value: null,
      displayValue: "0",
      displayClearMark: false
    })
  }

  inputDigit(digit) { 
    const { displayValue, waitingForOperand } = this.state;

    if (waitingForOperand) {
      this.setState({
        displayValue: String(digit),
        waitingForOperand: false
      })
    }
    else {
      this.setState({
        displayValue: displayValue === "0" ? String(digit) : displayValue + digit,
        displayClearMark: true
      })
    }
  }

  inputDot() {
    const { displayValue, waitingForOperand } = this.state;

    if (waitingForOperand) {
      this.setState({
        displayValue: ".",
        waitingForOperand: false
      })
    } else if (displayValue.indexOf(".") === -1) {
      this.setState({
        displayValue: displayValue + ".",
        waitingForOperand: false,
        displayClearMark: true
      })
    } 
  }

  toggleSign() {
    const { displayValue } = this.state;

    this.setState({
      displayValue: displayValue.charAt(0) === "-" ? displayValue.substr(1) : "-" + displayValue,
      displayClearMark: true
    })

  }

  inputPercent() {
    const { displayValue } = this.state;
    const value = parseFloat(displayValue);

    this.setState({
      displayValue: String(value/100),
      displayClearMark: true 
    })
  }

  performOperation(nextOperator) {
    const { displayValue, operator, value } = this.state;

    const nextValue = parseFloat(displayValue);

    const operations = {
      "/": (prevValue, nextValue) => prevValue / nextValue,
      "*": (prevValue, nextValue) => prevValue * nextValue,
      "+": (prevValue, nextValue) => prevValue + nextValue,
      "-": (prevValue, nextValue) => prevValue - nextValue,
      "=": (prevValue, nextValue) => nextValue
    };

    if (value === null) {
      this.setState({
        value: nextValue
      })
    } else if (operator) {
      const currentValue = value || 0;
      const computedValue = operations[operator](currentValue, nextValue); 

      this.setState({
        value: computedValue,
        displayValue: String(computedValue)
      })

    }   

    this.setState({
      waitingForOperand: true,
      operator: nextOperator,
      displayClearMark: true
    })
  }

  render() {    
    const { displayValue, displayClearMark } = this.state;
    const mark = displayClearMark ? "C" : "AC";    

    return (      
      <div className="well calculator">
        <h4 className="text-center text-primary">FreeCodeCamp</h4>
        <div className="calculator-display" ><AutoScalingText>{displayValue}</AutoScalingText></div>
        <div className="calculator-keypad">
          <div className="input-keys">
            <div className="function-keys">
              <Button  onClick={() => this.clearDisplay()} className="btn btn-success">{mark}</Button>
              <Button  onClick={() => this.toggleSign()} className="btn btn-success">±</Button>
              <Button  onClick={() => this.inputPercent()} className="btn btn-success">%</Button>
            </div>
            <div className="digit-keys">
              <Button onClick={() => this.inputDigit(1)} >1</Button>
              <Button onClick={() => this.inputDigit(2)} >2</Button>
              <Button onClick={() => this.inputDigit(3)} >3</Button>              
              <Button onClick={() => this.inputDigit(4)} >4</Button>
              <Button onClick={() => this.inputDigit(5)} >5</Button>
              <Button onClick={() => this.inputDigit(6)} >6</Button>              
              <Button onClick={() => this.inputDigit(7)} >7</Button>
              <Button onClick={() => this.inputDigit(8)} >8</Button>
              <Button onClick={() => this.inputDigit(9)} >9</Button>              
              <Button onClick={() => this.inputDigit(0)} className="btn btn-primary zero" >0</Button>
              <Button onClick={() => this.inputDot()} >.</Button>
            </div>
            <div className="operator-keys">
              <Button  onClick={() => this.performOperation("/")} className="btn btn-warning">/</Button>
              <Button  onClick={() => this.performOperation("*")} className="btn btn-warning">*</Button>
              <Button  onClick={() => this.performOperation("-")} className="btn btn-warning">-</Button>
              <Button  onClick={() => this.performOperation("+")} className="btn btn-warning">+</Button>
              <Button  onClick={() => this.performOperation("=")} className="btn btn-warning">=</Button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

render(
  <Calculator />,
  document.getElementById('root')
);
