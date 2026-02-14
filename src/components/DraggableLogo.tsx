"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  src: string;
  alt: string;
  position: { x: number; y: number };
}

export default function DraggableLogo({ src, alt, position }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(position);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  // Check auth status on mount
  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.authenticated))
      .catch(() => setIsAdmin(false));
  }, []);

  const savePosition = useCallback(
    async (newPos: { x: number; y: number }) => {
      try {
        const res = await fetch("/api/content");
        const content = await res.json();
        content.home.logoPosition = newPos;
        await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content),
        });
      } catch {
        // silent fail — position will save next time
      }
    },
    []
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isAdmin) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
    },
    [isAdmin, pos]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !dragStart.current || !containerRef.current) return;
      const container = containerRef.current.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, dragStart.current.posX + dx));
      const newY = Math.max(0, Math.min(100, dragStart.current.posY + dy));

      setPos({ x: newX, y: newY });
    },
    [dragging]
  );

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    dragStart.current = null;
    savePosition(pos);
  }, [dragging, pos, savePosition]);

  // Save latest pos on pointer up (pos may have changed since callback was bound)
  const latestPos = useRef(pos);
  latestPos.current = pos;

  const onPointerUpStable = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    dragStart.current = null;
    savePosition(latestPos.current);
  }, [dragging, savePosition]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ pointerEvents: isAdmin ? "auto" : "none" }}
    >
      <img
        src={src}
        alt={alt}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpStable}
        className="absolute w-[60%] max-w-[480px] object-contain drop-shadow-lg select-none"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: "translate(-50%, -50%)",
          cursor: isAdmin ? (dragging ? "grabbing" : "grab") : "default",
          touchAction: "none",
        }}
        draggable={false}
      />
    </div>
  );
}
