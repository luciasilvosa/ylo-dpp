import { PINATA_JWT } from "./config";

export async function subirJSONaPinata(
  json: object,
  nombre: string
): Promise<string> {
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
  return data.IpfsHash as string;
}