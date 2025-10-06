import { Leaf, Wind, Thermometer } from "lucide-react";
import { useTranslation } from "react-i18next";
import DashboardImage from "../../assets/img/dashboard.png";

export default function Example() {
  const { t } = useTranslation();
  const features = [
    {
      name: t("features.list.0.name"),
      description: t("features.list.0.description"),
      icon: Leaf,
    },
    {
      name: t("features.list.1.name"),
      description: t("features.list.1.description"),
      icon: Wind,
    },
    {
      name: t("features.list.2.name"),
      description: t("features.list.2.description"),
      icon: Thermometer,
    },
  ];

  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-20 sm:rounded-3xl sm:px-10 lg:py-24 xl:px-24">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            
            {/* Texto principal */}
            <div className="lg:row-start-2 lg:max-w-md">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t("features.title")}
              </h2>
              <p className="mt-6 text-lg text-gray-300">
                {t("features.description")}
              </p>
            </div>

            {/* Imagen */}
            <img
              alt="Vista del panel de AERIS"
              src={DashboardImage}
              width={2432}
              height={1442}
              className="relative -z-20 max-w-xl min-w-full rounded-xl shadow-xl ring-1 ring-white/10 lg:row-span-4 lg:w-5xl lg:max-w-none"
            />

            {/* Lista de características */}
            <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10">
              <dl className="space-y-8 text-base text-gray-300">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt className="ml-9 font-semibold text-white relative">
                      <feature.icon className="absolute left-0 top-1 size-5 text-emerald-500" />
                      {feature.name}
                    </dt>
                    <dd className="ml-9">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
