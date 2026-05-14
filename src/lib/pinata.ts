import { PINATA_JWT } from "./config";

export interface ResultadoSubida {
  cid: string;
  size: number;
}

/**
 * Sube un objeto JSON a IPFS a través del servicio de pinning de Pinata.
 *
 * Nota PoC: la verificación de integridad se basa en el hash SHA-256
 * calculado en cliente sobre la canonicalización RFC 8785 del JSON, no en
 * el CID. El CID actúa únicamente como puntero al contenido en IPFS.
 */
export async function subirJSONaPinata(
  json: object,
  nombre: string
): Promise<ResultadoSubida> {
  if (!PINATA_JWT) {
    throw new Error(
      "Falta la variable VITE_PINATA_JWT en el archivo .env."
    );
  }

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pinataMetadata: { name: nombre },
        pinataContent: json,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error subiendo a Pinata: ${errorText}`);
  }

  const data = await response.json();
  return {
    cid: data.IpfsHash as string,
    size: data.PinSize as number,
  };
}