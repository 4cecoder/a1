import { ConvexHttpClient } from "convex/browser"
import type { FunctionReference } from "convex/server"

type PublicQueryRef = FunctionReference<"query", "public", Record<string, unknown>, unknown>
type PublicMutationRef = FunctionReference<"mutation", "public", Record<string, unknown>, unknown>

function getConvexUrl(): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured")
  }

  return convexUrl
}

export function getConvexHttpClient(): ConvexHttpClient {
  return new ConvexHttpClient(getConvexUrl())
}

export async function runConvexQuery<TData>(
  queryRef: PublicQueryRef,
  args: Record<string, unknown>
): Promise<TData> {
  const client = getConvexHttpClient()
  return (await client.query(queryRef, args)) as TData
}

export async function runConvexMutation<TData>(
  mutationRef: PublicMutationRef,
  args: Record<string, unknown>
): Promise<TData> {
  const client = getConvexHttpClient()
  return (await client.mutation(mutationRef, args)) as TData
}
