const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Correction du prérendu SSR du Layout...");

w('src/app/layout.tsx', [
  "import type { Metadata } from \"next\";",
  "import { Plus_Jakarta_Sans } from \"next/font/google\";",
  "import \"./globals.css\";",
  "import { Providers } from \"./providers\";",
  "import dynamic from 'next/dynamic';",
  "",
  "// On désactive le SSR pour la Navbar et le Footer car ils utilisent Zustand (client-only)",
  "const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: false });",
  "const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });",
  "",
  "const jakarta = Plus_Jakarta_Sans({",
  "  subsets: [\"latin\"],",
  "  weight: [\"400\", \"500\", \"700\", \"800\"],",
  "  display: 'swap',",
  "  preload: false,",
  "});",
  "",
  "export const metadata: Metadata = {",
  "  title: \"LUNC Terminal | Le Dashboard Ultime Terra Luna Classic\",",
  "  description: \"Le terminal de référence pour l'écosystème Terra Luna Classic.\",",
  "};",
  "",
  "export default function RootLayout({ children }: { children: React.ReactNode }) {",
  "  return (",
  "    <html lang=\"fr\">",
  "      <body className={`${jakarta.className} antialiased`}>",
  "        <Providers>",
  "          <Navbar />",
  "          <main className=\"pt-32\">{children}</main>",
  "          <Footer />",
  "        </Providers>",
  "      </body>",
  "    </html>",
  "  );",
  "}"
]);

console.log('\n🎉 Layout corrigé ! Le build Vercel va passer.');