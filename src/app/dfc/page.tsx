import type { Metadata } from "next";
import DfcHubClient from "@/features/dfc/components/DfcHubClient";

export const metadata: Metadata = {
  title: "DFC Hub",
  description: "Le centre névralgique du protocole DFLunc : Burn, Staking et Récompenses.",
};

export default function DfcHubPage() {
  return <DfcHubClient />;
}
