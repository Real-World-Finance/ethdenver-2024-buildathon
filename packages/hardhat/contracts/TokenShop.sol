// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

/* 
Line to Deploy in Remix:
BufficornCastle,BCC,500000,1000000000000000000,1709420650,15000000000000000000,10000000000000000000,20000000000000000000,0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,15000000000000000000,https://pbs.twimg.com/media/GHhtNknWMAAK4hZ?format=jpg&name=4096x4096
2024-03-02 16:04:10 -> This is the TimeStamp for the deploy test string
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RWF_Trust is ERC20, ERC20Permit, Ownable {

    uint256 private maxTokens;
    uint256 private initialPrice; //in 10**18 USD
    uint256 private price; //in 10**18 USD
    uint256 private dueDate; //UTC Unix Timestamp
    uint256 private expectedROI; //in 10**18
    uint256 private earlyWithdrawPenalty; //in 10**18 USD
    uint256 private pctCashReserve; //in 10**18
    uint256 private profitPct; //in 10**18
    uint256 private minOwnedTokens = 20;
    address[] private beneficiaries;
    string private imageURL;
    address private nftContractAddress;

    constructor(
        string  memory _name,
        string  memory _symbol,
        uint256 _maxTokens,
        uint256 _price,
        uint256 _dueDate,
        uint256 _expectedROI,
        uint256 _earlyWithdrawPenalty,
        uint256 _pctCashReserve,
        address _trust,
        uint256 _profitPct,
        string memory _imageURL
    )
        ERC20(_name, _symbol)
        ERC20Permit(_name)
        Ownable(_trust)
    {
        maxTokens = _maxTokens;
        initialPrice = _price;
        setPrice(_price);
        dueDate = _dueDate;
        expectedROI = _expectedROI;
        earlyWithdrawPenalty = _earlyWithdrawPenalty;
        pctCashReserve = _pctCashReserve;
        profitPct = _profitPct;
        imageURL = _imageURL;
        
    } //end of constructor

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function setDueDate(uint256 _dueDate) public onlyOwner {
        dueDate = _dueDate;
    }

    function getDueDate() public view returns (uint256) {
        return dueDate;
    }

    function setNftContractAddress(address _address) public onlyOwner {
        nftContractAddress = _address;
    }

    function getNftContractAddress() public view returns (address) {
        return nftContractAddress;
    }

    function setImgUrl(string memory _imgUrl) public onlyOwner {
        imageURL = _imgUrl;
    }

    function getImgUrl() public view returns (string memory) {
        return imageURL;
    }

    function getEarlyWithdrawPenalty() public view returns (uint256) {
        return earlyWithdrawPenalty;
    }

    function getMinOwnedTokens() public view returns (uint256) {
        return minOwnedTokens;
    }

    function getAvailableTokens() public view returns (uint256) {
        return maxTokens - totalSupply();
    }

    function ethExchangeValue() private pure returns (uint256) {
        //FIXME: should ask an oracle the current price in USD of one ETH:
        return 333531 * 10**16; //2024-02-29.
    }

    function buy() public payable {
        uint256 tokenAmount = msg.value * ethExchangeValue() / (price * 10**18);
        require(tokenAmount > 0, "Insufficient ETH amount to buy a single token");
        require(tokenAmount + balanceOf(msg.sender) >= minOwnedTokens,
            "Insufficient ETH amount to buy the minimum amount of tokens");
        require(tokenAmount <= getAvailableTokens(), "Insufficient tokens available, send less ETH");
        require(block.timestamp < dueDate, "Fund has been terminated");

        _mint(msg.sender, tokenAmount);

        payable(owner()).transfer( (100 * 10**18 - pctCashReserve) * msg.value / (100 * 10**18) );

        uint256 excessAmount = msg.value - (tokenAmount * price * 10**18 / ethExchangeValue());
        if (excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);
        }

        // This is buyer's first token purchase. Let's give her an NFT.
        if (balanceOf(msg.sender) == tokenAmount) {
            (bool success, ) = nftContractAddress.call(abi.encodeWithSignature("safeMint(address)", msg.sender));
            require(success, "NFT minting failed");
        }
    }

    function _sell(address payable seller, uint256 tokenAmount) private {
        require(tokenAmount > 0, "Invalid token amount");
        require(balanceOf(seller) >= tokenAmount, "Insufficient tokens in your balance");
        //FIXME: add check for selling all tokens or at least minOwnedTokens.

        uint256 penalty = 0;
        if (block.timestamp < dueDate) {
            penalty = tokenAmount * price * earlyWithdrawPenalty / (100 * 10**18);
        }
        
        uint256 profit = 0;
        if (price > initialPrice) {
            profit = (price - initialPrice) * tokenAmount;
        }
        uint256 platformProfit = profit * profitPct / (100 * 10**18);
        uint256 amountUSD = tokenAmount * price - penalty - platformProfit;
        uint256 ethAmount =  amountUSD * 10**18 / ethExchangeValue();
        require (address(this).balance >= ethAmount, "There's not enough funds in the contract to pay the beneficiary");
        require(ethAmount > 0, "There's nothing left for you my friend, better luck next time");
        _burn(seller, tokenAmount);
        payable(seller).transfer(ethAmount);
    }

    function sell(uint256 tokenAmount) public {
        _sell(payable(msg.sender), tokenAmount);
    }

    function investmentExecution() public payable onlyOwner {
        uint256 netPaymentETH = totalSupply() * price * 10**18 / ethExchangeValue();
        uint256 totalPaymentETH = (100 * 10**18 - profitPct) * netPaymentETH / (100 * 10**18);
        require(block.timestamp > dueDate, 
            "You need to wait until the due date to excecute this function");
        require(address(this).balance >= totalPaymentETH,
            "Not enough funds to execute investment returns");
        
        for (uint32 i = 0; i != beneficiaries.length; i++) {
            address payable beneficiary = payable(beneficiaries[i]);
            if (balanceOf(beneficiary) == 0) {
                continue;
            }
            _sell(beneficiary, balanceOf(beneficiary));
        }
    }

    function _update(address from, address to, uint256 value) internal virtual override {
        bool toExisted = balanceOf(to) > 0;
        super._update(from, to, value);
        bool toExists = balanceOf(to) > 0;
        if (!toExisted && toExists) {
            beneficiaries.push(to);
        }
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient funds");
        payable(owner()).transfer(amount);
    }

    function getMetadata() public view returns(string memory) {
        return string.concat('{\n'
            '"price": ', Strings.toString(getPrice()), ',\n',
            '"dueDate": ', Strings.toString(getDueDate()), ',\n',
            '"earlyWithdrawPenalty": ', Strings.toString(getEarlyWithdrawPenalty()), ',\n',
            '"minOwnedTokens": ', Strings.toString(getMinOwnedTokens()), ',\n',
            '"availableTokens": ', Strings.toString(getAvailableTokens()), ',\n',
            '"nftContractAddress": "', Strings.toHexString(getNftContractAddress()), '",\n',
            '"imgUrl": "', getImgUrl(), '"\n',
        "}");
    }
}