import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'

export function SoonPage({ title }: { title: string }) {
  return (
    <section className="dash-page">
      <PageHeader section={title} />
    </section>
  )
}