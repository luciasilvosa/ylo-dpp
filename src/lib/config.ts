// Configuración del frontend.
// Las variables relativas al contrato y a la red blockchain se han retirado:
// la PoC documenta la capa on-chain como diseño pero no la ejercita.

export const PINATA_JWT = import.meta.env.VITE_PINATA_JWT as string;
export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";