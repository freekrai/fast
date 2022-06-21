import { serve } from "https://deno.land/std@0.144.0/http/server.ts";
import { application } from "../mod.ts";

const app = application();

app.get("/", () => new Response("Hello, World!"));

await serve(app.handle);
