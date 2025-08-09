import ProductList from "@/components/common/productList";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import VariantSelector from "./components/variant-selector";
import ProductActions from "./components/product-actions";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ variant?: string }>;
}

const ProductPage = async ({
  params,
  searchParams,
}: ProductVariantPageProps) => {
  const { slug } = await params;
  const variantSlug = searchParams ? (await searchParams)?.variant : undefined;

  const productVariant = await db.query.productTable.findFirst({
    where: eq(productTable.slug, slug),
    with: {
      variants: {
        with: {
          product: true,
        },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const selectedVariant =
    productVariant.variants.find((v) => v.slug === variantSlug) ??
    productVariant.variants[0];

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.category_id, productVariant.category_id),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <div className="flex flex-col space-y-6 mb-5">
        <div className="h-[380px] relative w-full rounded-3xl">
          <Image
            src={selectedVariant.image_url}
            alt={selectedVariant.name}
            fill
            className="object-cover sm:object-contain rounded-3xl"
          />
        </div>

        <div className="px-5">
          <VariantSelector
            variants={productVariant.variants}
            slug={selectedVariant.slug}
          />
        </div>

        <div className="px-5">
          <h2 className="text-lg font-semibold">{productVariant.name}</h2>
          <h3 className="text-muted-foreground font-semibold">
            {selectedVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(selectedVariant.price_in_cents)}
          </h3>
        </div>
        <ProductActions product_variant_id={selectedVariant.id} />
        <div className="px-5">
          <h2 className="text-lg font-semibold">Descrição</h2>
          <p className="text-muted-foreground text-sm">
            {productVariant.description}
          </p>
        </div>
      </div>
      <ProductList products={likelyProducts} title="Talvez você goste" />
    </>
  );
};

export default ProductPage;
