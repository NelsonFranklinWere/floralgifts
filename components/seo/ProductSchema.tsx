import JsonLdScript from "./JsonLdScript";
import { buildProductSchema, buildBreadcrumbSchema, type ProductSchemaInput } from "@/lib/seo/schema";

interface ProductSchemaProps extends ProductSchemaInput {
  collectionPath: string;
  collectionName: string;
}

/** Dynamic Product + Breadcrumb JSON-LD for product detail pages. */
export default function ProductSchema({
  collectionPath,
  collectionName,
  ...product
}: ProductSchemaProps) {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: collectionName, path: collectionPath },
    { name: product.title, path: `/product/${product.slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={buildProductSchema(product)} />
      <JsonLdScript data={breadcrumb} />
    </>
  );
}
