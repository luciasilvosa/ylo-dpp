// ABI mínimo de DPPRegistry: solo las funciones que necesita el frontend.
export const DPP_REGISTRY_ABI = [
    "function issueDPP(string batchId_, string metadataURI_, bytes32 dataHash_) external returns (uint256)",
    "function updateDPP(uint256 tokenId, string newMetadataURI_, bytes32 newDataHash_) external",
    "function getCurrentDPP(uint256 tokenId) external view returns (tuple(string batchId, string metadataURI, bytes32 dataHash, uint256 version, uint256 timestamp))",
    "function getDPPHistory(uint256 tokenId) external view returns (tuple(string batchId, string metadataURI, bytes32 dataHash, uint256 version, uint256 timestamp)[])",
    "function locked(uint256) external pure returns (bool)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function owner() external view returns (address)",
    "event DPPIssued(uint256 indexed tokenId, string batchId, string metadataURI, bytes32 dataHash, address indexed issuer)",
    "event DPPUpdated(uint256 indexed tokenId, uint256 newVersion, string newMetadataURI, bytes32 newDataHash, address indexed issuer)"
  ];