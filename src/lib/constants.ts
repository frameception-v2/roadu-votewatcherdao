export const PROJECT_ID = "VoteWatcherDAO";
export const PROJECT_TITLE = "VoteWatcherDAO";
export const PROJECT_DESCRIPTION = "Your decentralized governance companion - Track DAO votes, receive notifications, and never miss a governance opportunity";

// DAO Configuration
export const SUPPORTED_DAOS = [
  {
    name: "Uniswap",
    address: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
    chainId: 1,
    votingPowerQuery: "uniswap-voting-power"
  },
  {
    name: "Aave",
    address: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
    chainId: 1,
    votingPowerQuery: "aave-voting-power"
  }
];
