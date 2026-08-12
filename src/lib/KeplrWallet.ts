import type { ConnectResponse, InfoResponse, Wallet } from '@terra-money/wallet-interface';
import { CHAIN_ID } from '@/lib/terra';

declare global {
  interface Window {
    keplr?: {
      enable: (chainId: string) => Promise<void>
      getKey: (chainId: string) => Promise<{ bech32Address: string; name: string }>
    }
  }
}

const KEPLR_INSTALL_URL = 'https://www.keplr.app/';

function isBrowser() {
  return typeof window !== 'undefined';
}

export class KeplrWallet implements Wallet {
  public readonly id = 'keplr';
  public readonly details = {
    name: 'Keplr',
    icon: 'https://www.keplr.app/icon.png',
    website: KEPLR_INSTALL_URL,
  };

  public readonly isInstalled = isBrowser() && !!window.keplr;

  constructor(private readonly networks: InfoResponse) {}

  async info(): Promise<InfoResponse> {
    if (!this.isInstalled) {
      throw new Error('Keplr wallet non installé')
    }
    return this.networks
  }

  async connect(): Promise<ConnectResponse> {
    if (!this.isInstalled || !window.keplr) {
      throw new Error('Keplr wallet non installé')
    }

    await window.keplr.enable(CHAIN_ID)
    const key = await window.keplr.getKey(CHAIN_ID)

    return {
      addresses: {
        [CHAIN_ID]: key.bech32Address,
      },
      name: key.name,
    }
  }

  async post(): Promise<never> {
    throw new Error('Keplr post non pris en charge dans cette version')
  }

  async sign(): Promise<never> {
    throw new Error('Keplr sign non pris en charge dans cette version')
  }

  addListener(): void {
    // Keplr ne supporte pas encore le listener custom dans ce wrapper minimal.
  }

  removeListener(): void {
    // Keplr ne supporte pas encore le listener custom dans ce wrapper minimal.
  }
}
