export default function LegalNoticesPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Mentions l&eacute;gales</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">Derni&egrave;re mise &agrave; jour : 2026-04-09</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. &Eacute;diteur du site</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>D&eacute;nomination :</strong> Mark Systems Inc.</li>
          <li><strong>NEQ :</strong> &Agrave; confirmer</li>
          <li><strong>Adresse :</strong> &Agrave; confirmer</li>
          <li><strong>Courriel :</strong> contact@mark-systems.com</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. H&eacute;bergement</h2>
        <p className="mb-2">Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, &Eacute;tats-Unis</p>
        <p className="text-sm text-[var(--color-text-muted)]">Transfert conforme &agrave; la Loi 25, art. 17.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Propri&eacute;t&eacute; intellectuelle</h2>
        <p>L&apos;ensemble du contenu est la propri&eacute;t&eacute; exclusive de Mark Systems Inc. Toute reproduction sans autorisation est interdite.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Limitation de responsabilit&eacute;</h2>
        <p>Plateforme fournie &laquo; en l&apos;&eacute;tat &raquo; sans garantie. Mark Systems Inc. d&eacute;cline toute responsabilit&eacute; pour dommages directs ou indirects.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Droit applicable</h2>
        <p>Lois de la province de Qu&eacute;bec et lois f&eacute;d&eacute;rales du Canada.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Contact</h2>
        <p><a href="mailto:contact@mark-systems.com" className="text-[var(--color-primary)] hover:underline">contact@mark-systems.com</a></p>
      </section>
    </div>
  );
}
