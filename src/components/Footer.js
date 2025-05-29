// src/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-orange-50 border-t border-orange-200 text-gray-700 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-orange-600">Fury Foods</h2>
          <p className="text-sm">© {new Date().getFullYear()} Nick Fury Enterprises. All rights reserved.</p>
        </div>

        <div className="flex space-x-6">
          <a href="/about" className="hover:text-orange-600 transition">About</a>
          <a href="/privacy" className="hover:text-orange-600 transition">Privacy</a>
          <a href="/terms" className="hover:text-orange-600 transition">Terms</a>
          <a href="/contact" className="hover:text-orange-600 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}
