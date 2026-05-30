import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CRM_LIFECYCLE_FLOW,
  type Lead,
  type LeadStatus,
} from "@/lib/types/crm"

type LeadFunnelProps = {
  leads: Lead[]
}

export function LeadFunnel({ leads }: LeadFunnelProps) {
  const counts = leads.reduce<Record<LeadStatus, number>>(
    (acc, lead) => {
      acc[lead.status] += 1
      return acc
    },
    { new: 0, qualified: 0, converted: 0, archived: 0 }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead lifecycle funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-4">
          {CRM_LIFECYCLE_FLOW.map((stage, index) => (
            <div key={stage.key} className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  {stage.label}
                </p>
                <Badge variant="outline">{counts[stage.key]}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{stage.key}</span>
                {index < CRM_LIFECYCLE_FLOW.length - 1 ? <span>→</span> : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
