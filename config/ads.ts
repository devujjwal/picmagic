export function validAdSenseClient(value: string | undefined) {
  return value && /^ca-pub-\d{16}$/.test(value) ? value : undefined;
}

export const adsenseClient = validAdSenseClient(
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
);

export function adsTxt(client: string | undefined) {
  const valid = validAdSenseClient(client);
  return valid
    ? `google.com, ${valid.slice(3)}, DIRECT, f08c47fec0942fa0\n`
    : "";
}
