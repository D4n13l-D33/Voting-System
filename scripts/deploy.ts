import { ethers } from "hardhat";

async function main() {
  
  const votingSystem = await ethers.deployContract("VotingSystem");

  await votingSystem.waitForDeployment();

  console.log(
    `Voting System Contract deployed to ${votingSystem.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
