pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract CarToken is ERC721{

    address[] Address;
    struct Car{
        uint16 id;
        uint16 pricePerDay;
        uint16 totalAmountPayedByRenter;
        bool isRented;
    }
    uint16[] tokensIds = new uint16[](100);
    uint16 existingCarsNumber;
    mapping(uint16=>Car) public cars;
    address public owner;

    constructor() public {
        owner = msg.sender; // The Sender is the Owner; Ethereum Address of the Owner
    }

    function createCar(uint16 _id, address _to,uint16 pricePerDay) public {
        require(owner == msg.sender,"Sender not authorized."); // Only the Owner can create Items
        _mint(_to,_id); // Assigns the Token to the Ethereum Address that is specified
        cars[_id].id = _id;
        cars[_id].isRented = false;
        cars[_id].pricePerDay = pricePerDay;
        cars[_id].totalAmountPayedByRenter = 0;
        tokensIds[existingCarsNumber] = _id;
        existingCarsNumber++;
    }

    function getAllAvailableCars() public view  returns(Car[] memory) {
        Car[] memory existingCars = new Car[](existingCarsNumber);
        uint16 j = 0;
        for(uint16 i = 0; i <= existingCarsNumber;i++){
            if(tokensIds[i] != 0){
                if(_exists(tokensIds[i])){
                    if(ownerOf(tokensIds[i]) == owner){
                        existingCars[j] = cars[tokensIds[i]];
                        j++;
                    }
                }
            }
        }
        return existingCars;
    }

        function getAllRentedCars() public view  returns(Car[] memory) {
        Car[] memory existingCars = new Car[](existingCarsNumber);
        uint16 j = 0;
        for(uint16 i = 0; i <= existingCarsNumber;i++){
            if(tokensIds[i] != 0){
                if(_exists(tokensIds[i])){
                    if(ownerOf(tokensIds[i]) != owner){
                        existingCars[j] = cars[tokensIds[i]];
                        j++;
                    }
                }
            }
        }
        return existingCars;
    }

    function transferCarToTheRenterAndSetTotalAmount(address renter,uint16 tokenId,uint8 daysRented) public {
        safeTransferFrom(owner,renter,tokenId);
        cars[tokenId].totalAmountPayedByRenter = cars[tokenId].pricePerDay * daysRented;
    }

    function transferCarToAdmin(address renter,uint16 tokenId) public {
        safeTransferFrom(renter,owner,tokenId);
    }

    function returnCarToTheRenteeAndGetTotalAmountPayedByRenter(uint16 tokenId) public returns(uint16){
        require(owner == msg.sender,"Sender not authorized."); // Only the Owner can create Items
        _burn(tokenId);
        return cars[tokenId].totalAmountPayedByRenter;
    }
}