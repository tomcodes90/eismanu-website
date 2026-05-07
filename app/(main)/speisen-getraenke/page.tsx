import type { Metadata } from "next";
import Link from "next/link";
import { getMenuItems } from "@/sanity/lib/queries";
import type { MenuItem } from "@/types";

export const metadata: Metadata = {
  title: "Speisekarte — EisManuFaktur Geratal",
  description:
    "Flammkuchen, Pizza und Besonderes — die Speisekarte des EisManuFaktur Geratal in Gräfenroda.",
  alternates: { canonical: "/speisen-getraenke" },
};

const CATEGORY_ORDER = ['flammkuchen', 'pizza', 'besonderes'] as const;

const categoryConfig: Record<string, { label: string; emoji: string }> = {
  flammkuchen: { label: 'Flammkuchen', emoji: '🫓' },
  pizza:       { label: 'Pizza',       emoji: '🍕' },
  besonderes:  { label: 'Besonderes',  emoji: '⭐' },
};

function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  return items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

export default async function SpeisenPage() {
  const items = await getMenuItems();
  const grouped = groupByCategory(items);

  return (
    <>
      {/* Page hero */}
      <section
        className="py-20 px-6"
        style={{
          backgroundImage: "url('/images/background_orange.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-brand-red">Genuss auf dem Teller</p>
          <h1 className="font-kaushan text-5xl text-brand-dark leading-tight mb-4">
            Speisekarte
          </h1>
          <p className="font-nunito text-lg text-brand-mid max-w-xl leading-relaxed">
            Von knusprigem Flammkuchen bis zum hausgemachten Dessert — bei uns
            ist für jeden etwas dabei.
          </p>
        </div>
      </section>

      {/* Menu content */}
      <section
        className="py-16 px-6"
        aria-label="Speisekarte"
        style={{
          backgroundImage: "url('/images/background_orange.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto space-y-16">
          {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => {
            const { label } = categoryConfig[cat];
            const catItems = grouped[cat];
            return (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-brand-red/20">
                  <h2 className="font-kaushan text-3xl text-brand-red">
                    {label}
                  </h2>
                </div>
                <ul className="space-y-5">
                  {catItems.map((item) => (
                    <li
                      key={item._id}
                      className="flex justify-between items-start gap-6"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-kaushan text-lg text-brand-dark">
                            {item.name}
                          </span>
                          {item.vegetarian && !item.vegan && (
                            <span className="text-xs bg-brand-green-light text-brand-green-dark px-2 py-0.5 rounded-full font-nunito">
                              Vegetarisch
                            </span>
                          )}
                          {item.vegan && (
                            <span className="text-xs bg-brand-green-light text-brand-green-dark px-2 py-0.5 rounded-full font-nunito">
                              Vegan
                            </span>
                          )}
                          {item.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-brand-red-light text-brand-red px-2 py-0.5 rounded-full font-nunito"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {item.description && (
                          <p className="font-nunito text-sm text-brand-mid mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.price != null && (
                        <span className="font-kaushan text-xl text-brand-teal whitespace-nowrap flex-shrink-0">
                          {item.price.toFixed(2).replace(".", ",")} €
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {Object.keys(grouped).length === 0 && (
            <p className="font-nunito text-brand-mid text-center py-16">
              Die Speisekarte wird gerade aktualisiert.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-6 text-center"
        style={{
          backgroundImage: "url('/images/background_blue.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="section-label text-white mx-auto">Noch ein Tisch frei?</p>
        <h2 className="section-title mb-4">Jetzt reservieren</h2>
        <p className="section-sub mb-8 mx-auto">
          Sichern Sie sich Ihren Platz — wir freuen uns auf Sie.
        </p>
        <Link href="/#reservierung" className="btn-teal">
          Tisch reservieren
        </Link>
      </section>
    </>
  );
}
