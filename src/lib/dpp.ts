import canonicalize from "canonicalize";

export async function calcularHashSHA256(json: object): Promise<string> {
  const canonical = canonicalize(json);
  if (!canonical) throw new Error("No se pudo canonicalizar el JSON");

  const encoder = new TextEncoder();
  const data = encoder.encode(canonical);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return "0x" + hashHex;
}

export function canonicalizarJSON(json: object): string {
  const canonical = canonicalize(json);
  if (!canonical) throw new Error("No se pudo canonicalizar el JSON");
  return canonical;
}