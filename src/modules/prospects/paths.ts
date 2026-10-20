export const NEW_FOLLOW_UP_PATH = "/follow-ups/new";
export const CLIENTS_PATH = "/clients";

export function clientPath(id: string): string {
  return `/clients/${id}`;
}

export function newFollowUpPath(clientId?: string): string {
  if (!clientId) {
    return NEW_FOLLOW_UP_PATH;
  }

  return `${NEW_FOLLOW_UP_PATH}?clientId=${encodeURIComponent(clientId)}`;
}
