import dynamic from "next/dynamic";

export const BaseMap = dynamic(
  () => import("./basemap").then(mod => mod.BaseMap),
  {
    ssr: false,
  }
);