const people = [
  {
    name: 'Tattiana Cutipa',
    role: 'Tec. Medica (Lider, Diseñadora)',
    imageUrl:
      'https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/558889647_685149234621775_2749636612615715713_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1rJl2K65R1AQ7kNvwEyAE6T&_nc_oc=Adl1KXw3jSToUtC7sk_y03XaLdifT8f2jvHg33Fw4LryQbXII2EkH-d_PUVOZwmMJWk&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=vlBzTseJyD873Ddq5WuSBQ&oh=00_Afc8B3p2olX5snX-NWm5AgiDuBHFXzFWRknqZ6TUWF_vYQ&oe=68E75BC1',
    xUrl: '#',
    linkedinUrl: '#',
  },
  {
    name: 'Alejandro De La Cruz',
    role: 'Ing. De Sistemas (Desarrollador)',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/C4D03AQFEHEkbg2egyw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1647982756708?e=1762387200&v=beta&t=MdJxsHJBBiM4FqoyWH1HIiuQ4xpM9rXzZHHfe7T-v6E',
    xUrl: '#',
    linkedinUrl: '#',
  },
  {
    name: 'Estephany Mercado',
    role: 'Ing. Ambiental (Investigadora)',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4E03AQH-rfoG6MlUZw/profile-displayphoto-shrink_400_400/B4EZY6U1YQGYAg-/0/1744735262833?e=1762387200&v=beta&t=c7AFaL_EjPl0kxCk_nKa0WyfPuQ8iAjZ-DgLOFZjHUo',
    xUrl: '#',
    linkedinUrl: '#',
  },
  {
    name: 'Cristopher Mendez',
    role: 'Ing. de Sistemas (Desarrollador)',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D03AQGdMotRvZybtg/profile-displayphoto-scale_400_400/B4DZfslphgHMAg-/0/1752020982637?e=1762387200&v=beta&t=msU1JoYgtv_d0iD0uRlPOqI8noD2E063OvG2rORPeng',
    xUrl: '#',
    linkedinUrl: '#',
  },
  
  {
    name: 'Juddy Peña',
    role: 'Tecnologia Medica (Speaker)',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4E03AQH8I_NSosYf2g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730351176957?e=1762387200&v=beta&t=4rFD3bE5-JH4hquO0WwdY3Rf0BcLqfQEkbfakMmpe0c',
    xUrl: '#',
    linkedinUrl: '#',
  },
  
  
  {
    name: 'Yonatan Ordoñez',
    role: 'Web Developer',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D03AQHH45fimBPlUw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1708795078992?e=1762387200&v=beta&t=QmVLUbbNo5StIFO_60R7MAysEep0yLkblv5c-R7fmw4',
    xUrl: '#',
    linkedinUrl: '#',
  },
]

export default function Example() {
  return (
    <div className="bg-white py-32">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Conoce a nuestro <span className="text-emerald-600">equipo</span>
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            Unimos ciencia, tecnología y compromiso ambiental para mejorar la calidad del aire.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {people.map((person) => (
            <li key={person.name}>
              <img
                alt=""
                src={person.imageUrl}
                className="mx-auto size-56 rounded-full outline-1 -outline-offset-1 outline-black/5"
              />
              <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">{person.name}</h3>
              <p className="text-sm/6 text-gray-600">{person.role}</p>
              <ul role="list" className="mt-6 flex justify-center gap-x-6">
                <li>
                  <a href={person.xUrl} className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">X</span>
                    <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" className="size-5">
                      <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href={person.linkedinUrl} className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">LinkedIn</span>
                    <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" className="size-5">
                      <path
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
