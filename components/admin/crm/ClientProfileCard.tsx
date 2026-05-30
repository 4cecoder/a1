import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type Client } from "@/lib/types/crm"

type ClientProfileCardProps = {
  client: Client
}

function formatDate(input: string): string {
  return new Date(input).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function ClientProfileCard({ client }: ClientProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.fullName}</CardTitle>
        <CardDescription>
          {client.email} • {client.phone}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={client.status === "active" ? "secondary" : "outline"}>
            {client.status}
          </Badge>
          <Badge variant="outline">Owner: {client.owner}</Badge>
          {client.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground">Joined</p>
            <p className="font-medium">{formatDate(client.joinedAt)}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground">Last visit</p>
            <p className="font-medium">
              {client.lastVisitAt ? formatDate(client.lastVisitAt) : "No visit recorded"}
            </p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground">Total visits</p>
            <p className="font-medium">{client.totalVisits}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground">Lifetime value</p>
            <p className="font-medium">${client.lifetimeValueUsd}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Preferred services</p>
          <div className="flex flex-wrap gap-2">
            {client.preferredServices.map((service) => (
              <Badge key={service} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Visit timeline</p>
          <ol className="space-y-2">
            {client.timeline.map((item) => (
              <li key={item.id} className="rounded-md border p-3 text-sm">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-medium">{item.label}</p>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
                <p className="text-muted-foreground">{item.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.at)}</p>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
