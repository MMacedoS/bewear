import Image from "next/image";
import { db } from "@/db";
import ProductList from "@/components/common/productList";
import CategorySelector from "@/components/common/categorySelector";
import { desc } from "drizzle-orm";
import { productTable } from "@/db/schema";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreateProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.created_at)],
    limit: 4,
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  return (
    <div className="space-y-6 mb-3">
      <div className="px-5">
        <Image
          src="/banner-01.png"
          alt="Leve uma vida com estilo"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <ProductList title="Mais vendidos" products={products} />

      <div className="px-5 w-full">
        <CategorySelector categories={categories} />
      </div>

      <div className="px-5">
        <Image
          src="/banner-02.png"
          alt="Leve uma vida com estilo"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <ProductList title="Produtos Novos" products={newlyCreateProducts} />
    </div>
  );
};

export default Home;
