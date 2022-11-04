import { next, rewrite } from "@vercel/edge";

export const config = {
  matcher: ["/", "/index"],
};

export function middleware(req) {
  const basicAuth = req.headers.get("authorization");
  const url = req.url;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === process.env.USER && pwd === process.env.PASS) {
      return next({
        headers: { "x-authenticated": `yes@middleware+${user}` },
      });
    }
  }

  url.pathname = "/api/auth";
  return rewrite(url);
}
