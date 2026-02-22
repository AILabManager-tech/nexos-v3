import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { CookieSettingsButton } from "@/components/legal/CookieConsent";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-charcoal-dark text-slate-400">
      <div className="h-1 bg-gradient-to-r from-cobalt-500 via-orange-400 to-success-500" />

      <div className="relative border-b border-charcoal bg-gradient-to-r from-charcoal-dark via-charcoal to-charcoal-dark px-6 py-10 text-center">
        <div className="absolute inset-0 grid-overlay opacity-10" />
        <div className="relative z-10">
          <p className="mb-5 font-heading text-2xl font-bold text-slate-200">
            {t("cta")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-cobalt-500 px-8 py-3 font-medium text-white transition-all hover:bg-cobalt-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-cobalt-500/20"
          >
            {t("cta_button")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-heading text-xl font-bold text-slate-200">
              Vertex<span className="text-cobalt-400"> PMO</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">{t("tagline")}</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-slate-200">{nav("home")}</Link>
              <Link href="/services" className="text-sm text-slate-500 transition-colors hover:text-slate-200">{nav("services")}</Link>
              <Link href="/a-propos" className="text-sm text-slate-500 transition-colors hover:text-slate-200">{nav("about")}</Link>
              <Link href="/contact" className="text-sm text-slate-500 transition-colors hover:text-slate-200">{nav("contact")}</Link>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Contact
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <p>Gatineau-Ottawa, QC-ON</p>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-slate-200"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="section-divider mt-10 mb-6 opacity-20" />
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/politique-confidentialite" className="text-xs text-slate-400 transition-colors hover:text-slate-200">
            {locale === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
          </Link>
          <Link href="/mentions-legales" className="text-xs text-slate-400 transition-colors hover:text-slate-200">
            {locale === "fr" ? "Mentions légales" : "Legal Notice"}
          </Link>
          <CookieSettingsButton />
        </div>
        <div className="mt-4 text-center text-xs text-slate-500">
          &copy; {year} {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
