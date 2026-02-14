"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════
   Auth gate — login / first-time setup
   ═══════════════════════════════════════════ */

function AuthGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<"loading" | "setup" | "login">("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          onAuthenticated();
        } else {
          setMode(data.needsSetup ? "setup" : "login");
        }
      });
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "setup" && password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        action: mode === "setup" ? "setup" : "login",
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    onAuthenticated();
  };

  if (mode === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-[13px] text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[360px] flex-col gap-6 px-6"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-[13px] font-semibold uppercase tracking-[0.15em]">
            {mode === "setup" ? "Create Admin Password" : "Admin Login"}
          </h1>
          <p className="text-[13px] font-light text-muted">
            {mode === "setup"
              ? "Set a password to protect your admin panel."
              : "Enter your password to continue."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            minLength={8}
            className="w-full border border-border bg-background px-4 py-3 text-[14px] font-light text-foreground outline-none placeholder:text-muted/50 focus:border-foreground"
          />

          {mode === "setup" && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full border border-border bg-background px-4 py-3 text-[14px] font-light text-foreground outline-none placeholder:text-muted/50 focus:border-foreground"
            />
          )}
        </div>

        {error && (
          <p className="text-[13px] font-light text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-foreground bg-foreground py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {submitting
            ? "..."
            : mode === "setup"
              ? "Create Password"
              : "Log In"}
        </button>

        <Link
          href="/"
          className="text-center text-[12px] font-light text-muted"
        >
          Back to site
        </Link>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Admin panel (existing)
   ═══════════════════════════════════════════ */

interface Content {
  clubName: string;
  tagline: string;
  instagram: string;
  instagramHandle: string;
  strava: string;
  location: string;
  home: {
    heroImage: string;
    upcomingRun: { date: string; time: string; location: string; mapEmbedUrl: string };
    description: string;
  };
  about: {
    image: string;
    heading: string;
    paragraphs: string[];
    imageCaption: string;
  };
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthenticated = useCallback(() => {
    setAuthenticated(true);
  }, []);

  if (!authenticated) {
    return <AuthGate onAuthenticated={handleAuthenticated} />;
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  const save = useCallback(async (data: Content) => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.reload();
  };

  const uploadImage = useCallback(
    async (target: "home.heroImage" | "about.image") => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file || !content) return;

        setUploading(target);
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: form });
        const { path } = await res.json();

        const updated = { ...content };
        if (target === "home.heroImage") {
          if (updated.home.heroImage.startsWith("/uploads/")) {
            await fetch("/api/upload", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filePath: updated.home.heroImage }),
            });
          }
          updated.home = { ...updated.home, heroImage: path };
        } else {
          if (updated.about.image.startsWith("/uploads/")) {
            await fetch("/api/upload", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filePath: updated.about.image }),
            });
          }
          updated.about = { ...updated.about, image: path };
        }

        setContent(updated);
        await save(updated);
        setUploading(null);
      };
      input.click();
    },
    [content, save]
  );

  const removeImage = useCallback(
    async (target: "home.heroImage" | "about.image") => {
      if (!content) return;
      const updated = { ...content };
      const imgPath =
        target === "home.heroImage"
          ? updated.home.heroImage
          : updated.about.image;

      if (imgPath.startsWith("/uploads/")) {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath: imgPath }),
        });
      }

      if (target === "home.heroImage") {
        updated.home = { ...updated.home, heroImage: "/default-hero.svg" };
      } else {
        updated.about = { ...updated.about, image: "/default-about.svg" };
      }

      setContent(updated);
      await save(updated);
    },
    [content, save]
  );

  if (!content) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-[13px] text-muted">Loading...</p>
      </div>
    );
  }

  const update = (fn: (c: Content) => Content) => {
    setContent((prev) => (prev ? fn(prev) : prev));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-[13px] font-medium uppercase tracking-[0.15em]">
            Edit Site
          </h1>
          <Link
            href="/"
            className="text-[11px] text-muted underline underline-offset-2"
          >
            View site
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="border border-border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            Log Out
          </button>
          <button
            onClick={() => save(content)}
            disabled={saving}
            className="border border-foreground bg-foreground px-5 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[720px] px-6 py-12">
        {/* ── Global ── */}
        <Section title="Global">
          <Field
            label="Club Name"
            value={content.clubName}
            onChange={(v) => update((c) => ({ ...c, clubName: v }))}
          />
          <Field
            label="Tagline"
            value={content.tagline}
            onChange={(v) => update((c) => ({ ...c, tagline: v }))}
          />
          <Field
            label="Instagram URL"
            value={content.instagram}
            onChange={(v) => update((c) => ({ ...c, instagram: v }))}
          />
          <Field
            label="Instagram Handle"
            value={content.instagramHandle}
            onChange={(v) => update((c) => ({ ...c, instagramHandle: v }))}
          />
          <Field
            label="Strava URL"
            value={content.strava}
            onChange={(v) => update((c) => ({ ...c, strava: v }))}
          />
          <Field
            label="Location"
            value={content.location}
            onChange={(v) => update((c) => ({ ...c, location: v }))}
          />
        </Section>

        {/* ── Home Page ── */}
        <Section title="Home Page">
          <ImageField
            label="Hero Image"
            src={content.home.heroImage}
            uploading={uploading === "home.heroImage"}
            onUpload={() => uploadImage("home.heroImage")}
            onRemove={() => removeImage("home.heroImage")}
          />
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Run Date &amp; Time (for countdown)
            </label>
            <input
              type="datetime-local"
              value={content.home.upcomingRun.date.slice(0, 16)}
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  home: {
                    ...c.home,
                    upcomingRun: { ...c.home.upcomingRun, date: e.target.value + ":00" },
                  },
                }))
              }
              className="w-full border border-border bg-background px-3 py-2 text-[13px] font-light text-foreground outline-none focus:border-foreground"
            />
          </div>
          <Field
            label="Display Time (e.g. 8:00 AM)"
            value={content.home.upcomingRun.time}
            onChange={(v) =>
              update((c) => ({
                ...c,
                home: {
                  ...c.home,
                  upcomingRun: { ...c.home.upcomingRun, time: v },
                },
              }))
            }
          />
          <Field
            label="Run Location"
            value={content.home.upcomingRun.location}
            onChange={(v) =>
              update((c) => ({
                ...c,
                home: {
                  ...c.home,
                  upcomingRun: { ...c.home.upcomingRun, location: v },
                },
              }))
            }
          />
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Google Maps Embed URL
            </label>
            <input
              type="text"
              value={content.home.upcomingRun.mapEmbedUrl}
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  home: {
                    ...c.home,
                    upcomingRun: { ...c.home.upcomingRun, mapEmbedUrl: e.target.value },
                  },
                }))
              }
              placeholder="Paste Google Maps embed URL here"
              className="w-full border border-border bg-background px-3 py-2 text-[13px] font-light text-foreground outline-none placeholder:text-muted/50 focus:border-foreground"
            />
            <p className="text-[11px] font-light text-muted">
              Google Maps → Share → Embed → copy the src URL from the iframe code
            </p>
          </div>
          <Field
            label="Description"
            value={content.home.description}
            multiline
            onChange={(v) =>
              update((c) => ({ ...c, home: { ...c.home, description: v } }))
            }
          />
        </Section>

        {/* ── About Page ── */}
        <Section title="About Page">
          <ImageField
            label="About Image"
            src={content.about.image}
            uploading={uploading === "about.image"}
            onUpload={() => uploadImage("about.image")}
            onRemove={() => removeImage("about.image")}
          />
          <Field
            label="Heading"
            value={content.about.heading}
            onChange={(v) =>
              update((c) => ({ ...c, about: { ...c.about, heading: v } }))
            }
          />
          <Field
            label="Image Caption (optional)"
            value={content.about.imageCaption}
            onChange={(v) =>
              update((c) => ({
                ...c,
                about: { ...c.about, imageCaption: v },
              }))
            }
          />

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Paragraphs
            </label>
            {content.about.paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  value={p}
                  onChange={(e) => {
                    const paras = [...content.about.paragraphs];
                    paras[i] = e.target.value;
                    update((c) => ({
                      ...c,
                      about: { ...c.about, paragraphs: paras },
                    }));
                  }}
                  rows={3}
                  className="flex-1 resize-none border border-border bg-background px-3 py-2 text-[13px] font-light leading-relaxed text-foreground outline-none focus:border-foreground"
                />
                <button
                  onClick={() => {
                    const paras = content.about.paragraphs.filter(
                      (_, idx) => idx !== i
                    );
                    update((c) => ({
                      ...c,
                      about: { ...c.about, paragraphs: paras },
                    }));
                  }}
                  className="self-start px-2 py-2 text-[11px] text-muted hover:text-foreground"
                  title="Remove paragraph"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                update((c) => ({
                  ...c,
                  about: {
                    ...c.about,
                    paragraphs: [...c.about.paragraphs, ""],
                  },
                }))
              }
              className="mt-1 self-start border border-dashed border-border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              + Add Paragraph
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ── Reusable field components ── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="mb-6 border-b border-border pb-3 text-[11px] font-medium uppercase tracking-[0.15em]">
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full border border-border bg-background px-3 py-2 text-[13px] font-light text-foreground outline-none focus:border-foreground";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${cls} resize-none leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function ImageField({
  label,
  src,
  uploading,
  onUpload,
  onRemove,
}: {
  label: string;
  src: string;
  uploading: boolean;
  onUpload: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </label>
      {src ? (
        <div className="relative">
          <img
            src={src}
            alt={label}
            className="h-48 w-full rounded border border-border object-cover"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={onUpload}
              className="border border-border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted hover:border-foreground hover:text-foreground"
            >
              Replace
            </button>
            <button
              onClick={onRemove}
              className="border border-border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-red-500 hover:border-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onUpload}
          disabled={uploading}
          className="flex h-36 w-full items-center justify-center border border-dashed border-border text-[11px] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "+ Upload Image"}
        </button>
      )}
    </div>
  );
}
