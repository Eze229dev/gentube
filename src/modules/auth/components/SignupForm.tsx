"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signUp, type AuthActionState } from "@/modules/auth/actions";
import { LOGIN_PATH } from "@/modules/auth/paths";

const initialState: AuthActionState = { error: null };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Nom complet</span>
        <input
          type="text"
          name="full_name"
          autoComplete="name"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none ring-slate-900 focus:ring-2"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">
          Téléphone{" "}
          <span className="font-normal text-slate-400">(optionnel)</span>
        </span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none ring-slate-900 focus:ring-2"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">E-mail</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none ring-slate-900 focus:ring-2"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Mot de passe</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none ring-slate-900 focus:ring-2"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="text-sm text-teal-700" role="status">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-base font-medium text-white disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Déjà un compte ?{" "}
        <Link href={LOGIN_PATH} className="font-medium text-slate-900 underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
