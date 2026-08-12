export const LCD_URL = 'https://terra-classic-lcd.publicnode.com';
export const CHAIN_ID = 'columbus-5';

const DFC_ADDRESS_REGEX = /^terra1[0-9a-z]{38}$/;

const DEFAULT_DFC_TOKEN_CONTRACT = '';
const DEFAULT_DFC_STAKING_CONTRACT = '';

const resolveDFCContractAddress = (envValue: string | undefined, fallback: string, name: string) => {
  if (envValue && DFC_ADDRESS_REGEX.test(envValue)) {
    return envValue;
  }

  if (envValue && !DFC_ADDRESS_REGEX.test(envValue)) {
    console.warn(
      `[DFLUNC] Invalid Terra Classic address supplied for ${name}: ${envValue}. ` +
      'Please set a valid NEXT_PUBLIC_* contract address in your environment.'
    );
  }

  if (fallback && DFC_ADDRESS_REGEX.test(fallback)) {
    return fallback;
  }

  return '';
};

export const DFC_TOKEN_CONTRACT = resolveDFCContractAddress(
  process.env.NEXT_PUBLIC_DFC_TOKEN_CONTRACT,
  DEFAULT_DFC_TOKEN_CONTRACT,
  'NEXT_PUBLIC_DFC_TOKEN_CONTRACT'
);

export const DFC_STAKING_CONTRACT = resolveDFCContractAddress(
  process.env.NEXT_PUBLIC_DFC_STAKING_CONTRACT,
  DEFAULT_DFC_STAKING_CONTRACT,
  'NEXT_PUBLIC_DFC_STAKING_CONTRACT'
);

export const DFC_TOKEN_DENOM = 'uluna';
export const MICRO_FACTOR = 1_000_000;

export const DFC_CONTRACTS = {
  token: DFC_TOKEN_CONTRACT,
  staking: DFC_STAKING_CONTRACT,
};

export const isTerraClassicAddress = (address: string) => DFC_ADDRESS_REGEX.test(address);

export function assertValidTerraClassicAddress(address: string, name: string) {
  if (!isTerraClassicAddress(address)) {
    throw new Error(`Invalid Terra Classic contract configured for ${name}. Set ${name} with a valid terra1 address.`);
  }
}

export const hasValidDFCContracts = () =>
  isTerraClassicAddress(DFC_TOKEN_CONTRACT) && isTerraClassicAddress(DFC_STAKING_CONTRACT);

export function getDFCContractAddress(contractType: 'token' | 'staking') {
  return contractType === 'token' ? DFC_TOKEN_CONTRACT : DFC_STAKING_CONTRACT;
}
