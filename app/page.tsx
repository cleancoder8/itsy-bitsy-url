import { ShortenForm } from "@/components/ShortenForm";
import { ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfcfc]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight text-gray-900">
          ItsyBitsy
        </div>
        <a
          href="https://github.com/cleancoder8/itsy-bitsy-url"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          GitHub
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 lg:pt-32 lg:pb-40 max-w-7xl mx-auto text-center">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70" />

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto">
          Shorten your links, <br className="hidden md:block" />
          <span className="text-gray-500">expand your reach.</span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          A simple, privacy-focused URL shortener designed for performance. No
          tracking pixels, no ads, just your link.
        </p>

        <ShortenForm />
      </section>

      {/* Features / How it works */}
      <section className="px-6 py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Lightning Fast"
              description="Powered by Vercel Edge Network and KV for millisecond redirects worldwide."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-blue-500" />}
              title="Secure & Reliable"
              description="Generated using UUID v4 and cryptographically secure encoding."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-emerald-500" />}
              title="Global Scale"
              description="Built on serverless infrastructure that scales automatically with your traffic."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>© {new Date().getFullYear()} ItsyBitsy URL. Open source.</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
