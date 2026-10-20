export function toWhatsAppPhone(phone: string | null): string | null {
  if (!phone) {
    return null;
  }

  let digits = phone.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = `33${digits.slice(1)}`;
  }

  return digits || null;
}

export function isValidWhatsAppPhone(phone: string | null): boolean {
  const normalized = toWhatsAppPhone(phone);

  if (!normalized) {
    return false;
  }

  return /^\d{10,15}$/.test(normalized);
}

export function whatsappPhoneError(phone: string | null): string | null {
  if (!phone?.trim()) {
    return "Aucun numéro WhatsApp pour ce client.";
  }

  if (!isValidWhatsAppPhone(phone)) {
    return "Numéro WhatsApp invalide.";
  }

  return null;
}

export function followUpWhatsAppText(input: {
  clientName: string;
  product: string | null;
  message: string | null;
}): string {
  if (input.message?.trim()) {
    return input.message.trim();
  }

  if (input.product?.trim()) {
    return `Bonjour ${input.clientName}, je reviens vers vous au sujet de ${input.product.trim()}.`;
  }

  return `Bonjour ${input.clientName}, je fais un point avec vous.`;
}

export function buildWhatsAppUrl(input: {
  phone: string | null;
  clientName: string;
  product: string | null;
  message: string | null;
}): string | null {
  if (whatsappPhoneError(input.phone)) {
    return null;
  }

  const phone = toWhatsAppPhone(input.phone);

  if (!phone) {
    return null;
  }

  const text = encodeURIComponent(followUpWhatsAppText(input));

  return `https://wa.me/${phone}?text=${text}`;
}
