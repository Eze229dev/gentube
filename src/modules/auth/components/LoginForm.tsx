"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signIn, type AuthActionState } from "@/modules/auth/actions";
import { SIGNUP_PATH } from "@/modules/auth/paths";

const initialState: AuthActionState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none ring-slate-900 focus:ring-2"
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
        className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-base font-medium text-white disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link href={SIGNUP_PATH} className="font-medium text-slate-900 underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
