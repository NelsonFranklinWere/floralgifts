export type PolicySection = { heading: string; body: React.ReactNode };

export default function PolicyPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <div className="min-h-screen bg-green-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-6">{title}</h1>
        <p className="text-brand-gray-600 text-sm md:text-base mb-6">{intro}</p>
        <section className="space-y-5 text-sm md:text-base text-brand-gray-700 [&_a]:underline [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:mt-2">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">{s.heading}</h2>
              {s.body}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
