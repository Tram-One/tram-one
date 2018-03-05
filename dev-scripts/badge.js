module.exports = (label, value) => {
  const labelWidth = label.length * 11
  const valueWidth = 58 + (value.length * 4)
  const labelOffset = 16.5
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${valueWidth}" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a">
    <rect width="${valueWidth}" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0h${labelWidth}v20H0z"/>
    <path fill="#e05d44" d="M${labelWidth} 0h100v20H${labelWidth}z"/>
    <path fill="url(#b)" d="M0 0h${valueWidth}v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelOffset}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelOffset}" y="14">${label}</text>
    <text x="59" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="59" y="14">${value}</text>
  </g>
</svg>
`
}
