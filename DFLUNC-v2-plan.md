# DFLUNC v2 Reconstruction Plan

## 1. État actuel du projet

### Existant
- Next.js 16.2.11 avec App Router
- React 19
- TypeScript
- Tailwind v4
- `@tanstack/react-query`, `@terra-money/feather.js`, `@terra-money/wallet-kit`
- `Prisma` + PostgreSQL configuré dans `prisma/schema.prisma`
- Custom hooks : `src/hooks/useDFC.ts`
- Composants wallet / dashboard : `src/components/ConnectWalletButtonClient.tsx`, `src/components/DashboardClient.tsx`
- Page dynamique principale : `src/app/page.tsx`
- Provider racine encore basique dans `src/app/providers.tsx`

### Points à améliorer
- Pas de wallet provider global configuré dans `src/app/providers.tsx`
- Pas de séparation claire `services` / `hooks` / `components`
- Contrats DFC et messages CosmWasm non formalisés
- Schéma Prisma existant mais pas aligné avec une application DFLUNC
- Support wallet insuffisant : seulement `@terra-money/wallet-kit` et wallet connect natif minimal
- Interface d’administration / historique / claim rewards à centraliser

## 2. Objectifs de reconstruction

### Mission globale
Recréer une application personnelle `DFLUNC v2` capable de :
- se connecter avec Terra Station / Keplr / WalletConnect / Ledger
- détecter automatiquement les adresses et le réseau
- afficher solde DFC, actifs LUNC et autres tokens
- afficher les rewards et permettre leur claim
- signer, simuler et broadcast des transactions CosmWasm
- afficher un historique on-chain complet
- interagir avec les contrats DFC existants
- fournir une interface premium dark/glassmorphism
- respecter les bonnes pratiques de sécurité Web3

## 3. Audit fonctionnel initial

### Fonctions à reconstruire
1. Wallet connect / disconnect
2. Dashboard portefeuille DFC
3. Affichage des assets LUNC/DFC/other tokens
4. Rewards disponibles et historique
5. Claim rewards / envoyer transaction
6. Simulations et estimation de gas
7. Historique transactions et base de données
8. Contrats DFC / état du contrat / permissions
9. Sécurité / validation / environment

### Examen des contrats DFLUNC publics
- Contrat DFC token `terra1...` probable sur Columbus-5
- Contrats de staking / rewards `terra1...` sur LUNC Classic
- Contrats CosmWasm `execute`, `query`, `handle` pour `claim`, `balance`, `rewards`

> À compléter par rétro-ingénierie on-chain et recherche du code source des contrats.

## 4. Architecture cible

### Frontend
- `src/app/` : pages App Router
- `src/components/` : UI atomiques, sections, tableau de bord
- `src/hooks/` : hooks métier (`useDFC`, `useWallet`, `useTransactionHistory`)
- `src/services/` : services blockchain / API / wallet
- `src/lib/` : utilitaires, constantes, types
- `src/app/providers.tsx` : wrapper global avec `WalletProvider`, `QueryClientProvider`, `ThemeProvider`
- `src/app/api/` : routes server-side pour cache sécurisé, historiques, commandes backend

### Backend / API
- `src/app/api/dfc/*` : endpoints pour requêtes on-chain sécurisées, simulations, cache DB
- `src/lib/prisma.ts` : singleton Prisma client
- `src/services/backend` : gestion des données persistantes

### Services blockchain
- `src/services/BlockchainService.ts` : wrapper Cosmos/Feather, query/execute/simulate/broadcast
- `src/services/WalletService.ts` : gestion TerraStation / Keplr / WalletConnect / Ledger
- `src/services/DFCService.ts` : fonctions DFC spécifiques (`getBalance`, `getRewards`, `claimRewards`, `getContractState`, `getTransactions`)

### Données / cache
- React Query pour cache front-end et refetch
- Prisma / PostgreSQL pour historique utilisateur, tx, contrats, preferences
- API server pour centraliser les endpoints LCD/RPC si nécessaire

### Sécurité
- Aucune clé privée stockée
- Variables d’environnement gérées via `.env`/Vercel
- Validation Zod côté API
- Protection XSS via React + sanitize les strings dynamiques
- Protection CSRF via routes App Router sécurisées et tokens sur API
- Validation des messages avant exécution

## 5. Contrats / endpoints indispensables

### Endpoints Terra Classic
- RPC / LCD principal : `https://terra-classic-lcd.publicnode.com`
- CosmWasm queries : `/cosmwasm/wasm/v1/contract/{contract}/smart/{query}`
- Bank balances : `/cosmos/bank/v1beta1/balances/{address}`
- Tx search / tx broadcast : `/cosmos/tx/v1beta1/txs` et `/cosmos/tx/v1beta1/txs/{hash}`
- Auth/accounts : `/cosmos/auth/v1beta1/accounts/{address}`
- Staking validators : `/cosmos/staking/v1beta1/validators`

### API DFLUNC spécifiques
- Balance DFC token contract query
- Rewards query contract staking
- Claim execute contract msg
- Query historique txs sur `message.action` / `logs`

## 6. Structure des composants proposée

### Pages clés
- `/` : dashboard principal
- `/wallet` : gestion wallet / connexion / réseau
- `/rewards` : détail rewards + claim
- `/transactions` : historique txs
- `/contracts` : état des contrats DFC
- `/settings` : network/testnet / préférences

### Composants
- `WalletStatusCard`, `AssetTable`, `RewardSummary`, `TransactionList`, `ContractCard`, `DashboardHeader`
- `ConnectWalletButton`, `NetworkSelector`, `ClaimRewardsButton`
- `LoadingSkeleton`, `ErrorBanner`, `ModalConfirm`

### UI / UX
- Thème galaxie / glassmorphism / dark
- Animations fluides avec `framer-motion`
- Composants shadcn/ui pour formulaires / tables / modals
- Responsive mobile-first

## 7. Structure des services

### WalletService
- `connectTerraStation()`
- `connectKeplr()`
- `connectWalletConnect()`
- `connectLedger()`
- `disconnect()`
- `getAddress()`
- `getNetwork()`
- `isWalletConnected()`
- `signAmino()` / `signDirect()`
- `simulateTx()`
- `estimateGas()`

### BlockchainService
- `queryContract(contract, query)`
- `executeContract(msgs, fee, gasAdjustment, chainID)`
- `simulateTx(tx)`
- `estimateGas(tx)`
- `broadcastTx(signedTx)`
- `waitForConfirmation(txhash)`

### DFCService
- `getTokenBalance(address)`
- `getRewards(address)`
- `claimRewards(address)`
- `getDFCContractState()`
- `getTransactionHistory(address)`
- `getRewardsHistory(address)`

## 8. Schéma de base de données proposé

```prisma
model User {
  id          String   @id @default(cuid())
  walletId    String   @unique
  address     String   @unique
  network     String
  lastSeenAt  DateTime @updatedAt
  createdAt   DateTime @default(now())
  sessions    Session[]
  transactions Transaction[]
  tokens      TokenBalance[]
  rewards     Reward[]
}

model Session {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  provider  String
  connected Boolean
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TokenBalance {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  denom     String
  amount    Decimal  @db.Decimal(40, 18)
  updatedAt DateTime @updatedAt
}

model Reward {
  id             String   @id @default(cuid())
  user           User     @relation(fields: [userId], references: [id])
  userId         String
  contract       String
  amount         Decimal  @db.Decimal(40, 18)
  claimable      Boolean
  lastUpdatedAt  DateTime @updatedAt
}

model Transaction {
  id            String   @id @default(cuid())
  user          User     @relation(fields: [userId], references: [id])
  userId        String
  txHash        String   @unique
  type          String
  status        String
  fee           Decimal  @db.Decimal(40, 18)
  amount        Decimal? @db.Decimal(40, 18)
  denom         String?
  memo          String?
  timestamp     DateTime
  chainId       String
  rawJson       Json
  createdAt     DateTime @default(now())
}

model ContractState {
  id            String   @id @default(cuid())
  contract      String   @unique
  name          String
  network       String
  json          Json
  lastUpdatedAt DateTime @updatedAt
}
```

## 9. Roadmap de reconstruction

### Phase 1 : Audit + architecture
- Audit dossier existant et gaps techniques
- Formaliser les contrats DFC et endpoints Terra Classic
- Définir composants / services / modèle DB
- Créer architecture App Router + providers
- Préparer la stack wallet professionnelle

### Phase 2 : Wallet system
- Mettre en place `WalletProvider` global
- Implémenter connexion Terra Station / Keplr / WalletConnect / Ledger
- Gérer auto-reconnexion, réseau, multi-comptes
- Créer UI de connexion et état wallet

### Phase 3 : Services blockchain
- Créer `BlockchainService`, `WalletService`, `DFCService`
- Implémenter query contract / simulate / broadcast
- Ajouter utils pour conversions LUNC/DFC, fees

### Phase 4 : Dashboard DFC
- Écran principal portefeuille DFC
- Balance DFC, LUNC et autres tokens
- Rewards disponibles + historique
- Contrats DFC / état on-chain
- Claim Rewards avec simulate + fees

### Phase 5 : Historique + transactions
- Récupérer tx list on-chain
- Enregistrer en DB les tx pertinentes
- Afficher statut, hash, frais, lien Mintscan
- Implémenter pagination / filtres

### Phase 6 : UI premium
- Thème galaxie / glassmorphism
- Animations framer-motion
- Responsive + dark mode
- shadcn/ui pour formulaires et modales

### Phase 7 : Sécurité et QA
- Valider absence de clé privée
- Zod validation API
- CSRF / XSS hardening
- Tests unitaires / intégration
- Build & déploiement Vercel

## 10. Prochaine étape immédiate

1. Créer `src/services/BlockchainService.ts` et `src/services/WalletService.ts`
2. Mettre à jour `src/app/providers.tsx` avec `WalletProvider` et `QueryClientProvider`
3. Construire `src/components/ConnectWalletButtonClient.tsx` en mode wallet global
4. Créer `src/hooks/useDFC.ts` en liaison avec `DFCService`
5. Ajouter une page de connexion multi-wallet et un dashboard de base

---

Cette feuille de route te permet de transformer le projet actuel en une application DFLUNC v2 complète et modulaire. Si tu veux, je passe immédiatement à l’implémentation du provider global et du service wallet. 
