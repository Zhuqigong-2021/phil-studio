import { OwnerAuthorizationError, requireOwnerEmail } from "../../../lib/dashboard/owner-session.ts";
import { createWorkspaceCategory } from "../../../lib/dashboard/workspace-repository.ts";
import { addCategoryToList } from "../../../lib/dashboard/custom-tools.ts";
import type { CategoryRecord } from "../../../lib/dashboard/workspace-data.ts";

interface CategoryPostDependencies {
  authorize: () => Promise<string>;
  createCategory: (ownerEmail: string, name: string) => Promise<CategoryRecord>;
}

function failureResponse(error: unknown): Response {
  if (error instanceof OwnerAuthorizationError) return Response.json({ error: error.status === 401 ? "Authentication is required." : "Access is forbidden." }, { status: error.status });
  if (error instanceof Error && error.name === "SupabaseConfigurationError") return Response.json({ error: "Workspace service is unavailable." }, { status: 503 });
  return Response.json({ error: "Workspace data is unavailable." }, { status: 502 });
}

export function createCategoryPostHandler(dependencies: CategoryPostDependencies) {
  return async function postCategory(request: Request): Promise<Response> {
    let name: string;
    try {
      const body = await request.json() as unknown;
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid category payload.");
      name = addCategoryToList([], (body as Record<string, unknown>).name as string).category;
    } catch {
      return Response.json({ error: "Invalid category payload." }, { status: 400 });
    }
    try {
      const ownerEmail = await dependencies.authorize();
      const category = await dependencies.createCategory(ownerEmail, name);
      return Response.json({ category }, { status: 201 });
    } catch (error) {
      return failureResponse(error);
    }
  };
}

const postCategory = createCategoryPostHandler({ authorize: requireOwnerEmail, createCategory: createWorkspaceCategory });

export async function POST(request: Request): Promise<Response> {
  return postCategory(request);
}

