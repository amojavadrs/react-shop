export const TOMAN_RATE = 4200; // 1 USD = 4200 تومان

export function toToman(usd) {
  return Math.round((Number(usd) || 0) * TOMAN_RATE);
}

export function formatToman(amountNumber) {
  try {
    return amountNumber.toLocaleString("fa-IR") + " تومان";
  } catch {
    return amountNumber.toLocaleString() + " تومان";
  }
}
