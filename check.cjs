const fs = require('fs');
const path = require('path');

try {
  const pkgPath = path.join(process.cwd(), 'node_modules', '@terra-money', 'wallet-kit', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  console.log("--- Package.json de @terra-money/wallet-kit ---");
  console.log("Version:", pkg.version);
  console.log("Main:", pkg.main);
  console.log("Module:", pkg.module);
  console.log("Exports:", JSON.stringify(pkg.exports, null, 2));
  
  const indexPath = path.join(process.cwd(), 'node_modules', '@terra-money', 'wallet-kit', pkg.main || 'index.js');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    console.log("\n--- Contenu de index.js (premiers 1000 caractères) ---");
    console.log(content.substring(0, 1000));
  } else {
    console.log("\n❌ index.js introuvable.");
  }
} catch (e) {
  console.error("Erreur:", e.message);
}