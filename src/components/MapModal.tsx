"use client";

import { useState } from "react";

export default function MapModal({
  mapEmbedUrl,
  locationName,
}: {
  mapEmbedUrl: string;
  locationName: string;
}) {
  const [open, setOpen] = useState(false);

  if (!mapEmbedUrl) {
    return (
      <p className="text-[14px] font-light leading-relaxed text-muted">
        {locationName}
      </p>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-left text-[14px] font-light leading-relaxed text-muted underline underline-offset-4 decoration-border transition-colors hover:text-foreground hover:decoration-foreground"
      >
        {locationName}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative mx-4 w-full max-w-[640px] bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-medium uppercase tracking-[0.15em]">
                Location
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-[18px] text-muted transition-colors hover:text-foreground"
              >
                &times;
              </button>
            </div>
            <p className="mb-4 text-[14px] font-light text-muted">
              {locationName}
            </p>
            <div className="overflow-hidden border border-border">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Run location"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
