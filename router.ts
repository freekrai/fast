import { compose, Middleware } from "./middleware.ts";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

interface Route {
  pathname: string;
  method: Method;
  middlewares: Middleware[];
}

interface RouteMatch {
  route: Route;
  res: URLPatternResult;
  pattern: URLPattern;
}

export class Router {
  #routes: Route[];
  #patterns: Set<URLPattern>;
  #cache: Map<string, RouteMatch>;

  constructor() {
    this.#routes = [];
    this.#patterns = new Set();
    this.#cache = new Map();
  }

  get(pathname: string, ...middlewares: Middleware[]) {
    this.#add(pathname, middlewares, "GET");
    return this;
  }

  post(pathname: string, ...middlewares: Middleware[]) {
    this.#add(pathname, middlewares, "POST");
    return this;
  }

  put(pathname: string, ...middlewares: Middleware[]) {
    this.#add(pathname, middlewares, "PUT");
    return this;
  }

  patch(pathname: string, ...middlewares: Middleware[]) {
    this.#add(pathname, middlewares, "PATCH");
    return this;
  }

  delete(pathname: string, ...middlewares: Middleware[]) {
    this.#add(pathname, middlewares, "DELETE");
    return this;
  }

  head(pathname: string, ...middlewares: Middleware[]) {
    this.#add(pathname, middlewares, "HEAD");
    return this;
  }

  options(pathname: string, ...middlewares: Middleware[]) {
    this.#add(pathname, middlewares, "OPTIONS");
    return this;
  }

  #add(pathname: string, middlewares: Middleware[], method: Method) {
    const current = this.#find(pathname, method);
    if (current) return current.middlewares.push(...middlewares);
    this.#routes.push({ pathname, middlewares, method });
    this.#patterns.add(new URLPattern({ pathname }));
  }

  #find(pathname: string, method: Method) {
    const matches = (r: Route) =>
      r.method === method && r.pathname === pathname;
    return this.#routes.find(matches);
  }

  #allowed(pathname: string) {
    const matches = (r: Route) => r.pathname === pathname;
    return this.#routes.filter(matches).map((r) => r.method);
  }

  #match(pathname: string, method: Method) {
    const id = method + pathname;
    const hit = this.#cache.get(id);
    if (hit) return hit;
    for (const pattern of this.#patterns) {
      const res = pattern.exec({ pathname });
      if (!res) continue;
      const route = this.#find(pattern.pathname, method)!;
      const match = { res, route, pattern };
      this.#cache.set(id, match);
      return match;
    }
  }

  routes(): Middleware {
    return (ctx, next) => {
      const [url, method] = [ctx.url, ctx.request.method as Method];
      const match = this.#match(url.pathname, method);
      if (!match) return next(ctx);
      if (match.route) {
        const { res, route } = match;
        ctx.params = res.pathname.groups;
        return compose(route.middlewares)(ctx);
      } else {
        const methods = this.#allowed(match.pattern.pathname);
        if (!methods.length) return next(ctx);
        const headers = new Headers();
        headers.set("Allow", methods.toString());
        return method === "OPTIONS"
          ? new Response(null, { status: 204, headers })
          : new Response("Method Not Allowed", { status: 405, headers });
      }
    };
  }
}
