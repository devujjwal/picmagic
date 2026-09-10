import { adsenseClient, adsTxt } from "@/config/ads";

export const dynamic = "force-static";

export function GET() {
  return new Response(adsTxt(adsenseClient), {
    status: adsenseClient ? 200 : 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
