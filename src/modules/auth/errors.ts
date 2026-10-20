export function toAuthErrorMessage(error: string): string {
  const value = error.toLowerCase();

  if (value.includes("invalid login credentials")) {
    return "E-mail ou mot de passe incorrect.";
  }

  if (value.includes("user already registered") || value.includes("already been registered")) {
    return "Un compte existe déjà avec cet e-mail.";
  }

  if (value.includes("email not confirmed") || value.includes("email_not_confirmed")) {
    return "Confirmez votre e-mail avant de vous connecter.";
  }

  if (value.includes("invalid") && value.includes("email")) {
    return "Adresse e-mail invalide.";
  }

  if (value.includes("password") && value.includes("6")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }

  if (value.includes("rate limit") || value.includes("over_request")) {
    return "Trop de tentatives. Réessayez dans quelques instants.";
  }

  return error.trim() || "Une erreur s'est produite. Réessayez.";
}

