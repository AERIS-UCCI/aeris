declare module "*.jsx";
declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

declare global {
  interface Window {
    L: typeof import('leaflet');
  }
}

export {};
