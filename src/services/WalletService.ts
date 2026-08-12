import { assertValidTerraClassicAddress, CHAIN_ID, DFC_STAKING_CONTRACT } from '@/lib/terra';
import { Fee, MsgExecuteContract } from '@terra-money/feather.js';
import type { WalletResponse, ConnectResponse } from '@terra-money/wallet-interface';

export class WalletService {
  private controller: WalletResponse | null = null;
  private connected: ConnectResponse | null = null;

  constructor(controller?: WalletResponse | null, connected?: ConnectResponse | null) {
    this.controller = controller ?? null;
    this.connected = connected ?? null;
  }

  isConnected() {
    return !!this.controller && !!this.connected;
  }

  getAddress() {
    return this.connected ? Object.values(this.connected.addresses || {})[0] : undefined;
  }

  async claimRewards() {
    if (!this.controller) throw new Error('Wallet controller non connecté');
    if (!this.controller.post) throw new Error('Post non disponible');

    const address = this.getAddress();
    if (!address) throw new Error('Adresse non disponible');

    assertValidTerraClassicAddress(DFC_STAKING_CONTRACT, 'DFC_STAKING_CONTRACT');
    const msg = new MsgExecuteContract(address, DFC_STAKING_CONTRACT, { claim: {} }, {});
    const fee = new Fee(200000, { uluna: '5000' });

    return this.controller.post({
      msgs: [msg],
      fee,
      gasAdjustment: '1.5',
      chainID: CHAIN_ID,
    });
  }
}
