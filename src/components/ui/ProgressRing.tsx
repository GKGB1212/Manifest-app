import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackOpacity?: number;
  children?: ReactNode;
}

export function ProgressRing({
  value, size = 64, stroke = 7, color = '#7c6df2', trackOpacity = 1, children,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgb(var(--ring-track))" strokeWidth={stroke} opacity={trackOpacity}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - clamped) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  );
}
