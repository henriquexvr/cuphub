export default function IndicatorCard({
  title,
  value,
  subtitle,
  color = "text-foreground",
}: {
  title: string
  value: string
  subtitle?: string
  color?: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
