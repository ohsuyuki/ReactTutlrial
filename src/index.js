import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      value={ this.props.squares[i] }
      onClick={ () => this.props.onClick(i) }
    />;
  }

  render() {
    const row = 3;
    const column = 3;

    let boardRows = [];
    for(let i = 0; i < row; i++) {
      let squares = [];
      for(let j = 0; j < column; j++) {
        let index = (i * row) + j;
        let square = this.renderSquare(index);
        squares.push(square);
      }

      let boardRow = (
        <div key={i} className='board-row'>
          {squares}
        </div>
      )
      boardRows.push(boardRow);
    }

    return (
      <div>
        {boardRows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coord: null,
          stepNumber: 0
        }
      ],
      currentStepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
    const current = history.find(element => element.stepNumber === this.state.currentStepNumber)
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coord: i,
          stepNumber: this.state.currentStepNumber + 1,
        }
      ]),
      currentStepNumber: this.state.currentStepNumber + 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      currentStepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  sortMovves() {
    let history = this.state.history;
    this.setState({
      history: history.reverse()
    })
  }

  render() {
    const history = this.state.history;
    const current = history.find(element => element.stepNumber === this.state.currentStepNumber)

    const moves = history.map((step) => {
      const desc = step.stepNumber === 0 ?
        `Go to move start` :
        `Go to move #${step.stepNumber}`;

      const className = (step === current) ? `current-button` : `prev-button`;

      return (
        <li key={step.stepNumber}>
          <button className={className} onClick={() => this.jumpTo(step.stepNumber)}>{desc}</button>
          <div>{step.coord}</div>
        </li>
      );
    });

    const winner = calculateWinner(current.squares);
    let status;
    if(winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={ () => this.sortMovves() }>sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
