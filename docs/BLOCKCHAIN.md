# LUNC TERMINAL - BLOCKCHAIN.md
Version : 1.0

# OBJECTIF
Définir l'architecture Blockchain officielle de LUNC Terminal. Le projet doit être entièrement non custodial.

# BLOCKCHAIN SUPPORTÉE
Chaîne principale: Terra Classic (Chain ID: columbus-5). Native Token: LUNC. Stablecoin: USTC.

# WALLETS
Support obligatoire: Station, Keplr, Leap, Ledger, WalletConnect. Chaque wallet implémente la même interface (connect, disconnect, sign, broadcast, simulate, getBalances, getAddress, etc.).

# SIGNATURE
Toutes les transactions suivent ce cycle : Création du message -> Simulation -> Calcul du Gas -> Validation -> Signature Wallet -> Broadcast -> Suivi -> Confirmation -> Mise à jour de l'interface.

# COSMWASM & TOKENS
Support complet des requêtes CosmWasm (contractQuery, execute). Classification automatique des tokens (Native, CW20, IBC, NFT). L'utilisateur ne doit jamais voir ibc/0471F1... sauf dans le mode Expert.

# SÉCURITÉ
Aucune clé privée. Aucun stockage local des secrets. Validation de tous les paramètres. Protection contre les doubles signatures/clics. Confirmation utilisateur obligatoire.