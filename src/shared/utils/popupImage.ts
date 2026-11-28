// popup image served through the Next image optimizer (small + cached)
export const POPUP_WIDTHS = [640, 828, 1080];
export const POPUP_SIZES = '(max-width: 792px) calc(100vw - 32px), 760px';

export const popupImageUrl = (src: string, width: number) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

export const popupSrcSet = (src: string) =>
  POPUP_WIDTHS.map((w) => `${popupImageUrl(src, w)} ${w}w`).join(', ');