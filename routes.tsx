import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import type { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  { path: "/", element: <Index /> },
  { path: "*", element: <NotFound /> },
];

/** Routes to prerender at build time */
export const prerenderRoutes = ["/"];

/** Per-route SEO metadata */
export const routeMeta: Record<string, {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}> = {
  "/": {
    title: "You Can't Focus — A 30-Day Plan to Rebuild Your Attention",
    description: "A practical 30-day plan to rebuild your focus, retrain your brain, and take control of your time. By Ameer Aminu.",
    canonical: "https://youcantfocus.lovable.app/",
    ogImage: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/70fa0c2c-b554-4bca-9061-44623ac14ad9/id-preview-a654b2ce--d3993943-f26c-4802-84f8-d1a29326b366.lovable.app-1774078486166.png",
  },
};
