import Link from 'next/link'
import { BackToSearch } from '@/components/ui/back-to-search'

export function AboutView() {
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
                About Us
              </h2>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                We are a team of five university students from KTH Royal
                Institute of Technology in Stockholm, Sweden. This project was
                created as part of our coursework in Advanced Interaction
                Programming.
              </p>
            </div>
          </section>

          <section className="pb-24">
            <div className="pb-6 text-center lg:pb-8">
              <h2 className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700 dark:text-gray-200">
                Our Team
              </h2>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                Each team member contributed to different aspects of this
                project, from frontend design and implementation to backend
                development and API integration. We worked collaboratively to
                create a seamless user experience for academic research
                management.
              </p>
            </div>
          </section>

          <section className="pb-24">
            <div className="pb-6 text-center lg:pb-8">
              <h2 className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700 dark:text-gray-200">
                Our Mission
              </h2>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                Our goal was to build a tool that makes academic research more
                accessible and organized. By leveraging modern web technologies
                and AI-powered search capabilities, we aimed to streamline the
                process of discovering, saving, and citing academic papers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
