import Link from 'next/link'

export function FooterView() {
  return (
    <footer className="flex flex-col items-center justify-center gap-16 px-16 py-32 md:flex-row md:items-start lg:gap-32">
      <section className="flex max-w-48 flex-col items-center justify-center gap-6 text-center">
        <h3 className="font-semibold leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg md:font-normal">
          This project
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-200">
          We built this website as part of a university course. If you would
          like to know more about the project you can read about that{' '}
          <Link
            href="/thisproject"
            className="font-semibold leading-relaxed text-gray-700 underline hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-400"
          >
            here
          </Link>
          .
        </p>
      </section>
      <section className="flex max-w-48 flex-col items-center justify-center gap-6 text-center">
        <h3 className="font-semibold leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg md:font-normal">
          About us
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-200">
          The team behind this website consist of five university students. You
          can read more about us{' '}
          <Link
            href="/about"
            className="font-semibold leading-relaxed text-gray-700 underline hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-400"
          >
            here
          </Link>
          .
        </p>
      </section>
      <section className="flex max-w-48 flex-col items-center justify-center gap-6 text-center">
        <h3 className="font-semibold leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg md:font-normal">
          Cookies
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-200">
          This site uses cookies to enhance your experience. To read more about
          what we store and why, see our{' '}
          <Link
            href="/cookies"
            className="font-semibold leading-relaxed text-gray-700 underline hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-400"
          >
            cookie policy
          </Link>
          .
        </p>
      </section>
    </footer>
  )
}
