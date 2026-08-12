const fs = require('fs');
const path = require('path');

const w = (p, lines) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const content = lines.join('\n');
  fs.writeFileSync(p, content, 'utf8');
  console.log('✅ ' + p);
};

console.log("📚 Sauvegarde du reste de la documentation...");

w('docs/TECHNICAL_ARCHITECTURE.md', [
  "# LUNC TERMINAL - TECHNICAL ARCHITECTURE",
  "Version : 1.0",
  "",
  "# OBJECTIF",
  "Définir l'architecture officielle de LUNC Terminal.",
  "",
  "# PHILOSOPHIE",
  "Architecture Enterprise. Clean Architecture, SOLID, Feature First, Domain Driven Design (léger), Composition over Inheritance, Atomic Design, Type Safety, Testabilité maximale.",
  "",
  "# STACK",
  "Framework: Next.js 15, React 19, TypeScript, pnpm",
  "Frontend: TailwindCSS, Shadcn/UI, Framer Motion, Lucide Icons, React Hook Form, Zod, TanStack Query, React Virtual, Recharts",
  "Blockchain: Wallet Kit, CosmJS, CosmWasm, Terra LCD, RPC, IBC, CW20, CW721, Cosmos SDK",
  "Backend: Next.js Route Handlers, Prisma, PostgreSQL, Redis, CRON Jobs, WebSocket",
  "",
  "# DOSSIERS",
  "src/app/, components/, features/, hooks/, services/, lib/, store/, types/, constants/, config/, utils/, styles/, assets/, tests/, docs/, scripts/",
  "",
  "# FEATURE FIRST",
  "Chaque fonctionnalité est indépendante. Exemple: features/wallet/, features/burn/, features/staking/, etc. Chaque dossier contient ses propres components, hooks, services, types, tests.",
  "",
  "# SERVICES ET HOOKS",
  "Tous les appels passent par des hooks (useWallet, useBurn, useRewards, etc.). Jamais directement depuis les composants. Toute la logique métier va dans les services (wallet.service.ts, burn.service.ts, etc.).",
  "",
  "# RÈGLE D'OR",
  "Un composant ne doit jamais connaître la blockchain. Il appelle uniquement un hook. Le hook appelle un service. Le service appelle les APIs ou la blockchain. Aucune logique métier dans les composants."
]);

w('docs/BLOCKCHAIN.md', [
  "# LUNC TERMINAL - BLOCKCHAIN.md",
  "Version : 1.0",
  "",
  "# OBJECTIF",
  "Définir l'architecture Blockchain officielle de LUNC Terminal. Le projet doit être entièrement non custodial.",
  "",
  "# BLOCKCHAIN SUPPORTÉE",
  "Chaîne principale: Terra Classic (Chain ID: columbus-5). Native Token: LUNC. Stablecoin: USTC.",
  "",
  "# WALLETS",
  "Support obligatoire: Station, Keplr, Leap, Ledger, WalletConnect. Chaque wallet implémente la même interface (connect, disconnect, sign, broadcast, simulate, getBalances, getAddress, etc.).",
  "",
  "# SIGNATURE",
  "Toutes les transactions suivent ce cycle : Création du message -> Simulation -> Calcul du Gas -> Validation -> Signature Wallet -> Broadcast -> Suivi -> Confirmation -> Mise à jour de l'interface.",
  "",
  "# COSMWASM & TOKENS",
  "Support complet des requêtes CosmWasm (contractQuery, execute). Classification automatique des tokens (Native, CW20, IBC, NFT). L'utilisateur ne doit jamais voir ibc/0471F1... sauf dans le mode Expert.",
  "",
  "# SÉCURITÉ",
  "Aucune clé privée. Aucun stockage local des secrets. Validation de tous les paramètres. Protection contre les doubles signatures/clics. Confirmation utilisateur obligatoire."
]);

w('docs/DFLUNC_PROTOCOL.md', [
  "# LUNC TERMINAL - DFLUNC_PROTOCOL",
  "Version : 1.0",
  "",
  "# VISION",
  "DFLunc est un protocole construit autour d'un principe : Transformer le burn de LUNC en un mécanisme récompensant les utilisateurs.",
  "",
  "# TOKENS",
  "LUNC: Token brûlé. USTC: Paiement des frais de protocole (source du Reward Pool). DFC: Token utilitaire obtenu après un Burn, peut être staké pour des récompenses.",
  "",
  "# BURN & BATCHES",
  "Le Burn est organisé par batches. 1 Batch = 5,000 LUNC. Le protocole calcule automatiquement les frais en USTC (4.99975 USTC par batch). Après validation, le protocole attribue des DFC.",
  "",
  "# STAKING & REWARDS",
  "Les DFC peuvent être stakés. Le Reward Pool est alimenté par 70% des frais USTC. 30% alimentent le Protocol II. Le Dashboard affiche les récompenses non réclamées (USTC et DFC).",
  "",
  "# CYCLES",
  "Le protocole fonctionne par cycles. Le Dashboard affiche le cycle actuel, les DFC mintés dans le cycle, et un compte à rebours."
]);

w('docs/UI_UX_DESIGN_SYSTEM.md', [
  "# LUNC TERMINAL - UI_UX_DESIGN_SYSTEM",
  "Version : 1.0",
  "",
  "# PHILOSOPHIE",
  "Le Dashboard ne doit jamais ressembler à un explorateur blockchain. Il doit ressembler à un produit Apple. Chaque information importante doit être visible en moins de 3 secondes.",
  "",
  "# COULEURS",
  "Fond principal: #050816. Fond secondaire: #0B1022. Cards: rgba(255,255,255,0.05). Texte principal: #FFFFFF. Accent LUNC: #F0B90B. Accent Success: #10B981. Accent Error: #EF4444.",
  "",
  "# THÈME",
  "Dark Mode uniquement. Glassmorphism, Blur, Ombres douces, Coins arrondis. Animations fluides (Framer Motion).",
  "",
  "# MODE SIMPLE / EXPERT",
  "Mode Simple: Affiche uniquement Logo, Nom, Prix, Valeur, Variation, Actions. Aucune donnée blockchain. Mode Expert: Affiche IBC Hash, Contract, Denom, Decimals, Gas, Code ID, Messages CosmWasm, Raw JSON."
]);

w('docs/AI_DEVELOPMENT_PLAYBOOK.md', [
  "# LUNC TERMINAL - AI_DEVELOPMENT_PLAYBOOK",
  "Version : 1.0",
  "",
  "# RÔLE DE L'IA",
  "L'IA agit comme CTO, Software Architect, Senior Full Stack Engineer, Expert Cosmos SDK et Sécurité.",
  "",
  "# RÈGLES ABSOLUES",
  "Ne jamais utiliser 'any'. Ne jamais dupliquer du code. Ne jamais faire de logique métier dans React. Ne jamais appeler directement CosmJS depuis un composant. Ne jamais stocker de seed/clé privée.",
  "",
  "# PROCESSUS DE DÉVELOPPEMENT",
  "Pour chaque nouvelle fonctionnalité : Analyse -> Architecture -> Types -> Services -> Hooks -> Composants -> Tests -> Documentation.",
  "",
  "# ERREURS",
  "Créer des erreurs typées (WalletNotConnectedError, SimulationFailedError, etc.). Jamais de throw new Error('Erreur') générique."
]);

w('docs/ROADMAP_TODO.md', [
  "# LUNC TERMINAL - ROADMAP_TODO",
  "Version : 1.0",
  "",
  "# PHASES TERMINÉES (V1)",
  "- Phase 0: Fondations (Next.js 15, TypeScript, Tailwind, Architecture Feature First).",
  "- Phase 1: Design System (Palette, Glassmorphism, Composants UI).",
  "- Phase 2: Authentification (Wallet Context, Keplr, Leap).",
  "- Phase 3: Portfolio & DFC (Lecture balances CW20, Staking DFC, Claim Rewards).",
  "- Phase 4: Burn Engine (Simulateur, Exécution CosmWasm).",
  "- Phase 5: Staking Native (Validateurs, MsgDelegate).",
  "- Phase 6: Governance (Propositions, MsgVote).",
  "- Phase 7: News (Flux RSS).",
  "- Phase 8: Mode Simple / Expert (Zustand).",
  "- Phase 9: Analytics (Graphiques Recharts).",
  "",
  "# BACKLOG (VERSION 2)",
  "- Bridge IBC intégré",
  "- Swap multi-DEX",
  "- Suivi DeFi",
  "- Assistant IA embarqué",
  "- Notifications Push",
  "- Application PWA"
]);

w('docs/AI_CONTEXT.md', [
  "# LUNC TERMINAL - AI_CONTEXT",
  "Version : 1.0",
  "",
  "# INSTRUCTIONS POUR L'IA",
  "Tu es le développeur principal du projet LUNC TERMINAL. Avant d'écrire du code, lis la documentation dans le dossier /docs.",
  "",
  "# ARCHITECTURE ACTUELLE",
  "Le projet utilise Next.js App Router. Le wallet utilise un Context React custom pour contourner les bugs de @terra-money/wallet-kit sous Turbopack. Les données sont fetchées via TanStack Query. Les fichiers sont générés via des scripts .cjs pour éviter les erreurs de formatage.",
  "",
  "# OBJECTIF FINAL",
  "Créer du code modulaire, documenté, testable, typé, performant, réutilisable et sécurisé. Le projet doit pouvoir évoluer pendant plusieurs années sans nécessiter de réécriture complète."
]);

w('docs/PRODUCT_SPECIFICATIONS.md', [
  "# LUNC TERMINAL - PRODUCT_SPECIFICATIONS",
  "Version : 1.0",
  "",
  "# VISION",
  "LUNC TERMINAL est la plateforme Web3 de référence pour Terra Classic. Le produit ne doit jamais être perçu comme un clone de DFLUNC, mais comme une évolution de l'expérience utilisateur.",
  "",
  "# UTILISATEURS CIBLES",
  "Débutant (Aucune donnée technique affichée), Utilisateur régulier (Staking, Burn, Rewards), Expert (Contrats, Transactions, Mode Expert).",
  "",
  "# NAVIGATION",
  "Sidebar permanente: Dashboard, DFC Hub, Burn, Validators, Governance, News, Settings.",
  "",
  "# QUALITÉ",
  "Toutes les pages doivent comporter des états de Loading (Skeletons), Empty State, Error State, et Succès."
]);

console.log('\n🎉 Toute la documentation a été sauvegardée dans /docs !');