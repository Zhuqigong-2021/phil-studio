import { OwnerAuthorizationError, requireOwnerEmail } from "../../../lib/dashboard/owner-session.ts";
import { getWorkspaceSnapshot } from "../../../lib/dashboard/workspace-repository.ts";
import type { WorkspaceSnapshot } from "../../../lib/dashboard/workspace-data.ts";

export const dynamic = "force-dynamic";

interface GetWorkspaceDependencies {
  authorize: () => Promise<string>;
  getSnapshot: (ownerEmail: string) => Promise<WorkspaceSnapshot>;
}

function failureResponse(error: unknown): Response {
  if (error instanceof OwnerAuthorizationError) {
    return Response.json({ error: error.status === 401 ? "Authentication is required." : "Access is forbidden." }, { status: error.status });
  }
  if (error instanceof Error && error.name === "SupabaseConfigurationError") {
    return Response.json({ error: "Workspace service is unavailable." }, { status: 503 });
  }
  return Response.json({ error: "Workspace data is unavailable." }, { status: 502 });
}

export function createWorkspaceDataGetHandler(dependencies: GetWorkspaceDependencies) {
  return async function getWorkspaceData(): Promise<Response> {
    try {
      const ownerEmail = await dependencies.authorize();
      const snapshot = await dependencies.getSnapshot(ownerEmail);
      return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      return failureResponse(error);
    }
  };
}

const getWorkspaceData = createWorkspaceDataGetHandler({
  authorize: requireOwnerEmail,
  getSnapshot: getWorkspaceSnapshot,
});

export async function GET(): Promise<Response> {
  return getWorkspaceData();
}
