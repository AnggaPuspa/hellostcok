import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Chip } from '@/shared/ui/atoms/Chip.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { ownerReadOnlyLabel, ownerReadOnlyNote, ownerReportAction, roleTitle } from '@/shared/ui/layout/nav.ts'
import { BarChart } from '@/shared/ui/molecules/BarChart.tsx'
import { HistoryList } from '@/shared/ui/molecules/HistoryList.tsx'
import { Metric } from '@/shared/ui/molecules/Metric.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Panel } from '@/shared/ui/molecules/Panel.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getDashboard } from '../api/dashboard.api.ts'
import type { DashboardView } from '../model/dashboard.types.ts'

export function DashboardPage() {
  const session = getSession()
  const navigate = useNavigate()
  const toast = useToast()
  const [dashboard, setDashboard] = useState<DashboardView | null>(null)
  const isOwner = session?.role === 'pemilik'
  const greetName = isOwner && session ? roleTitle[session.role] : (session?.name ?? '')

  useEffect(() => {
    let active = true
    getDashboard()
      .then((data) => {
        if (active) setDashboard(data)
      })
      .catch((error: unknown) => {
        if (!active) return
        setDashboard(null)
        toast.error('Dashboard gagal dimuat.', failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [])

  if (!dashboard) return <section className="dash-page" />

  return (
    <section className="dash-page">
      <PageHeader
        section={dashboard.section}
        detail={`${dashboard.greetedAt} · selamat datang, ${greetName}`}
        aside={
          isOwner ? (
            <div className="dash-owner">
              <div className="dash-owner-actions">
                <Pill tone="up">{ownerReadOnlyLabel}</Pill>
                <Button variant="secondary" onClick={() => navigate('/laporan')}>
                  {ownerReportAction}
                </Button>
              </div>
              <Text className="dash-owner-note">{ownerReadOnlyNote}</Text>
            </div>
          ) : undefined
        }
      />

      <Panel title={dashboard.summary.title} meta={dashboard.summary.meta} aside={<Chip>{dashboard.summary.chip}</Chip>}>
        <div className="dash-metrics">
          {dashboard.summary.metrics.map((item) => (
            <Metric key={item.label} {...item} />
          ))}
        </div>
      </Panel>

      <div className="dash-split">
        <Panel
          title={dashboard.performance.title}
          meta={dashboard.performance.range}
          aside={
            <div className="dash-score">
              <Text className="dash-figure">{dashboard.performance.score}</Text>
              <Pill tone="up">{dashboard.performance.scoreLabel}</Pill>
            </div>
          }
        >
          <BarChart
            months={dashboard.performance.months}
            average={dashboard.performance.average}
            averageLabel={dashboard.performance.averageLabel}
            rangeLabel={dashboard.performance.range}
          />
        </Panel>

        <Panel title={dashboard.history.title} meta={dashboard.history.meta}>
          <HistoryList items={dashboard.history.items} />
        </Panel>
      </div>
    </section>
  )
}
