export function buildDefaultMessage(name: string, product: string): string {
  const who = name.trim();
  const what = product.trim() || "votre commande";

  if (!who) {
    return `Bonjour, je reviens vers vous concernant ${what}. Êtes-vous toujours intéressée ?`;
  }

  return `Bonjour ${who}, je reviens vers vous concernant ${what}. Êtes-vous toujours intéressée ?`;
}
