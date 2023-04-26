// fetchChains.js
// grabs network data from chainid and marketcap data from defillama, merges the two, then filters by those that have marketcaps between 1 & 5 million

import fetch from "node-fetch";
import fs from "fs";


const DEFI_LLAMA_API_URL = "https://api.llama.fi/chains";
const CHAIN_ID_API_URL = "https://chainid.network/chains.json";

async function fetchDefiLlamaChains() {
  try {
    const response = await fetch(DEFI_LLAMA_API_URL);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Defi Llama chains:", error);
    return [];
  }
}

async function fetchChainIdChains() {
  try {
    const response = await fetch(CHAIN_ID_API_URL);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Chain ID chains:", error);
    return [];
  }
}

async function main() {
  const defiLlamaChains = await fetchDefiLlamaChains();
  const chainIdChains = await fetchChainIdChains();

  const filteredChains = defiLlamaChains.reduce((accumulator, chain) => {
    const mcap = parseFloat(chain.tvl / 1000000);
    if (mcap >= 1 && mcap <= 5) {
      const chainIdChain = chainIdChains.find((item) => item.name.toLowerCase() === chain.name.toLowerCase());
      if (chainIdChain) {
        accumulator.push({ ...chain, ...chainIdChain });
      }
    }
    return accumulator;
  }, []);

  const outputFile = "filteredChainsWithNetworkData.json";
  fs.writeFileSync(outputFile, JSON.stringify(filteredChains, null, 2));
  console.log(`Filtered chains with network data saved to ${outputFile}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
