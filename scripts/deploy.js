// deploy.js

require("dotenv").config();
const fs = require("fs");
const { ethers } = require("hardhat");

const CONTRACT_NAME = "Goblin";
const GOBLIN_SOL_FILE = "./contracts/Goblin.sol";
const FILTERED_CHAINS_FILE = "filteredChainsWithNetworkData.json";

function readFilteredChains() {
  try {
    const data = fs.readFileSync(FILTERED_CHAINS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read filtered chains:", error);
    return [];
  }
}

async function main() {
  const filteredChains = readFilteredChains();

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log(`Deploying ${CONTRACT_NAME} contracts with account: ${deployerAddress}`);

  let nonce = await deployer.getTransactionCount();

  for (const chain of filteredChains) {
    if (!chain.rpc || chain.rpc.length === 0) continue;

    const networkName = chain.name.toLowerCase();
    console.log(`Deploying to ${networkName}`);

    try {
      const provider = new ethers.providers.JsonRpcProvider(chain.rpc[0]);
      const deployerWithProvider = deployer.connect(provider);

      const Goblin = await ethers.getContractFactory(CONTRACT_NAME, {
        libraries: {
          // Add the library addresses if any
        },
      });
      const goblin = await Goblin.connect(deployerWithProvider).deploy({ from: deployerAddress, nonce });
      await goblin.deployed();
      console.log(`Goblin deployed to ${networkName} at address: ${goblin.address}`);

      nonce++; // Increment the nonce manually for the next deployment
    } catch (error) {
      console.error(`Failed to deploy to ${networkName}:`, error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
