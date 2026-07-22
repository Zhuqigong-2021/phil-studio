export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/all/:path*",
    "/favs/:path*",
    "/recent/:path*",
    "/manage/:path*",
  ],
};
