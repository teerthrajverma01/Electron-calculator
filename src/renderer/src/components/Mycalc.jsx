import { useState } from 'react'
import './CalculatorStyle.css'

const Mycalc = () => {
  const [current, setCurrent] = useState('')
  const [prevoius, setPrevoius] = useState('')
  const [operations, setOperations] = useState('')

  const appendValueHandler = (el) => {
    const value = el.target.getAttribute('data')
    if (value === '.' && current.includes('.')) return
    setCurrent(current + value)
  }

  const deleteHandler = () => {
    setCurrent(String(current).slice(0, -1))
  }

  const allclearHandler = () => {
    setCurrent('')
    setOperations('')
    setPrevoius('')
  }

  const chooseOperationHandler = (el) => {
    if (current === '') return
    if (prevoius !== '') {
      let value = compute()
      setPrevoius(value)
    } else {
      setPrevoius(current)
    }
    setCurrent('')
    setOperations(el.target.getAttribute('data'))
  }

  const equalHandler = () => {
    let value = compute()
    if (value === undefined || value == null) return
    setCurrent(value)
    setPrevoius('')
    setOperations('')
  }
  const compute = () => {
    let result
    let previousNumber = parseFloat(prevoius)
    let currentNumber = parseFloat(current)
    if (isNaN(previousNumber) || isNaN(currentNumber)) return
    let promise
    switch (operations) {
      case '÷':
        // call to main process

        promise = window.calculateapi.div({ previousNumber, currentNumber })
        promise.then((data) => {
          result = Number(data)
          if (!Number.isInteger(result)) {
            result.toFixed(3)
          }
          setCurrent(result)
          setPrevoius('')
          setOperations('')
        })
        break
      case 'x':
        // call to main process

        promise = window.calculateapi.mul({ previousNumber, currentNumber })
        promise.then((data) => {
          result = Number(data)
          if (!Number.isInteger(result)) {
            result.toFixed(3)
          }
          setCurrent(result)
          setPrevoius('')
          setOperations('')
        })
        break
      case '+':
        // call to main process

        promise = window.calculateapi.add({ previousNumber, currentNumber })
        promise.then((data) => {
          result = Number(data)
          if (!Number.isInteger(result)) {
            result.toFixed(3)
          }
          setCurrent(result)
          setPrevoius('')
          setOperations('')
        })

        break
      case '-':
        // call to main process
        promise = window.calculateapi.sub({ previousNumber, currentNumber })
        promise.then((data) => {
          result = Number(data)
          if (!Number.isInteger(result)) {
            result.toFixed(3)
          }
          setCurrent(result)
          setPrevoius('')
          setOperations('')
        })
        break
      default:
        return
    }
    // if (!Number.isInteger(result)) {
    //   result.toFixed(3)
    // }
    console.log(result, typeof result)
    return result
  }

  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {prevoius} {operations}
          </div>
          <div className="current-operand">{current}</div>
        </div>

        <button className="span-two" onClick={allclearHandler}>
          AC
        </button>
        <button onClick={deleteHandler}>DEL</button>
        <button data={'÷'} onClick={chooseOperationHandler}>
          ÷
        </button>

        <button data={7} onClick={appendValueHandler}>
          7
        </button>
        <button data={8} onClick={appendValueHandler}>
          8
        </button>
        <button data={9} onClick={appendValueHandler}>
          9
        </button>
        <button data={'x'} onClick={chooseOperationHandler}>
          x
        </button>

        <button data={4} onClick={appendValueHandler}>
          4
        </button>
        <button data={5} onClick={appendValueHandler}>
          5
        </button>
        <button data={6} onClick={appendValueHandler}>
          6
        </button>
        <button data={'+'} onClick={chooseOperationHandler}>
          +
        </button>

        <button data={1} onClick={appendValueHandler}>
          1
        </button>
        <button data={2} onClick={appendValueHandler}>
          2
        </button>
        <button data={3} onClick={appendValueHandler}>
          3
        </button>
        <button data={'-'} onClick={chooseOperationHandler}>
          -
        </button>

        <button data={'.'} onClick={appendValueHandler}>
          .
        </button>
        <button data={0} onClick={appendValueHandler}>
          0
        </button>
        <button className="span-two" onClick={equalHandler}>
          =
        </button>
      </div>
    </>
  )
}

export default Mycalc
