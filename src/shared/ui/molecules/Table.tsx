import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'

type TableProps = {
  caption: string
  children: ReactNode
}

export function Table({ caption, children }: TableProps) {
  return (
    <div className="hs-table-wrap">
      <table className="hs-table">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="hs-table-head">{children}</tr>
    </thead>
  )
}

export function TableHeaderCell({ className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`hs-th ${className}`.trim()} {...props} />
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="hs-table-row">{children}</tr>
}

export function TableCell({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`hs-td ${className}`.trim()} {...props} />
}

type TableFooterProps = {
  start: ReactNode
  end?: ReactNode
  colSpan: number
}

export function TableFooter({ start, end, colSpan }: TableFooterProps) {
  return (
    <tfoot>
      <tr>
        <td className="hs-table-foot" colSpan={colSpan}>
          <span>{start}</span>
          {end ? <span>{end}</span> : null}
        </td>
      </tr>
    </tfoot>
  )
}
