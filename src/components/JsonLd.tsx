// Renders a JSON-LD structured-data script tag.
// Server-safe: this component holds no state and only emits a <script>.
// Pass a plain object (or array of objects) as `data`.

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, static content authored by us.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
