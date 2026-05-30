import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyFromCents, formatPercent, type KpiSnapshot } from "@/lib/analytics/kpis";

type KpiCardsProps = {
  snapshot: KpiSnapshot;
};

export default function KpiCards({ snapshot }: KpiCardsProps) {
  const cards = [
    { label: "Bookings", value: `${snapshot.bookings}` },
    { label: "Conversion", value: formatPercent(snapshot.conversionRate) },
    { label: "No-show", value: formatPercent(snapshot.noShowRate) },
    { label: "Revenue", value: formatCurrencyFromCents(snapshot.revenueCents) },
    { label: "Avg ticket", value: formatCurrencyFromCents(snapshot.averageTicketCents) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
