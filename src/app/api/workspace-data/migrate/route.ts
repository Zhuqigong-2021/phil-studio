import { OwnerAuthorizationError, requireOwnerEmail } from "../../../../lib/dashboard/owner-session.ts";
import { migrateLocalWorkspace } from "../../../../lib/dashboard/workspace-repository.ts";
import { buildMigrationPayload, type LocalMigrationPayload, type WorkspaceSnapshot } from "../../../../lib/dashboard/workspace-data.ts";

export const dynamic = "force-dynamic";

interface MigrationDependencies {
  authorize: () => Promise<string>;
  migrate: (ownerEmail: string, payload: LocalMigrationPayload) => Promise<WorkspaceSnapshot>;
}

function failureResponse(error: unknown): Response {
  if (error instanceof OwnerAuthorizationError) return Response.json({ error: error.status === 401 ? "Authentication is required." : "Access is forbidden." }, { status: error.status });
  if (error instanceof Error && error.name === "SupabaseConfigurationError") return Response.json({ error: "Workspace service is unavailable." }, { status: 503 });
  return Response.json({ error: "Workspace data is unavailable." }, { status: 502 });
}

export function createWorkspaceMigrationPostHandler(dependencies: MigrationDependencies) {
  return async function migrateWorkspace(request: Request): Promise<Response> {
    let payload: LocalMigrationPayload;
    try {
      payload = buildMigrationPayload(await request.json());
    } catch {
      return Response.json({ error: "Invalid migration payload." }, { status: 400 });
    }
    try {
      const ownerEmail = await dependencies.authorize();
      return Response.json(await dependencies.migrate(ownerEmail, payload), { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      return failureResponse(error);
    }
  };
}

const migrateWorkspace = createWorkspaceMigrationPostHandler({ authorize: requireOwnerEmail, migrate: migrateLocalWorkspace });

export async function POST(request: Request): Promise<Response> {
  return migrateWorkspace(request);
}
