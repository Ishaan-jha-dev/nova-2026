export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
          These sections will unlock soon !!
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          We are working hard to bring you the full experience. Stay tuned!
        </p>
        <div className="pt-8">
          <a 
            href="/" 
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors shadow-lg hover:shadow-white/20"
          >
            Back to Landing Page
          </a>
        </div>
      </div>
    </div>
  )
}
