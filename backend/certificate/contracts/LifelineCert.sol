// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LifelineCert is ERC721URIStorage, Ownable {

    // ── STATE ───────────────────────────────────────────────
    uint256 private _tokenIds;

    struct DonationRecord {
        string donorName;
        string bloodType;
        string hospital;
        string city;
        string doctorName;
        uint256 donationDate;
        uint256 units;
        bool verified;
    }

    mapping(uint256 => DonationRecord) public donationRecords;
    mapping(address => uint256[]) public donorTokens;

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed donor,
        string bloodType,
        string hospital,
        uint256 donationDate
    );

    constructor() ERC721("LifelineDonorCert", "LLDC") {}

    // ── SELF MINT (for your app)
    function selfMintCertificate(
        string memory _donorName,
        string memory _bloodType,
        string memory _hospital,
        string memory _city,
        string memory _doctorName,
        uint256 _donationDate,
        uint256 _units,
        string memory _tokenURI
    ) external returns (uint256) {

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        donationRecords[newTokenId] = DonationRecord({
            donorName: _donorName,
            bloodType: _bloodType,
            hospital: _hospital,
            city: _city,
            doctorName: _doctorName,
            donationDate: _donationDate,
            units: _units,
            verified: false
        });

        donorTokens[msg.sender].push(newTokenId);

        emit CertificateMinted(
            newTokenId,
            msg.sender,
            _bloodType,
            _hospital,
            _donationDate
        );

        return newTokenId;
    }

    // ── VIEW FUNCTIONS
    function getDonorTokens(address _donor) external view returns (uint256[] memory) {
        return donorTokens[_donor];
    }

    function getDonationRecord(uint256 _tokenId) external view returns (DonationRecord memory) {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        return donationRecords[_tokenId];
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIds;
    }
}