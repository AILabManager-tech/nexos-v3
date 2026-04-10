import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('common');
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Politique de confidentialit&eacute;</h1>

      <p className="text-sm text-[var(--color-text-muted)] mb-8">Derni&egrave;re mise &agrave; jour : 2026-04-09</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Responsable de la protection des renseignements personnels</h2>
        <p className="mb-2">Conform&eacute;ment &agrave; l&apos;article 3.1 de la Loi 25, le responsable d&eacute;sign&eacute; est :</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Nom :</strong> Mark Systems — Dirigeant principal</li>
          <li><strong>Courriel :</strong> privacy@mark-systems.com</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Renseignements personnels collect&eacute;s</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Nom complet (formulaire de contact)</li>
          <li>Adresse courriel (formulaire de contact)</li>
          <li>Donn&eacute;es de navigation (t&eacute;moins d&apos;analyse, avec consentement)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Finalit&eacute;s de la collecte</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>R&eacute;pondre aux demandes via le formulaire de contact</li>
          <li>Analyse de trafic (uniquement avec consentement explicite)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Consentement</h2>
        <p className="mb-2">Votre consentement est manifeste, libre et &eacute;clair&eacute; (Loi 25, art. 8.1). Les t&eacute;moins d&apos;analyse sont activ&eacute;s uniquement apr&egrave;s votre consentement explicite via le bandeau de consentement.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Dur&eacute;e de conservation</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Donn&eacute;es de contact : 24 mois apr&egrave;s la derni&egrave;re interaction</li>
          <li>T&eacute;moins d&apos;analyse : 13 mois maximum</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Transfert hors Qu&eacute;bec</h2>
        <p className="mb-2">Certaines donn&eacute;es sont transf&eacute;r&eacute;es aux &Eacute;tats-Unis (Vercel Inc. — h&eacute;bergement, Vercel AI SDK). Une &eacute;valuation des facteurs relatifs &agrave; la vie priv&eacute;e a &eacute;t&eacute; r&eacute;alis&eacute;e conform&eacute;ment &agrave; l&apos;article 17 de la Loi 25.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Vos droits</h2>
        <p className="mb-2">Acc&egrave;s, rectification, suppression, retrait du consentement. Envoyez un courriel &agrave; privacy@mark-systems.com. R&eacute;ponse sous 30 jours.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">8. Incident de confidentialit&eacute;</h2>
        <p className="mb-2">Tout incident sera signal&eacute; &agrave; la CAI et aux personnes concern&eacute;es (Loi 25, art. 3.5). Courriel : incident@mark-systems.com</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">9. Plainte</h2>
        <p>Commission d&apos;acc&egrave;s &agrave; l&apos;information du Qu&eacute;bec (CAI) — <a href="https://www.cai.gouv.qc.ca" className="text-[var(--color-primary)] hover:underline" target="_blank" rel="noopener noreferrer">www.cai.gouv.qc.ca</a> — 1-888-528-7741</p>
      </section>
    </div>
  );
}
