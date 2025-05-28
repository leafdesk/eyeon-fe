export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#0e1525] flex flex-col items-center justify-center">
      <img
        src="/icons/eyeon_logo_main.svg"
        alt="EyeOn Logo"
        className="w-24 h-24 mb-4"
      />
      <p className="text-white text-lg">Loading...</p>
    </div>
  )
}
