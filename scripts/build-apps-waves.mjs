import fs from 'node:fs'
import path from 'node:path'

const dir = 'src/assets/landing/whitepace/apps-waves-src'
const outFile = 'src/assets/landing/whitepace/apps-waves.svg'

// Figma insets: top right bottom left (%) for each wave in Apps frame 70:59048
const insets = [
  [28.39, -3.18, 5.41, -0.16],
  [26.75, -3.02, 7.51, -0.27],
  [25.1, -2.87, 9.57, -0.39],
  [23.44, -2.71, 10.83, -0.51],
  [21.78, -2.56, 11.18, -0.63],
  [20.1, -2.4, 11.54, -0.75],
  [18.43, -2.24, 11.89, -0.88],
  [16.74, -2.09, 12.24, -1],
  [15.06, -1.93, 12.6, -1.13],
  [13.36, -1.78, 12.95, -1.26],
  [11.66, -1.62, 13.3, -1.39],
  [9.95, -1.47, 13.66, -1.53],
  [8.23, -1.31, 14.01, -1.67],
  [6.51, -1.16, 14.37, -1.82],
  [4.78, -1, 14.72, -1.97],
  [3.04, -0.84, 15.07, -2.12],
  [1.3, -0.69, 15.43, -2.28],
  [6.5, -0.6, 18.15, -2.34],
  [11.68, -0.52, 20.88, -2.39],
  [16.82, -0.43, 23.61, -2.45],
  [21.7, -0.35, 26.33, -2.5],
  [25.33, -0.26, 29.06, -2.55],
  [25.09, -0.18, 30.15, -2.6],
  [23.47, -0.09, 29.96, -2.65],
  [21.69, -0.01, 29.56, -2.7],
  [19.73, 0.08, 29.03, -2.75],
  [17.62, 0.16, 28.42, -2.8],
  [15.36, 0.25, 27.76, -2.85],
  [12.97, 0.33, 27.06, -2.91],
  [10.47, 0.42, 26.32, -2.96],
  [7.87, 0.5, 25.4, -3.02],
  [5.19, 0.58, 20.18, -3.07],
  [2.44, 0.67, 14.95, -3.13],
]

const W = 1920
const H = 751
const parts = []

for (let i = 0; i < insets.length; i++) {
  const n = String(i + 1).padStart(2, '0')
  const svg = fs.readFileSync(path.join(dir, `${n}.svg`), 'utf8')
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  if (!vb) continue
  const srcW = Number(vb[1])
  const srcH = Number(vb[2])
  const [t, r, b, l] = insets[i]
  const x = (l / 100) * W
  const y = (t / 100) * H
  const w = W - (l / 100) * W - (r / 100) * W
  const h = H - (t / 100) * H - (b / 100) * H
  const paths = [...svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g)].map((m) => m[1])
  for (const d of paths) {
    parts.push(
      `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(w / srcW).toFixed(6)} ${(h / srcH).toFixed(6)})" opacity="0.3"><path d="${d}" fill="#ffffff"/></g>`,
    )
  }
}

const out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="751" viewBox="0 0 1920 751" fill="none">
${parts.join('\n')}
</svg>
`

fs.writeFileSync(outFile, out)
console.log(`wrote ${outFile} with ${parts.length} paths`)
