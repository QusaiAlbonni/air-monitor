import { AQIColor } from "./dto";

export function aqiColorToHex(color?: AQIColor): string {
  if (!color) return '#000000';

  const r = color.red ?? 0;
  const g = color.green ?? 0;
  const b = color.blue ?? 0;

  const clamp = (v: number) => Math.max(0, Math.min(255, v));

  return `#${[r, g, b]
    .map(clamp)
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')}`;
}