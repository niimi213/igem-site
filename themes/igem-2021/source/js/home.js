const cellsLeft = [
  { cx: 36, cy: 117, rx: 125, ry: 86, rot: 19.27 },
  { cx: 145, cy: 197, rx: 51, ry: 43 },
  { cx: -66, cy: 384, rx: 166, ry: 130 },
  { cx: 104, cy: 531, rx: 177, ry: 140, rot: 5.66 },
  { cx: 223, cy: 369, rx: 33, ry: 27 },
  { cx: 346, cy: 519, rx: 124, ry: 98, rot: -21.69 },
  { cx: 495, cy: 509, rx: 62, ry: 53, rot: 15.53 },
  { cx: 91, cy: 709, rx: 179, ry: 168, rot: 96.13 },
]
const cellsRight = [
  { cx: 200, cy: 158, rx: 34, ry: 30, rot: -16.21, fromRight: true },
  { cx: 203, cy: -25, rx: 258, ry: 222, fromRight: true },
  { cx: 328, cy: 185, rx: 135, ry: 109, rot: 7.21, fromRight: true },
  { cx: 205, cy: 214, rx: 129, ry: 120, fromRight: true },
  { cx: 102, cy: 379, rx: 141, ry: 181, rot: 22.84, fromRight: true },
  { cx: 310, cy: 1197, rx: 88, ry: 125, rot: -17.6, fromRight: true },
]
const canvasWidth = 1100
class Cell {
  constructor(info, index) {
    this.info = info
    this.index = index
    this.dx = 0
    this.dy = 0
    this.ax = 5 + Math.random() * 10
    this.ay = 5 + Math.random() * 10
    this.thetax = Math.random() * Math.PI * 2
    this.thetay = Math.random() * Math.PI * 2
    this.framex = Math.PI * 2 / (300 + Math.random() * 300)
    this.framey = Math.PI * 2 / (300 + Math.random() * 300)
  }
  update() {
    this.thetax += this.framex
    this.thetay += this.framey
    if (this.thetax > Math.PI * 2) {
      this.thetax -= Math.PI * 2
    }
    if (this.thetay > Math.PI * 2) {
      this.thetay -= Math.PI * 2
    }
    this.dx = Math.sin(this.thetax) * this.ax
    this.dy = Math.sin(this.thetay) * this.ay
  }
  calc() {
    const info = Object.assign({}, this.info)
    info.cx += this.dx
    info.cy += this.dy
    return info
  }
}

const canvasLeft = document.getElementById('index-back-0-left')
const canvasRight = document.getElementById('index-back-0-right')

function toEllipse(cell) {
  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
  if (cell.fromRight) {
    cell.cx = canvasWidth - cell.cx
  }
  ellipse.setAttribute('cx', cell.cx)
  ellipse.setAttribute('cy', cell.cy)
  ellipse.setAttribute('rx', cell.rx)
  ellipse.setAttribute('ry', cell.ry)
  if (cell.rot) {
    ellipse.setAttribute('transform', `rotate(${cell.rot},${cell.cx},${cell.cy})`)
  }
  return ellipse
}

const cellElements = {}
const cellInstances = []
for (let i = 0; i < cellsLeft.length; i++) {
  const cell = cellsLeft[i]
  ellipse = toEllipse(cell)
  canvasLeft.appendChild(ellipse)
  cellElements[i] = ellipse
  cellInstances.push(new Cell(cell, i))
}
for (let i = 0; i < cellsRight.length; i++) {
  const cell = cellsRight[i]
  ellipse = toEllipse(cell)
  canvasRight.appendChild(ellipse)
  cellElements[i] = ellipse
  cellInstances.push(new Cell(cell, i))
}

function tick() {
  for (let cellInstance of cellInstances) {
    cellInstance.update()
    const cell = cellInstance.calc()
    if (!cellElements[cellInstance.index]) continue
    const ellipse = cellElements[cellInstance.index]
    ellipse.setAttribute('cx', cell.cx)
    ellipse.setAttribute('cy', cell.cy)
  }
  requestAnimationFrame(tick)
}
tick()

const rellax = new Rellax('.rellax')

// todo: change "3" to dom-influenced value
// for (let i = 0; i < 3; i++) {
  let i = 2
  const wrapper = document.querySelector(`.index-section-${i + 1}`)
  new Rellax(`.rellax-sec-${i + 1}`, {
    wrapper
  })
// }
