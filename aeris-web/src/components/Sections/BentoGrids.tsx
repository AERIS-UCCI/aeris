'use client'

import { useTranslation } from "react-i18next";

export default function BentoGrids() {
  const { t } = useTranslation();

  const items = [
    {
      title: "🌱 " + t("bento.mobile_title"),
      description: t("bento.mobile_description"),
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png",
    },
    {
      title: "⚡ " + t("bento.realtime_title"),
      description: t("bento.realtime_description"),
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png",
    },
    {
      title: "🔒 " + t("bento.security_title"),
      description: t("bento.security_description"),
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png",
    },
    {
      title: "🔗 " + t("bento.api_title"),
      description: t("bento.api_description"),
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-code.png",
    },
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-sm font-semibold text-emerald-600 uppercase tracking-wide">
          {t("bento.subtitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t("bento.title")}
        </p>

        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Primer bloque grande */}
          <article className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)] shadow-sm">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10">
                <h3 className="text-lg font-medium text-gray-900 text-center lg:text-left">
                  {items[0].title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 text-center lg:text-left">
                  {items[0].description}
                </p>
              </div>
              <div className="relative flex-1">
                <img
                  src={items[0].image}
                  alt={items[0].title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover rounded-t-xl"
                />
              </div>
            </div>
          </article>

          {/* Segundo bloque */}
          <article className="relative">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl" />
            <div className="relative flex flex-col h-full overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <h3 className="text-lg font-medium text-gray-900 text-center lg:text-left">
                  {items[1].title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 text-center lg:text-left">
                  {items[1].description}
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center p-8">
                <img
                  src={items[1].image}
                  alt={items[1].title}
                  loading="lazy"
                  className="w-full max-w-xs rounded-lg"
                />
              </div>
            </div>
          </article>

          {/* Tercer bloque */}
          <article className="relative lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-white" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <h3 className="text-lg font-medium text-gray-900 text-center lg:text-left">
                  {items[2].title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 text-center lg:text-left">
                  {items[2].description}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center py-6">
                <img
                  src={items[2].image}
                  alt={items[2].title}
                  loading="lazy"
                  className="h-[152px] object-contain"
                />
              </div>
            </div>
          </article>

          {/* Cuarto bloque grande */}
          <article className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-r-[calc(2rem+1px)] shadow-sm">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10">
                <h3 className="text-lg font-medium text-gray-900 text-center lg:text-left">
                  {items[3].title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 text-center lg:text-left">
                  {items[3].description}
                </p>
              </div>
              <div className="relative flex-1 p-6">
                <img
                  src={items[3].image}
                  alt={items[3].title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover rounded-t-xl"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
