# LUNC TERMINAL - TECHNICAL ARCHITECTURE
Version : 1.0

# OBJECTIF
Définir l'architecture officielle de LUNC Terminal.

# PHILOSOPHIE
Architecture Enterprise. Clean Architecture, SOLID, Feature First, Domain Driven Design (léger), Composition over Inheritance, Atomic Design, Type Safety, Testabilité maximale.

# STACK
Framework: Next.js 15, React 19, TypeScript, pnpm
Frontend: TailwindCSS, Shadcn/UI, Framer Motion, Lucide Icons, React Hook Form, Zod, TanStack Query, React Virtual, Recharts
Blockchain: Wallet Kit, CosmJS, CosmWasm, Terra LCD, RPC, IBC, CW20, CW721, Cosmos SDK
Backend: Next.js Route Handlers, Prisma, PostgreSQL, Redis, CRON Jobs, WebSocket

# DOSSIERS
src/app/, components/, features/, hooks/, services/, lib/, store/, types/, constants/, config/, utils/, styles/, assets/, tests/, docs/, scripts/

# FEATURE FIRST
Chaque fonctionnalité est indépendante. Exemple: features/wallet/, features/burn/, features/staking/, etc. Chaque dossier contient ses propres components, hooks, services, types, tests.

# SERVICES ET HOOKS
Tous les appels passent par des hooks (useWallet, useBurn, useRewards, etc.). Jamais directement depuis les composants. Toute la logique métier va dans les services (wallet.service.ts, burn.service.ts, etc.).

# RÈGLE D'OR
Un composant ne doit jamais connaître la blockchain. Il appelle uniquement un hook. Le hook appelle un service. Le service appelle les APIs ou la blockchain. Aucune logique métier dans les composants.