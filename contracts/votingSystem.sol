// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VotingSystem {
    address public Owner;

    uint public voteCount;
    
    enum options {optionA, optionB, optionC}

    struct Vote {
        uint voteID;
        string name;
        string description;
        uint optionACount;
        uint optionBCount;
        uint optionCCount;
        
    }
    //maps all the votes created
    mapping(uint => Vote) voting;

    //maps all the address that votes to tackle double voting
    mapping(address => bool)hasVoted;

    //records all the votes created
    Vote [] public allvotes;

    constructor(){
        Owner = msg.sender;
    }

    function createVote(string calldata _name, string calldata _description) external{
        
        onlyOwner();

        uint vID = voteCount + 1;

        Vote storage votes = voting[vID];
        
        votes.name = _name;
        votes.description = _description;
        votes.voteID = vID;

        allvotes.push(votes);

        voteCount = voteCount + 1;
    }

    function castVote(uint _voteID, uint _option) external {
        
        require(hasVoted[msg.sender]==false, "You can't vote twice");
        
        require(_voteID <= voteCount, "Invalid Vote ID");

        require(_option < 3, "Invalid Option");

        options votecast = options(_option);

        Vote storage votes = voting[_voteID];

        if(votecast == options(0)){
            votes.optionACount = votes.optionACount + 1;
        } else if(votecast == options(1)){
            votes.optionBCount = votes.optionBCount + 1;
        }   else{
            votes.optionCCount = votes.optionCCount + 1;
        }

        hasVoted[msg.sender] = true;

        allvotes[_voteID - 1] = votes;
    }

    function onlyOwner() private view {
        require(msg.sender == Owner);
    }

}