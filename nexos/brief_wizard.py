"""
NEXOS v4.0 — Brief Wizard Interactif
Génère un brief-client.json complet via Q/A en terminal.
"""

import re
import sys
from datetime import datetime
from typing import Any, Optional

try:
    import questionary
    from questionary import Style
except ImportError:
    raise ImportError(
        "questionary est requis pour le wizard interactif.\n"
        "  pip install questionary"
    )

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
except ImportError:
    class Console:
        def print(self, *a, **kw):
            print(*a)
    Panel = None
    Table = None

console = Console()

# ── Style questionary ────────────────────────────────────────────────────────
WIZARD_STYLE = Style([
    ("qmark", "fg:yellow bold"),
    ("question", "fg:white bold"),
    ("answer", "fg:cyan bold"),
    ("pointer", "fg:yellow bold"),
    ("highlighted", "fg:yellow bold"),
    ("selected", "fg:cyan"),
])

# ── Constantes ───────────────────────────────────────────────────────────────
SITE_TYPES = ["vitrine", "ecommerce", "portfolio", "blog", "application"]

PAGE_PRESETS = {
    "vitrine":     ["accueil", "services", "a-propos", "equipe", "contact"],
    "ecommerce":   ["accueil", "boutique", "produit", "panier", "a-propos",
                    "contact", "livraison-retours", "blogue"],
    "portfolio":   ["accueil", "projets", "a-propos", "services", "contact"],
    "blog":        ["accueil", "articles", "categories", "a-propos", "contact"],
    "application": ["landing", "login", "dashboard", "profil", "a-propos",
                    "contact"],
}

LEGAL_PAGES = ["politique-confidentialite", "mentions-legales"]

FEATURES_LIST = [
    "formulaire-contact", "carte-google", "chatbot", "infolettre",
    "e-commerce", "analytics", "calendrier", "autre",
]

LANGUAGES = [
    {"name": "Français", "value": "fr", "checked": True},
    {"name": "English", "value": "en", "checked": True},
    {"name": "Español", "value": "es"},
    {"name": "Deutsch", "value": "de"},
    {"name": "Italiano", "value": "it"},
]

HOSTING_OPTIONS = ["Vercel", "IONOS", "Autre"]

DATA_TYPES = [
    "nom", "courriel", "téléphone", "adresse",
    "paiement", "navigation", "localisation", "sensible",
]

PURPOSE_OPTIONS = [
    "communication", "marketing", "commandes",
    "analytics", "amélioration-service", "obligation-légale",
]

CONSENT_OPTIONS = [
    "opt-in (recommandé Loi 25)",
    "opt-out",
    "gestion complète (granulaire)",
]


# ── Safe ask wrapper ─────────────────────────────────────────────────────────
def _safe_ask(question: questionary.Question) -> Any:
    """Exécute une question questionary, lève KeyboardInterrupt si annulé."""
    result = question.ask()
    if result is None:
        raise KeyboardInterrupt("Wizard annulé par l'utilisateur.")
    return result


# ── Slugify ──────────────────────────────────────────────────────────────────
def _slugify(name: str) -> str:
    """Génère un slug URL-friendly à partir d'un nom."""
    import unicodedata
    slug = unicodedata.normalize("NFC", name).lower().strip()
    slug = unicodedata.normalize("NFD", slug)
    slug = "".join(c for c in slug if unicodedata.category(c) != "Mn")
    slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    return slug


# ── Phase 1 : Informations entreprise ────────────────────────────────────────
def _ask_company_info() -> dict:
    """Collecte les informations de l'entreprise."""
    console.print(Panel("📋 Informations de l'entreprise", style="bold cyan"))

    name = _safe_ask(questionary.text(
        "Nom de l'entreprise :",
        validate=lambda t: len(t) >= 2 or "Minimum 2 caractères",
        style=WIZARD_STYLE,
    ))

    default_slug = _slugify(name)
    slug = _safe_ask(questionary.text(
        "Slug (URL-friendly) :",
        default=default_slug,
        validate=lambda t: bool(re.match(r"^[a-z0-9][a-z0-9-]*[a-z0-9]$", t))
        or len(t) == 1 and t.isalnum()
        or "Slug invalide (lettres minuscules, chiffres, tirets)",
        style=WIZARD_STYLE,
    ))

    neq = _safe_ask(questionary.text(
        "NEQ (optionnel, 10 chiffres) :",
        validate=lambda t: t == "" or bool(re.match(r"^\d{10}$", t))
        or "Format: 10 chiffres ou laisser vide",
        style=WIZARD_STYLE,
    ))

    address = _safe_ask(questionary.text(
        "Adresse du siège :",
        validate=lambda t: len(t) >= 5 or "Minimum 5 caractères",
        style=WIZARD_STYLE,
    ))

    phone = _safe_ask(questionary.text(
        "Téléphone :",
        validate=lambda t: len(t) > 0 or "Champ requis",
        style=WIZARD_STYLE,
    ))

    email = _safe_ask(questionary.text(
        "Courriel principal :",
        validate=lambda t: "@" in t or "Doit contenir un @",
        style=WIZARD_STYLE,
    ))

    return {
        "name": name,
        "slug": slug,
        "neq": neq or None,
        "address": address,
        "phone": phone,
        "email": email,
    }


# ── Phase 2 : Configuration du site ──────────────────────────────────────────
def _ask_site_config() -> dict:
    """Collecte la configuration du site."""
    console.print(Panel("🌐 Configuration du site", style="bold cyan"))

    site_type = _safe_ask(questionary.select(
        "Type de site :",
        choices=SITE_TYPES,
        style=WIZARD_STYLE,
    ))

    preset = PAGE_PRESETS[site_type]
    page_choices = [
        questionary.Choice(p, checked=(p in preset))
        for p in sorted(set(preset + ["accueil", "contact", "a-propos",
                                       "services", "equipe", "blogue",
                                       "projets", "faq"]))
    ]
    pages = _safe_ask(questionary.checkbox(
        "Pages souhaitées :",
        choices=page_choices,
        style=WIZARD_STYLE,
        validate=lambda r: len(r) > 0 or "Sélectionnez au moins une page",
    ))
    # Ajouter les pages légales obligatoires (Loi 25)
    for lp in LEGAL_PAGES:
        if lp not in pages:
            pages.append(lp)

    features = _safe_ask(questionary.checkbox(
        "Fonctionnalités :",
        choices=FEATURES_LIST,
        style=WIZARD_STYLE,
    ))

    lang_choices = [
        questionary.Choice(l["name"], value=l["value"],
                           checked=l.get("checked", False))
        for l in LANGUAGES
    ]
    languages = _safe_ask(questionary.checkbox(
        "Langues du site :",
        choices=lang_choices,
        style=WIZARD_STYLE,
        validate=lambda r: len(r) > 0 or "Au moins une langue requise",
    ))

    hosting = _safe_ask(questionary.select(
        "Hébergement :",
        choices=HOSTING_OPTIONS,
        default="Vercel",
        style=WIZARD_STYLE,
    ))

    domain = _safe_ask(questionary.text(
        "Domaine cible (optionnel) :",
        style=WIZARD_STYLE,
    ))

    return {
        "type": site_type,
        "pages": pages,
        "features": features,
        "languages": languages,
        "hosting": hosting,
        "domain": domain or None,
    }


# ── Phase 3 : Questions adaptatives ──────────────────────────────────────────
def _ask_adaptive(site_type: str, features: list) -> dict:
    """Questions spécifiques selon le type de site et les features."""
    adaptive = {}

    if site_type == "ecommerce":
        console.print(Panel("🛒 Configuration e-commerce", style="bold yellow"))

        adaptive["payment_provider"] = _safe_ask(questionary.select(
            "Fournisseur de paiement :",
            choices=["Stripe", "Square", "PayPal", "Autre"],
            style=WIZARD_STYLE,
        ))
        adaptive["product_count"] = _safe_ask(questionary.text(
            "Nombre approximatif de produits :",
            default="10-50",
            style=WIZARD_STYLE,
        ))
        adaptive["shipping"] = _safe_ask(questionary.confirm(
            "Livraison physique requise ?",
            default=True,
            style=WIZARD_STYLE,
        ))
        if adaptive["shipping"]:
            adaptive["shipping_zones"] = _safe_ask(questionary.text(
                "Zones de livraison :",
                default="Québec, Canada",
                style=WIZARD_STYLE,
            ))
        adaptive["inventory"] = _safe_ask(questionary.confirm(
            "Gestion d'inventaire requise ?",
            default=True,
            style=WIZARD_STYLE,
        ))

    elif site_type == "portfolio":
        console.print(Panel("🎨 Configuration portfolio", style="bold yellow"))

        adaptive["display_mode"] = _safe_ask(questionary.select(
            "Affichage des projets :",
            choices=["grille", "liste", "études de cas", "slider"],
            style=WIZARD_STYLE,
        ))
        adaptive["case_studies"] = _safe_ask(questionary.confirm(
            "Études de cas détaillées ?",
            default=True,
            style=WIZARD_STYLE,
        ))

    elif site_type == "blog":
        console.print(Panel("📝 Configuration blog", style="bold yellow"))

        adaptive["publish_frequency"] = _safe_ask(questionary.select(
            "Fréquence de publication :",
            choices=["quotidien", "hebdomadaire", "bimensuel", "mensuel", "occasionnel"],
            style=WIZARD_STYLE,
        ))
        adaptive["comments"] = _safe_ask(questionary.confirm(
            "Activer les commentaires ?",
            default=False,
            style=WIZARD_STYLE,
        ))
        adaptive["categories_tags"] = _safe_ask(questionary.confirm(
            "Catégories et tags ?",
            default=True,
            style=WIZARD_STYLE,
        ))

    elif site_type == "application":
        console.print(Panel("⚙️  Configuration application", style="bold yellow"))

        adaptive["auth_required"] = _safe_ask(questionary.confirm(
            "Authentification requise ?",
            default=True,
            style=WIZARD_STYLE,
        ))
        if adaptive["auth_required"]:
            adaptive["auth_methods"] = _safe_ask(questionary.checkbox(
                "Méthodes d'authentification :",
                choices=["email/password", "Google", "GitHub", "Magic Link"],
                style=WIZARD_STYLE,
                validate=lambda r: len(r) > 0 or "Au moins une méthode requise",
            ))
            adaptive["user_types"] = _safe_ask(questionary.text(
                "Types d'utilisateurs (séparés par virgule) :",
                default="admin, utilisateur",
                style=WIZARD_STYLE,
            ))
        adaptive["realtime"] = _safe_ask(questionary.confirm(
            "Fonctionnalités temps réel ?",
            default=False,
            style=WIZARD_STYLE,
        ))

    # Features transversales
    if "infolettre" in features:
        adaptive["newsletter_provider"] = _safe_ask(questionary.select(
            "Fournisseur infolettre :",
            choices=["Resend", "Mailchimp", "ConvertKit", "Brevo"],
            style=WIZARD_STYLE,
        ))

    if "analytics" in features:
        adaptive["analytics_provider"] = _safe_ask(questionary.select(
            "Fournisseur analytics :",
            choices=["GA4", "Plausible", "Umami", "Aucun"],
            style=WIZARD_STYLE,
        ))

    return adaptive


# ── Phase 4 : Loi 25 ─────────────────────────────────────────────────────────
def _ask_legal_loi25(site_type: str, features: list, adaptive: dict) -> dict:
    """Questions obligatoires pour la conformité Loi 25 du Québec."""
    console.print(Panel(
        "⚖️  Conformité Loi 25 du Québec — OBLIGATOIRE",
        style="bold red",
    ))

    # RPP (Responsable de la Protection des renseignements Personnels)
    console.print("[bold]Responsable de la protection des renseignements personnels (RPP)[/]")
    rpp_name = _safe_ask(questionary.text(
        "Nom du RPP :",
        validate=lambda t: len(t) >= 2 or "Champ requis",
        style=WIZARD_STYLE,
    ))
    rpp_email = _safe_ask(questionary.text(
        "Courriel du RPP :",
        validate=lambda t: "@" in t or "Doit contenir un @",
        style=WIZARD_STYLE,
    ))
    rpp_title = _safe_ask(questionary.text(
        "Titre/fonction du RPP :",
        default="Responsable de la protection des renseignements personnels",
        style=WIZARD_STYLE,
    ))

    # Données collectées — pré-cochées selon le type
    default_data = ["nom", "courriel"]
    if site_type == "ecommerce":
        default_data += ["téléphone", "adresse", "paiement"]
    if "formulaire-contact" in features:
        default_data += ["téléphone"]
    if "analytics" in features:
        default_data += ["navigation"]

    data_choices = [
        questionary.Choice(d, checked=(d in default_data))
        for d in DATA_TYPES
    ]
    data_collected = _safe_ask(questionary.checkbox(
        "Types de données collectées :",
        choices=data_choices,
        style=WIZARD_STYLE,
        validate=lambda r: len(r) > 0 or "Au moins un type requis",
    ))

    # Alerte données sensibles
    if "sensible" in data_collected:
        console.print(Panel(
            "[bold red]⚠ ATTENTION — Données sensibles[/]\n"
            "La Loi 25 impose des obligations renforcées pour les données sensibles :\n"
            "• Évaluation des facteurs relatifs à la vie privée (EFVP) obligatoire\n"
            "• Consentement explicite et distinct requis\n"
            "• Mesures de sécurité renforcées",
            style="red",
        ))

    # Finalités — pré-cochées selon features
    default_purposes = ["communication"]
    if "infolettre" in features:
        default_purposes.append("marketing")
    if site_type == "ecommerce":
        default_purposes.append("commandes")
    if "analytics" in features:
        default_purposes.append("analytics")

    purpose_choices = [
        questionary.Choice(p, checked=(p in default_purposes))
        for p in PURPOSE_OPTIONS
    ]
    purposes = _safe_ask(questionary.checkbox(
        "Finalités du traitement des données :",
        choices=purpose_choices,
        style=WIZARD_STYLE,
        validate=lambda r: len(r) > 0 or "Au moins une finalité requise",
    ))

    # Rétention
    default_retention = "5 ans (obligation fiscale)" if "paiement" in data_collected else "24 mois"
    retention = _safe_ask(questionary.text(
        "Durée de rétention des données :",
        default=default_retention,
        style=WIZARD_STYLE,
    ))

    # Transfert hors Québec
    hosting = adaptive.get("_hosting", "Vercel")
    default_transfer = hosting in ("Vercel", "Autre")
    transfer_outside_qc = _safe_ask(questionary.confirm(
        "Transfert de données hors Québec ?",
        default=default_transfer,
        style=WIZARD_STYLE,
    ))

    transfer_countries = []
    if transfer_outside_qc:
        country_choices = ["États-Unis", "Canada (hors QC)", "Europe (UE)", "Autre"]
        preselected = []
        if hosting == "Vercel":
            preselected.append("États-Unis")
        transfer_countries = _safe_ask(questionary.checkbox(
            "Pays/régions de transfert :",
            choices=[
                questionary.Choice(c, checked=(c in preselected))
                for c in country_choices
            ],
            style=WIZARD_STYLE,
        ))

    # Services tiers — auto-compilés
    third_party = []
    if hosting == "Vercel":
        third_party.append("Vercel (hébergement)")
    if "analytics" in features:
        provider = adaptive.get("analytics_provider", "analytics")
        third_party.append(f"{provider} (analytics)")
    if "infolettre" in features:
        provider = adaptive.get("newsletter_provider", "infolettre")
        third_party.append(f"{provider} (infolettre)")
    if site_type == "ecommerce":
        provider = adaptive.get("payment_provider", "paiement")
        third_party.append(f"{provider} (paiement)")

    console.print(f"  Services tiers détectés : {', '.join(third_party) or 'aucun'}")

    # Consentement cookies
    consent_mode = _safe_ask(questionary.select(
        "Mode de consentement cookies :",
        choices=CONSENT_OPTIONS,
        style=WIZARD_STYLE,
    ))

    # Incident
    incident_process = _safe_ask(questionary.confirm(
        "Processus d'incident de confidentialité en place ?",
        default=False,
        style=WIZARD_STYLE,
    ))
    incident_email = _safe_ask(questionary.text(
        "Courriel de notification d'incident :",
        default=rpp_email,
        style=WIZARD_STYLE,
    ))

    return {
        "rpp": {
            "name": rpp_name,
            "email": rpp_email,
            "title": rpp_title,
        },
        "data_collected": data_collected,
        "purposes": purposes,
        "retention": retention,
        "transfer_outside_qc": transfer_outside_qc,
        "transfer_countries": transfer_countries,
        "third_party_services": third_party,
        "consent_mode": consent_mode,
        "incident": {
            "process_in_place": incident_process,
            "notification_email": incident_email,
        },
    }


# ── Phase 5 : Design ─────────────────────────────────────────────────────────
def _ask_design() -> dict:
    """Collecte les préférences visuelles."""
    console.print(Panel("🎨 Design & Identité visuelle", style="bold cyan"))

    palette = _safe_ask(questionary.text(
        "Palette de couleurs (optionnel, ex: #1a1a2e, #16213e) :",
        style=WIZARD_STYLE,
    ))

    typography = _safe_ask(questionary.text(
        "Typographies préférées (optionnel, ex: Inter, Playfair Display) :",
        style=WIZARD_STYLE,
    ))

    visual_style = _safe_ask(questionary.select(
        "Style visuel :",
        choices=["minimaliste", "coloré", "corporatif", "créatif"],
        style=WIZARD_STYLE,
    ))

    logo_provided = _safe_ask(questionary.confirm(
        "Logo fourni ?",
        default=False,
        style=WIZARD_STYLE,
    ))

    references = _safe_ask(questionary.text(
        "URLs de référence (optionnel, séparées par virgule) :",
        style=WIZARD_STYLE,
    ))

    return {
        "palette": palette or None,
        "typography": typography or None,
        "style": visual_style,
        "logo_provided": logo_provided,
        "references": [r.strip() for r in references.split(",") if r.strip()] if references else [],
    }


# ── Phase 6 : Contexte SEO ───────────────────────────────────────────────────
def _ask_context_seo() -> dict:
    """Collecte le contexte concurrentiel et SEO."""
    console.print(Panel("🔍 Contexte & SEO", style="bold cyan"))

    competitors = _safe_ask(questionary.text(
        "URLs concurrents (séparées par virgule, optionnel) :",
        style=WIZARD_STYLE,
    ))

    keywords = _safe_ask(questionary.text(
        "Mots-clés SEO prioritaires (séparés par virgule, optionnel) :",
        style=WIZARD_STYLE,
    ))

    free_text = _safe_ask(questionary.text(
        "Contexte libre / notes supplémentaires :",
        style=WIZARD_STYLE,
    ))

    return {
        "competitors": [c.strip() for c in competitors.split(",") if c.strip()] if competitors else [],
        "keywords_seo": [k.strip() for k in keywords.split(",") if k.strip()] if keywords else [],
        "free_text": free_text or None,
    }


# ── Phase 7 : Récapitulatif ──────────────────────────────────────────────────
SECTION_NAMES = {
    "company": "Entreprise",
    "site": "Configuration du site",
    "adaptive": "Config. spécifique",
    "legal": "Loi 25 / Légal",
    "design": "Design",
    "context": "Contexte & SEO",
}

def _review_brief(brief: dict) -> bool:
    """Affiche un récapitulatif du brief et demande confirmation."""
    console.print()
    console.print(Panel("📋 Récapitulatif du brief", style="bold green"))

    table = Table(show_header=True, header_style="bold cyan", border_style="dim")
    table.add_column("Section", style="bold", width=22)
    table.add_column("Détails", min_width=40)

    # Client
    client = brief["client"]
    table.add_row("Client", f"{client['name']} ({client['slug']})")

    # Entreprise
    co = brief["company"]
    table.add_row("Courriel", co["email"])
    table.add_row("Téléphone", co["phone"])
    table.add_row("Adresse", co["address"])
    if co.get("neq"):
        table.add_row("NEQ", co["neq"])

    table.add_section()

    # Site
    site = brief["site"]
    table.add_row("Type de site", f"[bold yellow]{site['type']}[/]")
    table.add_row("Pages", ", ".join(site["pages"]))
    table.add_row("Langues", ", ".join(site["languages"]))
    table.add_row("Features", ", ".join(site["features"]) or "—")
    table.add_row("Hébergement", site["hosting"])
    if site.get("domain"):
        table.add_row("Domaine", site["domain"])

    table.add_section()

    # Adaptatif (résumé)
    if brief.get("adaptive"):
        adaptive_summary = ", ".join(
            f"{k}: {v}" for k, v in brief["adaptive"].items()
            if not str(k).startswith("_")
        )
        if adaptive_summary:
            table.add_row("Config. spécifique", adaptive_summary[:80])

    # Loi 25
    legal = brief["legal"]
    rpp = legal["rpp"]
    table.add_row("RPP", f"{rpp['name']} <{rpp['email']}>")
    table.add_row("Données", ", ".join(legal["data_collected"]))
    table.add_row("Finalités", ", ".join(legal["purposes"]))
    table.add_row("Rétention", legal["retention"])
    table.add_row("Transfert hors QC",
                  "[yellow]Oui[/]" if legal["transfer_outside_qc"] else "Non")
    table.add_row("Consentement", legal["consent_mode"])

    table.add_section()

    # Design
    design = brief["design"]
    table.add_row("Style visuel", design["style"])
    if design.get("palette"):
        table.add_row("Palette", design["palette"])
    table.add_row("Logo fourni", "Oui" if design["logo_provided"] else "Non")

    # Contexte
    ctx = brief["context"]
    if ctx.get("keywords_seo"):
        table.add_row("Mots-clés SEO", ", ".join(ctx["keywords_seo"]))

    console.print(table)
    console.print()

    return _safe_ask(questionary.confirm(
        "Ce brief est-il correct ?",
        default=True,
        style=WIZARD_STYLE,
    ))


# ── Assemblage ────────────────────────────────────────────────────────────────
def _assemble_brief(mode: str, company: dict, site: dict, adaptive: dict,
                    legal: dict, design: dict, context: dict) -> dict:
    """Assemble le brief final conforme au schema."""
    return {
        "_meta": {
            "generator": "nexos-v4.0-wizard",
            "created_at": datetime.now().isoformat(),
            "mode": mode,
        },
        "client": {
            "name": company["name"],
            "slug": company["slug"],
        },
        "company_name": company["name"],
        "company": {
            "neq": company.get("neq"),
            "address": company["address"],
            "phone": company["phone"],
            "email": company["email"],
        },
        "legal": legal,
        "site": {
            "type": site["type"],
            "pages": site["pages"],
            "languages": site["languages"],
            "features": site["features"],
            "hosting": site["hosting"],
            "domain": site.get("domain"),
        },
        "context": context,
        "design": design,
        "adaptive": adaptive,
    }


# ── Point d'entrée ───────────────────────────────────────────────────────────
def interactive_brief(mode: str = "create") -> dict:
    """Lance le wizard interactif et retourne le brief complet.

    Args:
        mode: Mode d'opération NEXOS (create, audit, modify, content, analyze)

    Returns:
        dict conforme au brief-schema.json
    """
    if not sys.stdin.isatty():
        raise RuntimeError(
            "Le wizard interactif nécessite un terminal (stdin is not a TTY).\n"
            "Utilisez --brief path.json pour le mode non-interactif."
        )

    console.print(Panel(
        "[bold cyan]NEXOS v4.0 — Brief Wizard Interactif[/]\n"
        f"Mode : [bold yellow]{mode}[/]\n"
        "Ctrl+C pour annuler à tout moment",
        style="cyan",
    ))
    console.print()

    try:
        # Phase 1 — Entreprise
        company = _ask_company_info()

        # Phase 2 — Site
        site = _ask_site_config()

        # Phase 3 — Adaptatif
        adaptive = _ask_adaptive(site["type"], site["features"])
        # Passer le hosting pour la logique Loi 25
        adaptive["_hosting"] = site["hosting"]

        # Phase 4 — Loi 25
        legal = _ask_legal_loi25(site["type"], site["features"], adaptive)
        # Retirer la clé interne
        adaptive.pop("_hosting", None)

        # Phase 5 — Design
        design = _ask_design()

        # Phase 6 — Contexte SEO
        context = _ask_context_seo()

        # Assemblage
        brief = _assemble_brief(mode, company, site, adaptive,
                                legal, design, context)

        # Phase 7 — Récap
        confirmed = _review_brief(brief)
        while not confirmed:
            section = _safe_ask(questionary.select(
                "Quelle section modifier ?",
                choices=list(SECTION_NAMES.values()),
                style=WIZARD_STYLE,
            ))

            # Relancer la section choisie
            if section == "Entreprise":
                company = _ask_company_info()
            elif section == "Configuration du site":
                site = _ask_site_config()
            elif section == "Config. spécifique":
                adaptive["_hosting"] = site["hosting"]
                adaptive = _ask_adaptive(site["type"], site["features"])
                adaptive.pop("_hosting", None)
            elif section == "Loi 25 / Légal":
                adaptive["_hosting"] = site["hosting"]
                legal = _ask_legal_loi25(site["type"], site["features"], adaptive)
                adaptive.pop("_hosting", None)
            elif section == "Design":
                design = _ask_design()
            elif section == "Contexte & SEO":
                context = _ask_context_seo()

            brief = _assemble_brief(mode, company, site, adaptive,
                                    legal, design, context)
            confirmed = _review_brief(brief)

        console.print("[bold green]✓ Brief confirmé ![/]")
        return brief

    except KeyboardInterrupt:
        console.print("\n[yellow]Wizard annulé.[/]")
        sys.exit(1)
