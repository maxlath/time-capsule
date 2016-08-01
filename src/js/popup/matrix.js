// Matrix: a representation of the periodicity options as a 2 dimensions table
// to make moving from one to the other with up/down/left/right commands possible
const matrix = []

function findSelected () {
  for (let row of matrix) {
    for (let el of row) {
      if (isSeleted(el)) {
        return el
      }
    }
  }
}

const isSeleted = (el) => el.classList.contains('selected')

function shiftSelectedCoordinates (rowShift, columnShift) {
  const currentSelectedEl = findSelected()
  const { place:currentPlace } = currentSelectedEl
  const rowNum = currentPlace.row + rowShift
  const columnNum = currentPlace.column + columnShift
  const selectedEl = findByCoordinates(rowNum, columnNum)
  if (selectedEl) {
    currentSelectedEl.classList.remove('selected')
    selectedEl.classList.add('selected')
  } else {
    console.warn('no element found')
  }
}

function findByCoordinates (rowNum, columnNum) {

  // allow to get from first to last row and reverse
  if (rowNum < 0) {
    rowNum = lastRowNum()
  } else if (rowNum > lastRowNum()) {
    rowNum = 0
  }

  const row = matrix[rowNum]
  const lastColumnNum = row.length - 1

  // allow to get from first to last column and reverse
  if (columnNum < 0 ) {
    columnNum = lastColumnNum
  } else if (columnNum > lastColumnNum) {
    columnNum = 0
  }

  return row[columnNum]
}

const lastRowNum = () => matrix.length - 1

module.exports = window.matrixAPI = {
  matrix: matrix,
  up: shiftSelectedCoordinates.bind(null, -1, 0),
  down: shiftSelectedCoordinates.bind(null, 1, 0),
  left: shiftSelectedCoordinates.bind(null, 0, -1),
  right: shiftSelectedCoordinates.bind(null, 0, 1),
  findSelected: findSelected
}
