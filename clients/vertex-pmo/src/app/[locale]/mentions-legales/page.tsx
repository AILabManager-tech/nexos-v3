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
        ? "Mentions légales de L'Usine RH — identification, hébergement, propriété intellectuelle."
        : "HR Factory legal notice — identification, hosting, intellectual property.",
    alternates: {
      canonical: `https://emiliepoirierrh.ca/${locale}/mentions-legales`,
      languages: {
        fr: "https://emiliepoirierrh.ca/fr/mentions-legales",
        en: "https://emiliepoirierrh.ca/en/mentions-legales",
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

      <div className="prose prose-charcoal max-w-none space-y-8 text-charcoal/80">
        {/* 1. Identification */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "1. Identification de l'entreprise" : "1. Company identification"}
          </h2>
          <ul className="list-none space-y-1 pl-0">
            <li>
              <strong>{isFr ? "Dénomination sociale" : "Legal name"} :</strong>{" "}
              {isFr ? "L'Usine RH" : "HR Factory"} — Émilie Poirier
            </li>
            <li>
              <strong>{isFr ? "Adresse" : "Address"} :</strong> Québec, QC, Canada
            </li>
            <li>
              <strong>{isFr ? "Courriel" : "Email"} :</strong>{" "}
              <a href="mailto:info@emiliepoirierrh.ca" className="text-sage-600 underline">
                info@emiliepoirierrh.ca
              </a>
            </li>
          </ul>
        </section>

        {/* 2. Hébergement */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "2. Hébergement" : "2. Hosting"}
          </h2>
          <ul className="list-none space-y-1 pl-0">
            <li>
              <strong>{isFr ? "Hébergeur" : "Host"} :</strong> Vercel Inc.
            </li>
            <li>
              <strong>{isFr ? "Adresse" : "Address"} :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
            </li>
          </ul>
        </section>

        {/* 3. RPP */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr
              ? "3. Responsable de la protection des renseignements personnels"
              : "3. Person responsible for the protection of personal information"}
          </h2>
          <p>
            {isFr
              ? "Conformément à la Loi 25 du Québec (art. 3.1), le responsable est :"
              : "In accordance with Quebec's Law 25 (s. 3.1), the responsible person is:"}
          </p>
          <ul className="list-none space-y-1 pl-0">
            <li>
              <strong>{isFr ? "Nom" : "Name"} :</strong> Émilie Poirier
            </li>
            <li>
              <strong>{isFr ? "Titre" : "Title"} :</strong>{" "}
              {isFr ? "Propriétaire et consultante RH" : "Owner and HR Consultant"}
            </li>
            <li>
              <strong>{isFr ? "Courriel" : "Email"} :</strong>{" "}
              <a href="mailto:info@emiliepoirierrh.ca" className="text-sage-600 underline">
                info@emiliepoirierrh.ca
              </a>
            </li>
          </ul>
        </section>

        {/* 4. Propriété intellectuelle */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "4. Propriété intellectuelle" : "4. Intellectual property"}
          </h2>
          <p>
            {isFr
              ? "L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est la propriété de L'Usine RH ou de ses partenaires et est protégé par les lois applicables en matière de propriété intellectuelle. Toute reproduction, représentation, modification ou exploitation non autorisée est interdite."
              : "All content on this website (texts, images, graphics, logo, icons, etc.) is the property of HR Factory or its partners and is protected by applicable intellectual property laws. Any unauthorized reproduction, representation, modification or exploitation is prohibited."}
          </p>
        </section>

        {/* 5. Limitation de responsabilité */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "5. Limitation de responsabilité" : "5. Limitation of liability"}
          </h2>
          <p>
            {isFr
              ? "L'Usine RH s'efforce de fournir des informations exactes et à jour sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations présentées. L'Usine RH ne peut être tenue responsable des dommages directs ou indirects résultant de l'utilisation de ce site."
              : "HR Factory strives to provide accurate and up-to-date information on this site. However, we cannot guarantee the accuracy, completeness or timeliness of the information presented. HR Factory cannot be held liable for direct or indirect damages resulting from the use of this site."}
          </p>
        </section>

        {/* 6. Liens externes */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "6. Liens externes" : "6. External links"}
          </h2>
          <p>
            {isFr
              ? "Ce site peut contenir des liens vers des sites externes. L'Usine RH n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu."
              : "This site may contain links to external websites. HR Factory has no control over these sites and disclaims all responsibility for their content."}
          </p>
        </section>

        {/* 7. Droit applicable */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "7. Droit applicable" : "7. Applicable law"}
          </h2>
          <p>
            {isFr
              ? "Les présentes mentions légales sont régies par les lois du Québec et du Canada. Tout litige relatif à l'utilisation de ce site sera soumis aux tribunaux compétents du district judiciaire de Québec."
              : "These legal notices are governed by the laws of Quebec and Canada. Any dispute relating to the use of this site shall be submitted to the competent courts of the judicial district of Quebec."}
          </p>
        </section>

        {/* 8. Contact */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal">
            {isFr ? "8. Contact" : "8. Contact"}
          </h2>
          <p>
            <strong>{isFr ? "L'Usine RH" : "HR Factory"}</strong>
            <br />
            Émilie Poirier
            <br />
            Québec, QC
            <br />
            <a href="mailto:info@emiliepoirierrh.ca" className="text-sage-600 underline">
              info@emiliepoirierrh.ca
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
