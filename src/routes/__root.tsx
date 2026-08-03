import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "sonner";
import logoImg from "@/assets/logo.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-gold tracking-widest">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-primary">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-primary">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Veuillez réessayer ou revenir à l'accueil.
        </p>
        {error && (
          <p className="mt-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 font-mono text-left overflow-auto max-h-32">
            {error.message || String(error)}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="border border-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary hover:bg-secondary transition-colors"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "El Shaddai Fragrances — Parfums d'exception" },
      {
        name: "description",
        content:
          "El Shaddai Fragrances — Maison de parfumerie suisse. Découvrez nos eaux de parfum et extraits inspirés des plus belles traditions orientales.",
      },
      { name: "author", content: "El Shaddai Fragrances" },
      { property: "og:title", content: "El Shaddai Fragrances" },
      { property: "og:description", content: "Parfums d'exception. Livraison en Suisse." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "El Shaddai Fragrances" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: logoImg },
      { rel: "apple-touch-icon", href: logoImg },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Italiana&family=Jost:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="bottom-right" theme="light" richColors />
    </QueryClientProvider>
  );
}
