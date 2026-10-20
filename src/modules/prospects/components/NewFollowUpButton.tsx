import Link from "next/link";

import { NEW_FOLLOW_UP_PATH } from "@/modules/prospects/paths";

export function NewFollowUpButton() {
  return (
    <Link
      href={NEW_FOLLOW_UP_PATH}
      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-base font-medium text-white"
    >
      + Nouvelle relance
    </Link>
  );
}
