import type { Metadata } from "next";
import { useLocale } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Mentions légales" : "Legal Notice",
    description:
      locale === "fr"
        ? "Mentions légales de Vertex PMO — identification, hébergement, propriété intellectuelle."
        : "Vertex PMO legal notice — identification, hosting, intellectual property.",
    alternates: {
      canonical: `https://vertex-pmo.vercel.app/${locale}/mentions-legales`,
      languages: {
        fr: "https://vertex-pmo.vercel.app/fr/mentions-legales",
        en: "https://vertex-pmo.vercel.app/en/mentions-legales",
      },
    },
  };
}

export default function LegalNoticePage() {
  const locale = useLocale();
  const isFr = locale === "fr";

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-8 font-heading text-3xl font-bold text-charcoal">
        {isFr ? "Mentions légales" : "Legal Notice"}
      </h1>

      <div className="prose prose-charcoal max-w-none space-y-8 text-charcoal-light">
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "1. Identification de l'entreprise" : "1. Company identification"}
          </h2>
          <ul className="list-none space-y-1 pl-0">
            <li><strong>{isFr ? "Dénomination sociale" : "Legal name"} :</strong> Vertex PMO inc.</li>
            <li><strong>{isFr ? "Adresse" : "Address"} :</strong> Gatineau, QC, Canada</li>
            <li><strong>{isFr ? "Courriel" : "Email"} :</strong>{" "}
              <a href="mailto:info@vertex-pmo.ca" className="text-cobalt-600 underline">info@vertex-pmo.ca</a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "2. Hébergement" : "2. Hosting"}
          </h2>
          <ul className="list-none space-y-1 pl-0">
            <li><strong>{isFr ? "Hébergeur" : "Host"} :</strong> Vercel Inc.</li>
            <li><strong>{isFr ? "Adresse" : "Address"} :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "3. Responsable de la protection des renseignements personnels" : "3. Person responsible for the protection of personal information"}
          </h2>
          <p>{isFr ? "Conformément à la Loi 25 du Québec (art. 3.1), le responsable est :" : "In accordance with Quebec's Law 25 (s. 3.1), the responsible person is:"}</p>
          <ul className="list-none space-y-1 pl-0">
            <li><strong>{isFr ? "Nom" : "Name"} :</strong> Direction, Vertex PMO inc.</li>
            <li><strong>{isFr ? "Titre" : "Title"} :</strong> {isFr ? "Directeur général" : "Managing Director"}</li>
            <li><strong>{isFr ? "Courriel" : "Email"} :</strong>{" "}
              <a href="mailto:info@vertex-pmo.ca" className="text-cobalt-600 underline">info@vertex-pmo.ca</a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "4. Propriété intellectuelle" : "4. Intellectual property"}
          </h2>
          <p>{isFr
            ? "L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est la propriété de Vertex PMO inc. ou de ses partenaires et est protégé par les lois applicables en matière de propriété intellectuelle."
            : "All content on this website (texts, images, graphics, logo, icons, etc.) is the property of Vertex PMO Inc. or its partners and is protected by applicable intellectual property laws."}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "5. Limitation de responsabilité" : "5. Limitation of liability"}
          </h2>
          <p>{isFr
            ? "Vertex PMO s'efforce de fournir des informations exactes et à jour sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations présentées."
            : "Vertex PMO strives to provide accurate and up-to-date information on this site. However, we cannot guarantee the accuracy, completeness or timeliness of the information presented."}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "6. Droit applicable" : "6. Applicable law"}
          </h2>
          <p>{isFr
            ? "Les présentes mentions légales sont régies par les lois du Québec et du Canada. Tout litige sera soumis aux tribunaux compétents du district judiciaire de Gatineau."
            : "These legal notices are governed by the laws of Quebec and Canada. Any dispute shall be submitted to the competent courts of the judicial district of Gatineau."}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "7. Contact" : "7. Contact"}
          </h2>
          <p>
            <strong>Vertex PMO inc.</strong><br />
            Gatineau, QC<br />
            <a href="mailto:info@vertex-pmo.ca" className="text-cobalt-600 underline">info@vertex-pmo.ca</a>
          </p>
        </section>
      </div>
    </main>
  );
}
