import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getReceipt } from '../api/receipt.api.ts'
import { flows, type FlowKind } from '../model/flow.ts'
import type { Receipt } from '../model/receipt.types.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function ReceiptDetailPage({ kind = 'in' }: { kind?: FlowKind }) {
  const flow = flows[kind]
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  useEffect(() => {
    let active = true
    getReceipt(id, flow.api)
      .then((result) => {
        if (active) setReceipt(result.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error(flow.detailError, failureText(error, 'Transaksi tidak ditemukan.'))
      })
    return () => {
      active = false
    }
  }, [id, toast, flow.api, flow.detailError])

  if (!receipt) return <section className="dash-page" />

  return (
    <section className="dash-page">
      <PageHeader section={flow.section} detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title={receipt.code}>
        <Text className="product-hero-name">{receipt.name}</Text>
        <Text>
          {receipt.sku} · {receipt.quantity} {receipt.unit.toUpperCase()} · {receipt.condition}
        </Text>
        <Text>{receipt.at}</Text>
        <div className="product-form-actions product-form-actions-start">
          <Button variant="secondary" onClick={() => navigate(flow.listPath)}>
            Kembali ke daftar
          </Button>
        </div>
      </Card>
    </section>
  )
}
