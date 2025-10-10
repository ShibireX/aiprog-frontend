'use client'

import { useSearchViewModel } from '@/lib/viewmodels/search-viewmodel'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { AnimatePresence, motion } from 'framer-motion'

export function CookiesView() {
  const searchViewModel = useSearchViewModel()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="cookies"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="min-h-screen p-4"
      >
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-row place-items-end justify-end p-4 px-4">
            {searchViewModel.auth.isAuthenticated ? (
              <UserAvatar />
            ) : (
              <Button description="Sign up" link="/signup" />
            )}
          </div>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-6">
                <a href="/">
                  <h1 className="mb-2 bg-gray-800 from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-6xl font-medium tracking-tight text-transparent sm:text-7xl">
                    [ Papr ]
                  </h1>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-4 lg:px-8">
            <section className="pb-24">
              <div className="pb-6 text-center lg:pb-8">
                <h2 className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700">
                  What are cookies?
                </h2>
              </div>
              <div className="pb-4 text-center lg:pb-6">
                <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600">
                  Cookies are small text files stored on your device by a
                  website. They help the site remember information about your
                  visit, such as preferences or login status, to improve your
                  browsing experience.
                </p>
              </div>
              <div className="pb-4 text-center lg:pb-6">
                <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600">
                  We use cookies to enhance your experience on our site, to make
                  your life more convenient next time you visit us.
                </p>
              </div>
            </section>
            <section className="pb-24">
              <div className="pb-6 text-center lg:pb-8">
                <h2 className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700">
                  Necessary cookies
                </h2>
              </div>
              <div className="pb-4 text-center lg:pb-6">
                <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600">
                  These cookies are essential for the website to function
                  properly. They enable basic features like navigation,
                  security, and session management and cannot be disabled
                  without affecting how the site works.
                </p>
              </div>
              <div className="pb-4 text-center lg:pb-6">
                <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600">
                  [Will explain what necessary cookies we use once we have
                  decided what we actually want to store...]
                </p>
              </div>
            </section>

            <section className="pb-24">
              <div className="pb-6 text-center lg:pb-8">
                <h2 className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700">
                  Functional cookies
                </h2>
              </div>
              <div className="pb-4 text-center lg:pb-6">
                <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600">
                  Functional cookies allow the website to remember your
                  preferences and choices, such as language, region, or display
                  settings. They enhance usability and make your experience more
                  personalized.
                </p>
              </div>
              <div className="pb-4 text-center lg:pb-6">
                <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600">
                  [Will explain what functional cookies we use once we have
                  decided what we actually want to store...]
                </p>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
