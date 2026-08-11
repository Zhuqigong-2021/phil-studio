interface AuthSession {
  user?: {
    email?: string | null;
  };
}

export type AuthReader = () => Promise<AuthSession | null>;

const defaultAuthReader: AuthReader = async () => {
  const { auth } = await import("../../auth.ts");
  return auth();
};

export class OwnerAuthorizationError extends Error {
  readonly status: 401 | 403;

  constructor(status: 401 | 403) {
    super(status === 401 ? "Authentication is required." : "Access is forbidden.");
    this.name = "OwnerAuthorizationError";
    this.status = status;
  }
}

function normalizeEmail(value: string | null | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? "";
}

export async function requireOwnerEmail(
  authReader: AuthReader = defaultAuthReader,
  configuredOwnerEmail: string | undefined = process.env.AUTH_OWNER_EMAIL,
): Promise<string> {
  const session = await authReader();
  const sessionEmail = normalizeEmail(session?.user?.email);
  if (!sessionEmail) throw new OwnerAuthorizationError(401);

  const ownerEmail = normalizeEmail(configuredOwnerEmail);
  if (!ownerEmail || sessionEmail !== ownerEmail) throw new OwnerAuthorizationError(403);

  return ownerEmail;
}
