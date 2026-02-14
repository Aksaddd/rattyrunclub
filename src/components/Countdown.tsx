"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  if (!timeLeft) {
    return (
      <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-muted">
        Happening now!
      </p>
    );
  }

  const units = [
    { label: "D", value: timeLeft.days },
    { label: "H", value: timeLeft.hours },
    { label: "M", value: timeLeft.minutes },
    { label: "S", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3">
      {units.map(({ label, value }) => (
        <div key={label} className="flex items-baseline gap-0.5">
          <span className="text-[18px] font-semibold tabular-nums tracking-tight">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-medium uppercase text-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
