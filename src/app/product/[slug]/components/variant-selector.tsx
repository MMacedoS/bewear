import { productTable, productVariantsTable } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

interface VariantSelectorProps {
  variants: (typeof productVariantsTable.$inferSelect & {
    product: typeof productTable.$inferSelect;
  })[];
  slug: string;
}

const VariantSelector = ({ variants, slug }: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          href={`/product/${variant.product.slug}?variant=${variant.slug}`}
          key={variant.id}
          className={
            slug === variant.slug ? "border-primary border-2 rounded-xl" : ""
          }
        >
          <Image
            width={68}
            height={68}
            src={variant.image_url}
            alt={variant.name}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
