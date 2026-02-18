"""SOIC v3.0 — Feedback Router: prioritized web-specific corrective instructions.

Generates concise Markdown feedback for top 5 critical failures.
D4 (Security) and D8 (Legal) are always included.
"""

from __future__ import annotations

from .models import GateResult, GateStatus, PhaseGateReport

# ── Dimension priorities ─────────────────────────────────────────────────────

_DIM_PRIORITY: dict[str, int] = {
    "D4": 0,  # CRITIQUE — Security
    "D8": 0,  # CRITIQUE — Legal
    "D6": 1,  # HAUTE — Accessibility
    "D5": 1,  # HAUTE — Performance
    "D1": 2,  # NORMALE
    "D2": 2,
    "D3": 2,
    "D7": 2,
    "D9": 2,
}

_PRIORITY_LABELS = {0: "CRITIQUE", 1: "HAUTE", 2: "NORMALE"}

MAX_FEEDBACK_ITEMS = 5

# ── Corrective templates per gate (concise: 3 lines max) ────────────────────

_CORRECTIVE_TEMPLATES: dict[str, str] = {
    "PE-01": "Ajouter des sections ## claires, developper chaque section (min 500 chars, 3+ sections).",
    "PE-02": "Ajouter `Score global: X/10` ou `μ = X/10` dans une section ## Evaluation.",
    "PE-03": "Verifier que chaque section du template de phase est presente avec les titres standards.",
    "PE-04": "Remplacer CHAQUE [TODO], [TBD], [INSERT] par du contenu reel.",
    "W-01": "Verifier: app/ (ou src/app/), components/, tsconfig.json, package.json, next.config.mjs.",
    "W-02": "Ecrire README.md 200+ chars. Ajouter JSDoc aux composants principaux.",
    "W-03": "Executer `npx vitest run`, corriger assertions cassees et fixtures manquantes.",
    "W-04": "Executer `npx vitest run --coverage`, ajouter tests pour fichiers non couverts (cible >= 80%).",
    "W-05": "Executer `npm audit fix --force`. Verifier que le build passe apres correction.",
    "W-06": "Ajouter dans vercel.json: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS, CSP.",
    "W-07": "URGENT: Deplacer secrets vers variables server-side. Supprimer NEXT_PUBLIC_*KEY/*SECRET/*TOKEN.",
    "W-08": "Optimiser images (next/image, WebP), reduire JS non utilise (dynamic imports), verifier Core Web Vitals.",
    "W-09": "Utiliser `next/dynamic` pour code splitting. Eviter imports de librairies entieres.",
    "W-10": "Corriger erreurs pa11y: alt images, roles ARIA, contraste, navigation clavier (cible: 0 erreurs WCAG 2.2 AA).",
    "W-11": "Ajouter attributs ARIA manquants, verifier contraste (>= 4.5:1), accessibilite clavier.",
    "W-12": "Verifier meta tags (title, description, viewport, charset, lang). Liens avec texte descriptif.",
    "W-13": "Ajouter metadata dans layout.tsx (title, description, openGraph). Creer sitemap.ts et robots.ts.",
    "W-14": "OBLIGATOIRE: Page confidentialite, mentions legales, bandeau cookies opt-in, RPP identifie.",
    "W-15": "Executer `npx eslint . --fix`. Corriger erreurs restantes manuellement (cible: 0 erreurs).",
    "W-16": "Activer `strict: true` et `noUncheckedIndexedAccess: true` dans tsconfig.json. Eliminer `any`.",
    "W-17": "Aucun cookie non essentiel avant consentement. Verifier banniere opt-in et blocage scripts tiers.",
}


class FeedbackRouter:
    """Generates prioritized corrective feedback for failed gates."""

    def generate(self, report: PhaseGateReport) -> str:
        """Produce concise Markdown feedback: top 5 failures, prioritized by dimension.

        D4/D8 are always included. Sorted by priority then by score (lowest first).
        """
        failed_gates = [
            g for g in report.gates
            if g.status in (GateStatus.FAIL, GateStatus.ERROR)
        ]
        if not failed_gates:
            return "All gates passed. No corrective action needed."

        # Sort: priority (lower = more critical), then score (lower = worse)
        failed_gates.sort(key=lambda g: (_DIM_PRIORITY.get(g.dimension, 2), g.score))

        top = failed_gates[:MAX_FEEDBACK_ITEMS]
        deferred = len(failed_gates) - len(top)

        sections = [
            f"## Corrections requises (Iteration {report.iteration + 1})"
            f" — {len(top)} prioritaires sur {len(failed_gates)} FAIL\n",
        ]

        for gate in top:
            priority = _PRIORITY_LABELS.get(_DIM_PRIORITY.get(gate.dimension, 2), "NORMALE")
            template = _CORRECTIVE_TEMPLATES.get(gate.gate_id, "Review and fix the reported issues.")
            sections.append(
                f"[{gate.dimension}/{gate.gate_id}] {gate.name} — {priority}\n"
                f"→ {gate.evidence}\n"
                f"→ Action : {template}\n"
            )

        if deferred > 0:
            sections.append(f"(+ {deferred} corrections mineures reportees)\n")

        return "\n".join(sections)

    def generate_full(self, report: PhaseGateReport) -> str:
        """Produce full feedback for ALL failed gates (for logging/reports)."""
        failed_gates = [
            g for g in report.gates
            if g.status in (GateStatus.FAIL, GateStatus.ERROR)
        ]
        if not failed_gates:
            return "All gates passed. No corrective action needed."

        failed_gates.sort(key=lambda g: (_DIM_PRIORITY.get(g.dimension, 2), g.score))

        sections = [
            f"## Full Corrective Feedback — {report.phase} Iteration {report.iteration}\n",
            f"**{len(failed_gates)} gate(s) require attention** (μ={report.mu:.2f}):\n",
        ]

        for gate in failed_gates:
            priority = _PRIORITY_LABELS.get(_DIM_PRIORITY.get(gate.dimension, 2), "NORMALE")
            template = _CORRECTIVE_TEMPLATES.get(gate.gate_id, "Review and fix the reported issues.")
            sections.append(
                f"### [{gate.dimension}/{gate.gate_id}] {gate.name} — {priority} (score: {gate.score:.1f}/10)\n"
                f"**Evidence:** {gate.evidence}\n"
                f"**Action:** {template}\n"
            )

        return "\n".join(sections)
