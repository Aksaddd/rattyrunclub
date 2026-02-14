import Link from "next/link";
import Nav from "@/components/Nav";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { products } = await getContent();

  return (
    <div className="min-h-screen">
      <div className="p-10 sm:p-12 md:p-14 lg:p-20">
        <Nav />
      </div>

      <div className="px-10 pb-20 sm:px-12 md:px-14 lg:px-20">
        <h1 className="mb-12 text-[13px] font-semibold uppercase tracking-[0.2em]">
          Shop
        </h1>

        {products.length === 0 ? (
          <p className="text-[14px] font-light text-muted">
            No products yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group border border-border transition-colors hover:border-foreground"
              >
                <div className="aspect-square overflow-hidden bg-surface">
                  {product.mainImage ? (
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[12px] text-muted">No image</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-border px-5 py-4">
                  <p className="text-[13px] font-medium uppercase tracking-[0.1em]">
                    {product.name}
                  </p>
                  {product.subtitle && (
                    <p className="mt-1 text-[12px] font-light text-muted">
                      {product.subtitle}
                    </p>
                  )}
                  <p className="mt-2 text-[13px] font-medium">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
