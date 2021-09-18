const cells = [
  { cx: 36, cy: 117, rx: 125, ry: 86, rot: 19.27 },
  { cx: 145, cy: 197, rx: 51, ry: 43 },
  { cx: -66, cy: 384, rx: 166, ry: 130 },
  { cx: 104, cy: 531, rx: 177, ry: 140, rot: 5.66 },
  { cx: 223, cy: 369, rx: 33, ry: 27 },
  { cx: 346, cy: 519, rx: 124, ry: 98, rot: -21.69 },
  { cx: 495, cy: 509, rx: 62, ry: 53, rot: 15.53 },
  { cx: 91, cy: 709, rx: 179, ry: 168, rot: 96.13 },
  { cx: 1096, cy: 158, rx: 34, ry: 30, rot: -16.21 },
  { cx: 1315, cy: -25, rx: 258, ry: 222 },
  { cx: 1440, cy: 185, rx: 135, ry: 109, rot: 7.21 },
  { cx: 1317, cy: 214, rx: 129, ry: 120 },
  { cx: 1214, cy: 379, rx: 141, ry: 181, rot: 22.84 },
  { cx: 607, cy: 727, rx: 61, ry: 45, rot: -20.21 },
  { cx: 65, cy: 1123, rx: 180, ry: 130, rot: -17.6 },
  { cx: 1422, cy: 1197, rx: 88, ry: 125, rot: -17.6 },
]
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

const canvasCount = 1 // 3
const canvases = []
for (let i = 0; i < canvasCount; i++) {
  canvases.push(document.getElementById(`index-back-${i}`))
}

const cellElements = {}
const cellInstances = []
for (let i = 0; i < cells.length; i++) {
  const cell = cells[i]
  const rMax = Math.max(cell.rx, cell.ry)
  for (let canvas of canvases) {
    const rect = canvas.getAttribute('viewBox').split(' ').map(str => parseInt(str))
    if (rect[0] - rMax < cell.cx && cell.cx < rect[0] + rect[2] + rMax &&
        rect[1] - rMax < cell.cy && cell.cy < rect[1] + rect[3] + rMax) {
      const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
      ellipse.setAttribute('cx', cell.cx)
      ellipse.setAttribute('cy', cell.cy)
      ellipse.setAttribute('rx', cell.rx)
      ellipse.setAttribute('ry', cell.ry)
      if (cell.rot) {
        ellipse.setAttribute('transform', `rotate(${cell.rot},${cell.cx},${cell.cy})`)
      }
      canvas.appendChild(ellipse)
      if (typeof cellElements[i] === 'undefined') {
        cellElements[i] = []
      }
      cellElements[i].push(ellipse)
    }
  }
  cellInstances.push(new Cell(cell, i))
}

function tick() {
  for (let cellInstance of cellInstances) {
    cellInstance.update()
    const cell = cellInstance.calc()
    if (!cellElements[cellInstance.index]) continue
    for (let ellipse of cellElements[cellInstance.index]) {
      ellipse.setAttribute('cx', cell.cx)
      ellipse.setAttribute('cy', cell.cy)
    }
  }
  requestAnimationFrame(tick)
}
tick()

const rellax = new Rellax('.rellax')

