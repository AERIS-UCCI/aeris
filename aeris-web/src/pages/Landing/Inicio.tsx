import BentoGrids from "../../components/Sections/BentoGrids";
import HeroSection from "../../components/Sections//HeroSection";
import Team from "../../components/Sections/Team";
import Features from "../../components/Sections/FeaturesSection"

export default function Example() {
  return (
    <div className="bg-white">
      <main>
        <HeroSection />
        <Features/>
        <BentoGrids />
        
        <Team/>
        
      </main>

      {/* Footer
      <footer className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-t border-gray-200 py-12 md:flex md:items-center md:justify-between">
          <div className="flex justify-center gap-x-6 md:order-2">
            {footerNavigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-800"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="size-6" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0">
            &copy; 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}
