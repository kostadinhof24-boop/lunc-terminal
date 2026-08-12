'use client'

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-kit'

type TerraWalletContextValue = {
  walletController: ReturnType<typeof useWallet>
  connectedWallet: ReturnType<typeof useConnectedWallet>
  address: string | null
  isConnected: boolean
  connectWallet: (walletId?: string) => Promise<void>
  disconnectWallet: () => Promise<void>
  availableWallets: ReturnType<typeof useWallet>['availableWallets']
  status: ReturnType<typeof useWallet>['status']
}

const TerraWalletContext = createContext<TerraWalletContextValue | null>(null)

export function TerraWalletProvider({ children }: { children: ReactNode }) {
  const walletController = useWallet()
  const connectedWallet = useConnectedWallet()

  const address = useMemo(() => {
    if (!connectedWallet) return null
    const values = Object.values(connectedWallet.addresses)
    return values.length > 0 ? values[0] : null
  }, [connectedWallet])

  const isConnected = useMemo(
    () =>
      walletController.status === WalletStatus.CONNECTED &&
      Boolean(connectedWallet) &&
      Boolean(address),
    [walletController.status, connectedWallet, address]
  )

  const connectWallet = useCallback(
    async (walletId?: string) => {
      if (walletId) {
        await walletController.connect(walletId)
        return
      }

      const installedWallet = walletController.availableWallets?.find((wallet) => wallet.isInstalled)
      if (installedWallet) {
        await walletController.connect(installedWallet.id)
        return
      }

      throw new Error('Aucun wallet Terra installé. Installez Station ou un wallet compatible pour continuer.')
    },
    [walletController]
  )

  const disconnectWallet = useCallback(async () => {
    await walletController.disconnect()
  }, [walletController])

  const value = useMemo(
    () => ({
      walletController,
      connectedWallet,
      address,
      isConnected,
      connectWallet,
      disconnectWallet,
      availableWallets: walletController.availableWallets,
      status: walletController.status,
    }),
    [
      walletController,
      connectedWallet,
      address,
      isConnected,
      connectWallet,
      disconnectWallet,
    ]
  )

  return <TerraWalletContext.Provider value={value}>{children}</TerraWalletContext.Provider>
}

export function useTerraWalletContext() {
  const context = useContext(TerraWalletContext)
  if (!context) {
    throw new Error('useTerraWalletContext must be used within TerraWalletProvider')
  }
  return context
}
