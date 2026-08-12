import axios from 'axios';
import { LCD_URL } from '@/lib/terra';

export type QueryResponse = any;

export class BlockchainService {
  static async queryContract(contract: string, query: object) {
    const encoded = typeof window === 'undefined' ? '' : window.btoa(JSON.stringify(query));
    const url = `${LCD_URL}/cosmwasm/wasm/v1/contract/${contract}/smart/${encoded}`;
    const res = await axios.get<QueryResponse>(url);
    return res.data;
  }

  static async queryBankBalance(address: string, denom: string) {
    const res = await axios.get(`${LCD_URL}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`);
    return res.data;
  }

  static async queryAccount(address: string) {
    const res = await axios.get(`${LCD_URL}/cosmos/auth/v1beta1/accounts/${address}`);
    return res.data;
  }

  static async queryTx(txHash: string) {
    const res = await axios.get(`${LCD_URL}/cosmos/tx/v1beta1/txs/${txHash}`);
    return res.data;
  }
}
