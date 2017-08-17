pragma solidity ^0.4.11;

contract Owned {

    address public owner;

    function Owned() {
        owner = msg.sender; 
    }

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
    
}