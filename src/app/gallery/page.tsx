import Nav from "@/components/Nav";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { gallery } = await getContent();

  return (
    <div className="min-h-screen">
      <div className="p-10 sm:p-12 md:p-14 lg:p-20">
        <Nav />
      </div>

      <div className="px-10 pb-20 sm:px-12 md:px-14 lg:px-20">
        <h1 className="mb-12 text-[13px] font-semibold uppercase tracking-[0.2em]">
          Gallery
        </h1>

        {gallery.length === 0 ? (
          <p className="text-[14px] font-light text-muted">
            No images yet.
          </p>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {gallery.map((item) => (
              <div key={item.id} className="mb-6 break-inside-avoid">
                <img
                  src={item.image}
                  alt={item.caption || "Gallery"}
                  className="w-full object-cover"
                />
                {item.caption && (
                  <p className="mt-3 text-[12px] font-light leading-relaxed text-muted">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
