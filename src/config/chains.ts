export interface ChainConfig {
  chainId: string;
  chainName: string;
  rpcUrl: string;
  lcdUrl: string;
  denom: string;
  symbol: string;
  coinGeckoId: string;
}

export const TERRA_CLASSIC_CONFIG: ChainConfig = {
  chainId: 'columbus-5',
  chainName: 'Terra Classic',
  rpcUrl: 'https://terra-classic-rpc.publicnode.com',
  lcdUrl: 'https://terra-classic-lcd.publicnode.com',
  denom: 'uluna',
  symbol: 'LUNC',
  coinGeckoId: 'terra-classic',
};

export const SUPPORTED_CHAINS: ChainConfig[] = [
  TERRA_CLASSIC_CONFIG,
];

export const getChainConfig = (chainId: string): ChainConfig | undefined => 
  SUPPORTED_CHAINS.find(c => c.chainId === chainId);
