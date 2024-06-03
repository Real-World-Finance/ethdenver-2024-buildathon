// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact contacto@netlabs.com.uy
contract NFTPoI is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    string private _imageURL;

    constructor(
        string memory name,
        string memory symbol,
        string memory imageURL, //with ? or ?param= at the end since the tokenId will be appended
        address initialOwner
    )
        ERC721(name, symbol)
        Ownable(initialOwner)
    {
        _imageURL = imageURL;
    }

    function _baseURI() internal view override returns (string memory) {
        return _imageURL;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
