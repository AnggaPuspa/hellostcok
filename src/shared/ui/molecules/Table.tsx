import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { Text } from '../atoms/Text.tsx'

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

export function TableRow({ children, selected = false, onClick }: { children: ReactNode; selected?: boolean; onClick?: () => void }) {
  return (
    <tr className={selected ? 'hs-table-row is-selected' : 'hs-table-row'} onClick={onClick}>
      {children}
    </tr>
  )
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
          <div className="hs-table-foot-row">
            <Text as="span">{start}</Text>
            {end ? <Text as="span">{end}</Text> : null}
          </div>
        </td>
      </tr>
    </tfoot>
  )
}
