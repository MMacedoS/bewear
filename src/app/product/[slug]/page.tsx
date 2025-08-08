import ProductList from "@/components/common/productList";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productTable, productVariantsTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantsTable.findFirst({
    where: eq(productVariantsTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.category_id, productVariant.product.category_id),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <div className="flex flex-col space-y-6 mb-5">
        <div className="h-[380px] relative w-full rounded-3xl">
          <Image
            src={productVariant.image_url}
            alt={productVariant.name}
            fill
            className="object-cover sm:object-contain rounded-3xl"
          />
        </div>

        <div className="px-5">
          <VariantSelector
            variants={productVariant.product.variants}
            slug={productVariant.slug}
          />
        </div>

        <div className="px-5">
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground font-semibold">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.price_in_cents)}
          </h3>
        </div>
        <div>quantidade</div>
        <div className="px-5 space-y-4 flex flex-col">
          <Button className="rounded-full" size="lg" variant="outline">
            Adicionar a sacola
          </Button>
          <Button className="rounded-full" size="lg">
            Compre agora
          </Button>
        </div>
        <div className="px-5">
          <h2 className="text-lg font-semibold">Descrição</h2>
          <p className="text-muted-foreground text-sm">
            {productVariant.product.description}
          </p>
        </div>
      </div>
      <ProductList products={likelyProducts} title="Talvez você goste" />
    </>
  );
};

export default ProductPage;
