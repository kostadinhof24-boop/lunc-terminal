const fs = require('fs');
const path = require('path');

const w = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ ' + p);
};

console.log("📚 Sauvegarde de la documentation officielle...");

w('docs/00_MASTER_CONTEXT.md', `# LUNC TERMINAL
## MASTER CONTEXT
Version : 1.0
Projet : LUNC Terminal (DFLUNC V2)

# OBJECTIF DU PROJET
Créer le meilleur terminal Web3 pour Terra Classic.
Le projet s'inspire de DFLUNC mais ne doit pas être une copie.
L'objectif est de créer une plateforme beaucoup plus moderne, complète, rapide et évolutive.
Le site doit devenir la référence de Terra Classic.
Il doit remplacer plusieurs outils existants : DFLUNC, Station, Finder, certains explorers, dashboards staking, portfolio trackers.
L'utilisateur doit pouvoir tout faire depuis un seul site.

# PHILOSOPHIE
1. Interface simple. L'utilisateur ne doit jamais voir de données blockchain inutiles (ibc/..., uluna, uusd, etc.). Ces informations restent accessibles uniquement dans le mode Expert.
2. Architecture Enterprise. Aucun composant monolithique. Tout est modulaire (Feature First, Clean Architecture, SOLID).
3. Toutes les données sont temps réel.
4. Toutes les signatures passent par le wallet. Jamais de seed ou clé privée. Le site est entièrement non custodial.

# STACK
Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion, Wallet Kit, CosmJS, CosmWasm, TanStack Query, Zod, React Hook Form, Recharts, Prisma, PostgreSQL, pnpm.

# WALLETS
Station, Keplr, Leap, Ledger, WalletConnect.

# MODULES
Portfolio, Wallet, Burn, Rewards, Staking, Governance, Analytics, News, NFT, Swap, Transactions, Bridge, AI Assistant, Settings, Administration.

# LE MODULE BURN
Le module Burn est le cœur du projet. Il reproduit fidèlement le fonctionnement du protocole DFLUNC (Batches de 5000 LUNC, Frais de 4.99975 USTC, Mint de DFC).

# MODE SIMPLE / MODE EXPERT
Mode Simple: Affiche uniquement Logo, Nom, Symbole, Prix, Valeur, Variation.
Mode Expert: Affiche IBC Hash, Denom, Decimals, Contract, Code ID, Gas, Memo, LCD, RPC, Raw JSON.
`);

w('docs/PROJECT_BIBLE.md', `# LUNC TERMINAL - PROJECT BIBLE
Version 1.0

# ORIGINE DU PROJET
Le projet est né d'un besoin simple. Le propriétaire utilisait quotidiennement DFLUNC afin de brûler du LUNC, suivre ses récompenses et son portefeuille.
Au fil des mises à jour de Terra Station, le site DFLUNC est progressivement devenu incompatible.

# PREMIÈRE DÉCISION
Ne PAS réparer DFLUNC. Créer un remplaçant moderne appelé LUNC TERMINAL.

# NOUVELLE VISION
Le projet ne sera plus une simple copie. Il deviendra Le Terminal officiel non officiel de Terra Classic. Un seul site. Toutes les fonctions. Une seule connexion Wallet.

# EXPÉRIENCE UTILISATEUR
L'utilisateur ne doit jamais voir ibc/..., uluna, uusd, contract address, hash, gas. Toutes ces informations restent accessibles uniquement en mode Expert.

# LE BURN
Le Burn reste la fonctionnalité principale. Le fonctionnement doit rester compatible avec le protocole DFLUNC. L'expérience utilisateur est totalement repensée (simulation, prévision des rewards, graphique, historique, analytics).

# ARCHITECTURE
Le projet adopte une architecture Enterprise. Feature First. SOLID. Clean Architecture. Atomic Design.

# RÈGLE FONDAMENTALE
Le code de DFLUNC V2 ne doit jamais copier le code de DFLUNC. Le comportement fonctionnel peut être reproduit lorsqu'il est documenté ou observé. Toute partie non observable devra être signalée et documentée.
`);

console.log('\n🎉 Documentation sauvegardée dans le dossier /docs !');