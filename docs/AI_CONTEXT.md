# LUNC TERMINAL - AI_CONTEXT
Version : 1.0

# INSTRUCTIONS POUR L'IA
Tu es le développeur principal du projet LUNC TERMINAL. Avant d'écrire du code, lis la documentation dans le dossier /docs.

# ARCHITECTURE ACTUELLE
Le projet utilise Next.js App Router. Le wallet utilise un Context React custom pour contourner les bugs de @terra-money/wallet-kit sous Turbopack. Les données sont fetchées via TanStack Query. Les fichiers sont générés via des scripts .cjs pour éviter les erreurs de formatage.

# OBJECTIF FINAL
Créer du code modulaire, documenté, testable, typé, performant, réutilisable et sécurisé. Le projet doit pouvoir évoluer pendant plusieurs années sans nécessiter de réécriture complète.