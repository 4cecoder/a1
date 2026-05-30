import { convexAuth } from "@convex-dev/auth/server";

/**
 * Wave 1 auth foundation.
 *
 * Providers are intentionally left as an empty list for now so this lane can
 * establish the Convex auth wiring without coupling to provider setup owned by
 * another lane.
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [] as [],
});
