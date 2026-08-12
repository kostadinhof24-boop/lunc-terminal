export interface ChainConfig {
  chainId: string;
  chainName: string;
  rpcUrl: string;
  lcdUrl: string;
  denom: string;
  symbol: string;
  coinGeckoId: string;
}

// Configuration des chaînes supportées par le Terminal
export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    chainId: 'columbus-5',
    chainName: 'Terra Classic',
    rpcUrl: 'https://terra-classic-rpc.publicnode.com',
    lcdUrl: 'https://terra-classic-lcd.publicnode.com',
    denom: 'uluna',
    symbol: 'LUNC',
    coinGeckoId: 'terra-classic'
  },
  {
    chainId: 'cosmoshub-4',
    chainName: 'Cosmos Hub',
    rpcUrl: 'https://cosmos-rpc.publicnode.com',
    lcdUrl: 'https://cosmos-lcd.publicnode.com',
    denom: 'uatom',
    symbol: 'ATOM',
    coinGeckoId: 'cosmos'
  }
];

export const getChainConfig = (chainId: string) => SUPPORTED_CHAINS.find(c => c.chainId === chainId);