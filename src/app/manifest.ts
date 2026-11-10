import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Namma Ooru — your town, together",
    short_name: "Namma Ooru",
    description: "Local updates, shops, jobs, transport, emergency services and places to explore.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8f5",
    theme_color: "#153d2c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
