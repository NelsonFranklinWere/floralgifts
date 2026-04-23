export default async function HomeReviewsSection() {
  const ElfsightGoogleReviews = (await import("./ElfsightGoogleReviews")).default;
  return <ElfsightGoogleReviews />;
}
