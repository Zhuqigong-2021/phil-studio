import { OwnerAuthorizationError, requireOwnerEmail } from "../../../../lib/dashboard/owner-session.ts";
import { patchWorkspaceTool } from "../../../../lib/dashboard/workspace-repository.ts";
import { validateToolPatch, type ToolPatch } from "../../../../lib/dashboard/workspace-data.ts";
import type { Tool } from "../../../../lib/dashboard/types.ts";

interface PatchContext {
  params: Promise<{ id: string }>;
}

interface ToolPatchDependencies {
  authorize: () => Promise<string>;
  patchTool: (ownerEmail: string, id: string, patch: ToolPatch) => Promise<Tool>;
}

function failureResponse(error: unknown): Response {
  if (error instanceof OwnerAuthorizationError) return Response.json({ error: error.status === 401 ? "Authentication is required." : "Access is forbidden." }, { status: error.status });
  if (error instanceof Error && error.name === "SupabaseConfigurationError") return Response.json({ error: "Workspace service is unavailable." }, { status: 503 });
  return Response.json({ error: "Workspace data is unavailable." }, { status: 502 });
}

export function createToolPatchHandler(dependencies: ToolPatchDependencies) {
  return async function patchTool(request: Request, context: PatchContext): Promise<Response> {
    let patch: ToolPatch;
    try {
      patch = validateToolPatch(await request.json());
    } catch {
      return Response.json({ error: "Invalid tool patch." }, { status: 400 });
    }
    try {
      const ownerEmail = await dependencies.authorize();
      const { id } = await context.params;
      const tool = await dependencies.patchTool(ownerEmail, id, patch);
      return Response.json({ tool });
    } catch (error) {
      return failureResponse(error);
    }
  };
}

const patchTool = createToolPatchHandler({ authorize: requireOwnerEmail, patchTool: patchWorkspaceTool });

export async function PATCH(request: Request, context: RouteContext<"/api/tools/[id]">): Promise<Response> {
  return patchTool(request, context);
}
