import CategoryLandingPage, { categoryMetadata } from "@/components/seo/CategoryLandingPage";

const SLUG = "valentines-gifts-nairobi";

export const revalidate = 300;
export const metadata = categoryMetadata(SLUG);

export default function Page() {
  return <CategoryLandingPage slug={SLUG} />;
}
