import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RevenueChartPlaceholderProps = {
  title: string;
  description: string;
};

export default function RevenueChartPlaceholder({ title, description }: RevenueChartPlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}
