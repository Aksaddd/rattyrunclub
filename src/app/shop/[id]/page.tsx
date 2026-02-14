import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import ProductSlideshow from "@/components/ProductSlideshow";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { products } = await getContent();
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  return (
    <div className="min-h-screen">
      <div className="px-[48px] pt-[40px] sm:px-[64px] sm:pt-[48px] md:px-[72px] md:pt-[56px] lg:px-[96px] lg:pt-[72px]">
        <Nav />
      </div>

      <div className="px-[48px] pb-8 pt-10 sm:px-[64px] md:px-[72px] lg:px-[96px]">
        <div className="flex flex-col gap-12 md:flex-row md:gap-16">
          {/* ── Left: Main image ── */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square overflow-hidden bg-surface">
              {product.mainImage ? (
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[12px] text-muted">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product info ── */}
          <div className="flex w-full flex-col justify-center md:w-1/2">
            <h1 className="text-[14px] font-semibold uppercase tracking-[0.15em]">
              {product.name}
            </h1>
            {product.subtitle && (
              <p className="mt-3 max-w-[400px] text-[14px] font-light leading-relaxed text-muted">
                {product.subtitle}
              </p>
            )}
            <p className="mt-6 text-[16px] font-medium">
              {product.price}
            </p>
          </div>
        </div>
      </div>

      {/* ── Horizontal scroll slideshow ── */}
      {product.images.length > 0 && (
        <ProductSlideshow images={product.images} name={product.name} />
      )}
    </div>
  );
}
