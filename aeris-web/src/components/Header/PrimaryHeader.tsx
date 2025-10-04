"use client";

import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";

import {Link} from "react-router-dom";

const productos = [
  {
    name: "Monitoreo del Aire",
    description:
      "Accede a datos satelitales actualizados sobre la calidad del aire.",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Alertas Inteligentes",
    description:
      "Recibe notificaciones personalizadas para cuidar tu salud respiratoria.",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Seguridad y Privacidad",
    description:
      "Protegemos tus datos y garantizamos una experiencia segura.",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integraciones",
    description:
      "Conecta AERIS con tus aplicaciones favoritas o dispositivos IoT.",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automatización",
    description:
      "Configura rutinas automáticas basadas en los niveles de contaminación.",
    href: "#",
    icon: ArrowPathIcon,
  },
];

const acciones = [
  { name: "Ver demo", href: "#", icon: PlayCircleIcon },
  { name: "Contáctanos", href: "#", icon: PhoneIcon },
];

export default function HeaderAeris() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">AERIS</span>
            <img alt="Logo AERIS" src="/img/Logo.png" className="h-20 w-auto" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMenuMovilAbierto(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Abrir menú principal</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Navegación en pantallas grandes */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
              Productos
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition"
            >
              <div className="p-4">
                {productos.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 group-hover:text-emerald-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {acciones.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="size-5 flex-none text-gray-400"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <a href="#" className="text-sm font-semibold text-gray-900">
            Funciones
          </a>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Comunidad
          </a>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Equipo
          </a>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
  <Link
    to="/Login"
    className="text-sm leading-6 font-semibold text-emerald-600 hover:text-emerald-700"
  >
    Iniciar Sesión <span aria-hidden="true">&rarr;</span>
  </Link>
</div>
      </nav>

      {/* Menú móvil */}
      <Dialog
        open={menuMovilAbierto}
        onClose={setMenuMovilAbierto}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">AERIS</span>
              <img alt="Logo AERIS" src="/img/Logo.png" className="h-8 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMenuMovilAbierto(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Cerrar menú</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-gray-900 hover:bg-gray-50">
                    Productos
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...productos, ...acciones].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Funciones
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Comunidad
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Equipo
                </a>
              </div>

              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-emerald-600 hover:bg-gray-50"
                >
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
