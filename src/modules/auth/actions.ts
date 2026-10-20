"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { toAuthErrorMessage } from "./errors";
import { DASHBOARD_PATH, LOGIN_PATH } from "./paths";

export type AuthActionState = {
  error: string | null;
  message?: string;
};

function readField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email");
  const password = String(formData.get("password") ?? "");
  const fullName = readField(formData, "full_name");
  const phone = readField(formData, "phone");

  if (!email || !password) {
    return { error: "E-mail et mot de passe obligatoires." };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
        phone: phone || null,
      },
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
    },
  });

  if (error) {
    return { error: toAuthErrorMessage(error.message) };
  }

  if (data.session) {
    redirect(DASHBOARD_PATH);
  }

  return {
    error: null,
    message:
      "Compte créé. Vérifiez votre e-mail pour confirmer l’inscription, puis connectez-vous.",
  };
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-mail et mot de passe obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: toAuthErrorMessage(error.message) };
  }

  redirect(DASHBOARD_PATH);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}
