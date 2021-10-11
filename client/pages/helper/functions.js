import Link from "next/link";

export function precise(x) {
  if (x < 10) {
    return Number.parseFloat(x).toPrecision(3);
  }
  if (x > 10 && x < 100) {
    return Number.parseFloat(x).toPrecision(4);
  }
  return Number.parseFloat(x).toPrecision(5);
}
