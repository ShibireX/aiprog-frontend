export default function Home() {
  return (
    // center the content
    <div className="w-full min-h-screen px-4 py-16 flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Welcome to{' '}
            <span className="text-white">AIPROG Frontend</span>
          </h1>
        </div>
      </div>
    </div>
  )
}
