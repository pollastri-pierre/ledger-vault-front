export const BLUR_BG = 'BLUR_BG';
export const UNBLUR_BG = 'UNBLUR_BG';

// Blur background action
export function blurBG() {
  return { type: BLUR_BG };
}

// Unblur background action
export function unblurBG() {
  return { type: UNBLUR_BG };
}
