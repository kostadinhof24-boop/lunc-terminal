'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {}
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Vérifie si Keplr est déjà connecté au chargement de la page
    const savedAddress = localStorage.getItem('keplr_address')
    if (savedAddress) {
      setAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    try {
      const w = window as any
      if (typeof w.keplr !== 'undefined') {
        await w.keplr.enable('columbus-5')
        const offlineSigner = w.keplr.getOfflineSigner('columbus-5')
        const accounts = await offlineSigner.getAccounts()
        setAddress(accounts[0].address)
        setIsConnected(true)
        localStorage.setItem('keplr_address', accounts[0].address)
      } else {
        alert("Veuillez installer l'extension Keplr.")
      }
    } catch (e) {
      console.error("Erreur Keplr", e)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem('keplr_address')
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletContext = () => useContext(WalletContext)