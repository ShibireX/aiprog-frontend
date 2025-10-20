import Link from 'next/link'
import { BackToSearch } from '@/components/ui/back-to-search'

export function ProjectView() {
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
                About this project
              </h2>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                <i>Papr</i> was built as a course project at KTH in Sweden to
                demonstrate skills in advnced interaction programming.
              </p>
            </div>
            <div className="pb-4 text-center lg:pb-6">
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300">
                The tech stack we are using consist of a React with Next
                frontend utilizing Tailwind for styling, and a Fastify + GraphQL
                API endpoints, as well as a PostgreSQL database. All written in
                TypeScript with Node. Additional tools we have used include
                GitHub and Git for version control, Prettier for formatting,
                Vitest for code testing, Postman for testing API endpoints and
                Docker for containerization and deployment.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
