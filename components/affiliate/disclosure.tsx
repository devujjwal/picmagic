export function AffiliateDisclosure({ monetized }: { monetized: boolean }) {
  return (
    <p className="fine-print affiliate-disclosure">
      {monetized
        ? "Some links are affiliate links. PicMagic may earn a commission if you purchase through them, at no additional cost to you."
        : "These are ordinary links; PicMagic does not earn a referral commission from them."}{" "}
      PicMagic is free; external tools set their own prices.
    </p>
  );
}
