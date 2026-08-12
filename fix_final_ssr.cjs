const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("🚀 Correction définitive du SSR...");

// 1. Remettre layout.tsx proprement (sans dynamic ssr:false)
w('src/app/layout.tsx', [
  "import type { Metadata } from \"next\";",
  "import { Plus_Jakarta_Sans } from \"next/font/google\";",
  "import \"./globals.css\";",
  "import { Providers } from \"./providers\";",
  "import Navbar from '@/components/layout/Navbar';",
  "import Footer from '@/components/layout/Footer';",
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

// 2. Ajouter "use client" en haut de Navbar.tsx (indispensable pour Zustand)
const navPath = 'src/components/layout/Navbar.tsx';
if (fs.existsSync(navPath)) {
  let content = fs.readFileSync(navPath, 'utf8');
  if (!content.startsWith('"use client"')) {
    content = '"use client";\n' + content;
    fs.writeFileSync(navPath, content, 'utf8');
    console.log('✅ "use client" ajouté à Navbar.tsx');
  } else {
    console.log('ℹ️ Navbar.tsx a déjà "use client"');
  }
}

console.log('\n🎉 Correction terminée ! Le build Vercel va passer.');