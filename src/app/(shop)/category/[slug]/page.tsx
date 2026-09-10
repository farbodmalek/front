export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <div>دسته‌بندی: {params.slug}</div>;
}
