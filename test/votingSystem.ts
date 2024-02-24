import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  
  describe("VotingSystem", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployVotingSystemFixture() {
        
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();
  
      const VotingSystem = await ethers.getContractFactory("VotingSystem");
      const votingSystem = await VotingSystem.deploy();
  
      return { votingSystem, owner, otherAccount};
    }
  
    describe("Deployment", function () {
      it("Should set owner", async function () {
        const { votingSystem } = await loadFixture(deployVotingSystemFixture);
  
        const [owner, otherAccount] = await ethers.getSigners();
     
        expect(await votingSystem.Owner()).to.equal(owner.address);
      });

    });

    describe("CreateVote", function () {
        it("Only owner should call function", async function () {
          const { votingSystem } = await loadFixture(deployVotingSystemFixture);
    
          const [otherAccount] = await ethers.getSigners();

          const name = "SUG ELECTIONS";

          const description = "SUG Presidency";
       
          expect(await votingSystem.createVote(name, description)).to.be.revertedWith("You are not the Owner");
        });

        it("It should create a Vote", async function () {
            const { votingSystem } = await loadFixture(deployVotingSystemFixture);
      
            const [owner, otherAccount] = await ethers.getSigners();
  
            const name = "SUG ELECTIONS";
            const description = "SUG Presidency";

            const createvote = await votingSystem.createVote(name, description);
            createvote.wait;
         
            expect(await votingSystem.voteCount()).to.equal(1);
          });
  
      });
      
      describe("Cast Vote", function () {
        it("Should not allow a User vote twice", async function () {
          const { votingSystem, otherAccount } = await loadFixture(deployVotingSystemFixture);
    
          const name = "SUG ELECTIONS";
          const description = "SUG Presidency";

          const createvote = votingSystem.createVote(name, description);
          (await createvote).wait;

          const castvote = votingSystem.castVote(1,1);
          (await castvote).wait;
       
          expect(await votingSystem.connect(otherAccount).castVote(1,0)).to.be.revertedWith("Can not vote twice");
        });
        
        it("Should not allow if Vote ID not found", async function () {
            const { votingSystem, otherAccount } = await loadFixture(deployVotingSystemFixture);
      
            const name = "SUG ELECTIONS";
            const description = "SUG Presidency";
  
            const createvote = votingSystem.createVote(name, description);
            (await createvote).wait;
  
                    
            expect(await votingSystem.castVote(1,0)).to.be.revertedWith("Invalid Vote ID");
          });

          it("Should not allow if Invalid Vote Option", async function () {
            const { votingSystem, otherAccount } = await loadFixture(deployVotingSystemFixture);
      
            const name = "SUG ELECTIONS";
            const description = "SUG Presidency";
  
            const createvote = votingSystem.createVote(name, description);
            (await createvote).wait;
  
                    
            expect(await votingSystem.castVote(1,0)).to.be.revertedWith("Invalid Vote Option");
          });
  
  
      });
 });
  