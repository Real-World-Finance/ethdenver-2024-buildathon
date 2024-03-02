// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTPoI is ERC721, ERC721Burnable, Ownable, IERC721Enumerable {
    uint256 private _nextTokenId;
    mapping(address => uint256[]) private _ownedTokens;

    constructor(address initialOwner)
        ERC721("NFT-PoI", "POI")
        Ownable(initialOwner)
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://https://ipfs.io/ipfs/QmPNxZ7nY1vAuqyGm639FExegAqKj4qLoihNwnQqZGpKoG/";
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _ownedTokens[to].push(tokenId);
    }

    function getNFTs(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view override returns (uint256) {
        require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    function totalSupply() public view override returns (uint256) {
        return _nextTokenId;
    }

    function tokenByIndex(uint256 index) public view override returns (uint256) {
        require(index < totalSupply(), "ERC721Enumerable: global index out of bounds");
        return index;
    }
}