"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";

import { DASHBOARD_PATH } from "@/modules/auth/paths";
import {
  createFollowUp,
  type FollowUpActionState,
} from "@/modules/prospects/actions";
import { buildDefaultMessage } from "@/modules/prospects/message";
import { clientPath } from "@/modules/prospects/paths";

const initialState: FollowUpActionState = { error: null };

const inputClassName =
  "min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none ring-slate-900 focus:ring-2";

const lockedInputClassName = `${inputClassName} bg-slate-50 text-slate-700`;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function defaultDate(): string {
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function defaultTime(): string {
  const date = new Date();
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type ClientPreset = {
  id: string;
  name: string;
  phone: string | null;
};

export function NewFollowUpForm({ client }: { client?: ClientPreset | null }) {
  const locked = Boolean(client);
  const [state, formAction, pending] = useActionState(
    createFollowUp,
    initialState,
  );
  const [name, setName] = useState(client?.name ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [product, setProduct] = useState("");
  const [messageLocked, setMessageLocked] = useState(false);
  const [message, setMessage] = useState(() =>
    buildDefaultMessage(client?.name ?? "", ""),
  );
  const initialDate = useMemo(() => defaultDate(), []);
  const initialTime = useMemo(() => defaultTime(), []);
  const cancelHref = client ? clientPath(client.id) : DASHBOARD_PATH;

  function updateName(value: string) {
    setName(value);
    if (!messageLocked) {
      setMessage(buildDefaultMessage(value, product));
    }
  }

  function updateProduct(value: string) {
    setProduct(value);
    if (!messageLocked) {
      setMessage(buildDefaultMessage(name, value));
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {client ? <input type="hidden" name="clientId" value={client.id} /> : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">
          Nom du client *
        </span>
        <input
          type="text"
          name="name"
          required
          value={name}
          readOnly={locked}
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          className={locked ? lockedInputClassName : inputClassName}
          onChange={(event) => {
            if (!locked) {
              updateName(event.target.value);
            }
          }}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">
          Numéro WhatsApp *
        </span>
        <input
          type="tel"
          name="phone"
          required
          value={phone}
          readOnly={locked}
          autoComplete="tel"
          inputMode="tel"
          enterKeyHint="next"
          placeholder="06 12 34 56 78"
          className={locked ? lockedInputClassName : inputClassName}
          onChange={(event) => {
            if (!locked) {
              setPhone(event.target.value);
            }
          }}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">
          Produit/service *
        </span>
        <input
          type="text"
          name="product"
          required
          value={product}
          enterKeyHint="next"
          className={inputClassName}
          onChange={(event) => updateProduct(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Montant</span>
        <input
          type="text"
          name="amount"
          inputMode="decimal"
          enterKeyHint="next"
          placeholder="1200"
          className={inputClassName}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">Date *</span>
          <input
            type="date"
            name="date"
            required
            defaultValue={initialDate}
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">Heure *</span>
          <input
            type="time"
            name="time"
            required
            defaultValue={initialTime}
            className={inputClassName}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Message *</span>
        <textarea
          name="message"
          required
          rows={4}
          value={message}
          className={`${inputClassName} resize-none`}
          onChange={(event) => {
            setMessageLocked(true);
            setMessage(event.target.value);
          }}
        />
      </label>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-base font-medium text-white disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer la relance"}
      </button>

      <Link
        href={cancelHref}
        className="py-1 text-center text-sm font-medium text-slate-600"
      >
        Annuler
      </Link>
    </form>
  );
}
