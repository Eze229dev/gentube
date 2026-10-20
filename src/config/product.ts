/**
 * Identité produit.
 *
 * RelancePro est le MVP actuel. Ce fichier est le point unique
 * d'identité : pour une évolution vers Closer, on change `id`,
 * `name` et les métadonnées ici, sans toucher au noyau
 * (auth, Supabase, layout, PWA).
 */
export type ProductId = "relancepro" | "closer";

export const product = {
  id: "relancepro" satisfies ProductId,
  name: "RelancePro",
  shortName: "RelancePro",
  tagline: "Ne plus oublier vos prospects WhatsApp.",
  description:
    "Micro-SaaS mobile-first d'aide à la relance pour les vendeurs qui utilisent WhatsApp.",
  themeColor: "#0F172A",
  backgroundColor: "#F8FAFC",
} as const;
