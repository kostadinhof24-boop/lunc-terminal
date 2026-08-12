/**
 * BURN ENGINE - Moteur de calcul du protocole DFLUNC
 * Toutes les valeurs sont en unités de base (uluna, uusd) sauf indication contraire.
 */

const BATCH_SIZE_ULUNA = 5_000_000_000; // 1 Batch = 5,000 LUNC (5000 * 1M micro)
const FEE_PER_BATCH_UUSD = 4_999_750; // Frais de 4.99975 USTC par batch (en micro)

export const BurnEngine = {
  /**
   * Calcule le nombre de batches achetables avec un montant donné.
   * On ne peut brûler que des batches entiers.
   */
  calculateBatches(amountUluna: number): number {
    if (amountUluna <= 0) return 0;
    return Math.floor(amountUluna / BATCH_SIZE_ULUNA);
  },

  /**
   * Calcule les frais de protocole (en USTC) basés sur le nombre de batches.
   */
  calculateProtocolFee(batches: number): number {
    return batches * FEE_PER_BATCH_UUSD;
  },

  /**
   * Estime les DFC qui seront mintés.
   * Hypothèse: 1 Batch = 1000 DFC (à ajuster selon le cycle actuel).
   */
  estimateDFCMint(batches: number, mintRatio: number = 1000_000000): number {
    return batches * mintRatio;
  },

  /**
   * Formate un nombre micro (uluna) en format lisible (LUNC).
   */
  formatToMacro(microAmount: number, decimals: number = 6): number {
    return microAmount / Math.pow(10, decimals);
  }
};