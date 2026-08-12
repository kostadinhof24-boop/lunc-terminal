# LUNC TERMINAL
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
