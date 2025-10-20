import Link from 'next/link'
import { BackToSearch } from '@/components/ui/back-to-search'

export function CookiesView() {
  return (
    <div className="min-h-screen p-4">
      {/* Back Button - Top Left */}
      <BackToSearch />

      {/* Header Section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-6">
              <Link href="/">
                <h1 className="mb-2 bg-gray-800 from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-6xl font-medium tracking-tight text-transparent dark:text-gray-200 sm:text-7xl">
                  [ Papr ]
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-4 lg:px-8">
          <section className="pb-24">
            <div className="pb-6 text-center lg:pb-8">
              <h2 className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700 dark:text-gray-200">
                What are cookies?
              </h2>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                Cookies are small text files stored on your device by a website.
                They help the site remember information about your visit, such
                as preferences or login status, to improve your browsing
                experience.
              </p>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                We use cookies to enhance your experience on our site, to make
                your life more convenient next time you visit us. By signing up
                or logging in, you accept the usage of necessary and functional
                cookies.
              </p>
            </div>
          </section>

          <section className="pb-24">
            <div className="pb-6 text-center lg:pb-8">
              <h2 className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700 dark:text-gray-200">
                Functional cookies
              </h2>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                Functional cookies allow the website to remember your
                preferences and choices, such as language, region, or display
                settings. They enhance usability and make your experience more
                personalized.
              </p>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                On Papr, we use functional cookies for theme switching, so that
                you can toggle between light and dark mode depending on your
                preference.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
