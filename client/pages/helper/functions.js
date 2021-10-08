import Link from "next/link";

export function precise(x) {
  return Number.parseFloat(x).toPrecision(4);
}
