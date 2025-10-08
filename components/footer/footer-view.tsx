import { LinkSmall } from '@/components/ui/link-small'

export function FooterView() {
  return (
    <footer className="flex flex-col items-center justify-center gap-16 px-16 py-32 md:flex-row md:items-start lg:gap-32">
      <section className="flex max-w-48 flex-col items-center justify-center gap-6 text-center">
        <h3 className="leading-relaxed text-gray-700 md:text-lg md:font-light">
          This project
        </h3>
        <p className="leading-relaxed text-gray-700">
          We built this website as part of a university course. If you would
          like to know more about the project you can read about that{' '}
          <LinkSmall href="#" content="[Here]" />.
        </p>
      </section>
      <section className="flex max-w-48 flex-col items-center justify-center gap-6 text-center">
        <h3 className="leading-relaxed text-gray-700 md:text-lg md:font-light">
          About us
        </h3>
        <p className="leading-relaxed text-gray-700">
          The team behind this website consist of five university students.
          <LinkSmall href="#" content="[Here]" /> you can read more about us and
          our specific roles in this project.
        </p>
      </section>
      <section className="flex max-w-48 flex-col items-center justify-center gap-6 text-center">
        <h3 className="leading-relaxed text-gray-700 md:text-lg md:font-light">
          Cookies
        </h3>
        <p className="leading-relaxed text-gray-700">
          This site uses cookies to enhance your experience. To read more about
          what we store and why, see our{' '}
          <LinkSmall href="/cookies" content="[Cookie policy]" />.
        </p>
      </section>
    </footer>
  )
}
