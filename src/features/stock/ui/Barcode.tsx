type BarcodeProps = {
  value: string
}

export function Barcode({ value }: BarcodeProps) {
  const bars = Array.from(value || '-').flatMap((char) => {
    const code = char.charCodeAt(0)
    return [1 + (code % 3), 1 + (code % 2)]
  })

  return (
    <span className="product-barcode" aria-hidden="true">
      {bars.map((width, index) => (
        <span key={`${value}-${index}`} className={index % 2 ? 'is-gap' : 'is-bar'} style={{ width }} />
      ))}
    </span>
  )
}
