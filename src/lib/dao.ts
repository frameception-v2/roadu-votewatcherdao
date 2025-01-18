import { SUPPORTED_DAOS } from "~/lib/constants";

export async function getVotingPower(address: string): Promise<number> {
  try {
    // Query voting power from all supported DAOs
    const votingPowers = await Promise.all(
      SUPPORTED_DAOS.map(async dao => {
        const response = await fetch(
          `https://api.votewatcherdao.xyz/voting-power?address=${address}&dao=${dao.votingPowerQuery}`
        );
        const data = await response.json();
        return data.votingPower || 0;
      })
    );
    
    // Sum voting power across all DAOs
    return votingPowers.reduce((sum, power) => sum + power, 0);
  } catch (error) {
    console.error("Error fetching voting power:", error);
    return 0;
  }
}

export async function getActiveProposals(): Promise<any[]> {
  try {
    // Get active proposals from all supported DAOs
    const allProposals = await Promise.all(
      SUPPORTED_DAOS.map(async dao => {
        const response = await fetch(
          `https://api.votewatcherdao.xyz/proposals?dao=${dao.votingPowerQuery}`
        );
        const data = await response.json();
        return data.proposals || [];
      })
    );
    
    // Flatten and sort by end date
    return allProposals.flat().sort((a, b) => 
      new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    );
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return [];
  }
}

export async function checkVoteEligibility(address: string, proposalId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.votewatcherdao.xyz/eligibility?address=${address}&proposal=${proposalId}`
    );
    const data = await response.json();
    return data.isEligible || false;
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return false;
  }
}
