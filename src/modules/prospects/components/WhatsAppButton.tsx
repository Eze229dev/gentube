"use client";

import { useState } from "react";

import {
  buildWhatsAppUrl,
  whatsappPhoneError,
} from "@/modules/prospects/whatsapp";

function openWhatsApp(url: string) {
  if (/Android/i.test(navigator.userAgent)) {
    window.location.assign(url);
    return;
  }

  const popup = window.open(url, "_blank", "noopener,noreferrer");

  if (!popup) {
    window.location.assign(url);
  }
}

type WhatsAppButtonProps = {
  phone: string | null;
  clientName: string;
  product?: string | null;
  message?: string | null;
  label: string;
};

export function WhatsAppButton({
  phone,
  clientName,
  product = null,
  message = null,
  label,
}: WhatsAppButtonProps) {
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const phoneError = whatsappPhoneError(phone);

    if (phoneError) {
      setError(phoneError);
      return;
    }

    const url = buildWhatsAppUrl({
      phone,
      clientName,
      product,
      message,
    });

    if (!url) {
      setError("Impossible d’ouvrir WhatsApp.");
      return;
    }

    setError(null);
    openWhatsApp(url);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-base font-medium text-white"
      >
        {label}
      </button>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
