import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

async function prerender() {
  const mod = await import(path.resolve(distDir, "server/entry-server.js"));
  const { render } = mod;

  // prerenderRoutes is defined in routes.tsx, re-exported via the server bundle
  const prerenderRoutes = ["/"];

  // 2. Read the client index.html template
  const template = fs.readFileSync(path.resolve(distDir, "client/index.html"), "utf-8");

  for (const url of prerenderRoutes) {
    const { html: appHtml, meta } = render(url);

    let finalHtml = template.replace("<!--ssr-outlet-->", appHtml);

    // Inject SEO meta if available
    if (meta) {
      const seoTags = [
        `<title>${meta.title}</title>`,
        `<meta name="description" content="${meta.description}">`,
        `<link rel="canonical" href="${meta.canonical}">`,
        `<meta property="og:title" content="${meta.title}">`,
        `<meta property="og:description" content="${meta.description}">`,
        `<meta property="og:url" content="${meta.canonical}">`,
        meta.ogImage ? `<meta property="og:image" content="${meta.ogImage}">` : "",
        `<meta name="twitter:title" content="${meta.title}">`,
        `<meta name="twitter:description" content="${meta.description}">`,
        meta.ogImage ? `<meta name="twitter:image" content="${meta.ogImage}">` : "",
        // JSON-LD
        `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Book",
          name: "You Can't Focus — Here Is Why",
          author: { "@type": "Person", name: "Ameer Aminu" },
          description: meta.description,
          url: meta.canonical,
          image: meta.ogImage,
        })}</script>`,
      ]
        .filter(Boolean)
        .join("\n    ");

      // Replace existing title
      finalHtml = finalHtml.replace(/<title>.*?<\/title>/, "");
      // Replace existing meta tags we're overriding
      finalHtml = finalHtml.replace(/<meta name="description"[^>]*>/, "");
      finalHtml = finalHtml.replace(/<meta property="og:title"[^>]*>/, "");
      finalHtml = finalHtml.replace(/<meta property="og:description"[^>]*>/, "");
      finalHtml = finalHtml.replace(/<meta name="twitter:title"[^>]*>/, "");
      finalHtml = finalHtml.replace(/<meta name="twitter:description"[^>]*>/, "");
      finalHtml = finalHtml.replace(/<meta property="og:image"[^>]*>/, "");
      finalHtml = finalHtml.replace(/<meta name="twitter:image"[^>]*>/, "");

      // Insert SEO tags before </head>
      finalHtml = finalHtml.replace("</head>", `    ${seoTags}\n  </head>`);
    }

    // Write to the correct path
    const routePath = url === "/" ? "" : url;
    const outDir = path.resolve(distDir, "client", routePath.replace(/^\//, ""));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.resolve(outDir, "index.html"), finalHtml);

    console.log(`✓ Prerendered: ${url}`);
  }

  console.log("\nPrerendering complete!");
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
