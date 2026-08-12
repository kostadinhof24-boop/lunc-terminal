const fs = require('fs');
const path = require('path');

console.log("🚀 Suppression de l'ancienne page /burn...");

// 1. Supprimer le dossier src/app/burn
const oldBurnPageDir = path.join('src', 'app', 'burn');
if (fs.existsSync(oldBurnPageDir)) {
  fs.rmSync(oldBurnPageDir, { recursive: true, force: true });
  console.log('🧹 Vieux dossier supprimé: ' + oldBurnPageDir);
} else {
  console.log('ℹ️ Le dossier src/app/burn n\'existe pas, vérification des imports...');
}

// 2. Sécurité : chercher et détruire tout fichier qui importe useUniversalWallet
const checkAndClean = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      checkAndClean(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('useUniversalWallet') || content.includes('components/burn/BurnInterface')) {
        console.log('⚠️ Fichier obsolète trouvé, suppression: ' + filePath);
        fs.unlinkSync(filePath);
      }
    }
  });
};

checkAndClean(path.join('src'));

console.log('\n✅ Nettoyage terminé !');