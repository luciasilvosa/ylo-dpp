import { useState } from "react";
import { conectarWallet, getContrato } from "../lib/wallet";
import { CONTRACT_ADDRESS } from "../lib/config";
import { calcularHashSHA256 } from "../lib/dpp";
import { subirJSONaPinata } from "../lib/pinata";
import { crearPlantillaDPP } from "../lib/plantillaDPP";
import type { JsonRpcSigner } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Resultado {
  tokenId: string;
  txHash: string;
  cid: string;
  dataHash: string;
}

function Admin() {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [esOwner, setEsOwner] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modelId, setModelId] = useState("YLO-TOP-001");
  const [batchId, setBatchId] = useState("YLO-TOP-001-L-2025-04-PT");
  const [productName, setProductName] = useState("Top Aurora");
  const [productionCountry, setProductionCountry] = useState("Portugal");
  const [productionCity, setProductionCity] = useState("Coimbra");
  const [productionDate, setProductionDate] = useState("2025-04-15");
  const [carbonValue, setCarbonValue] = useState(4.2);

  const [publicando, setPublicando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  async function handleConectar() {
    setError(null);
    setCargando(true);
    try {
      const conn = await conectarWallet();
      setAddress(conn.address);
      setSigner(conn.signer);

      if (
        CONTRACT_ADDRESS &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ) {
        const contrato = getContrato(conn.signer);
        const owner: string = await contrato.owner();
        setEsOwner(owner.toLowerCase() === conn.address.toLowerCase());
      } else {
        setEsOwner(true);
      }
    } catch (e: any) {
      setError(e.message || "Error al conectar");
    } finally {
      setCargando(false);
    }
  }

  async function handlePublicar() {
    if (!signer) return;
    setError(null);
    setResultado(null);
    setPublicando(true);

    try {
      const dpp = crearPlantillaDPP({
        modelId,
        batchId,
        productName,
        productionCountry,
        productionCity,
        productionDate,
        carbonValue,
      });

      const dataHash = await calcularHashSHA256(dpp);
      const cid = await subirJSONaPinata(dpp, batchId);
      const metadataURI = "ipfs://" + cid;

      if (
        !CONTRACT_ADDRESS ||
        CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000"
      ) {
        setResultado({
          tokenId: "(simulado: contrato no desplegado)",
          txHash: "(simulado)",
          cid: cid,
          dataHash: dataHash,
        });
        return;
      }

      const contrato = getContrato(signer);
      const tx = await contrato.issueDPP(batchId, metadataURI, dataHash);
      const receipt = await tx.wait();

      let tokenId = "?";
      for (const log of receipt.logs) {
        try {
          const parsed = contrato.interface.parseLog(log);
          if (parsed && parsed.name === "DPPIssued") {
            tokenId = parsed.args[0].toString();
            break;
          }
        } catch {
          // log no es de este contrato
        }
      }

      setResultado({
        tokenId: tokenId,
        txHash: receipt.hash,
        cid: cid,
        dataHash: dataHash,
      });
    } catch (e: any) {
      setError(e.message || "Error al publicar");
    } finally {
      setPublicando(false);
    }
  }

  return (
    <div className="min-h-screen bg-ylo-bg flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-ylo-ink">Gestión de DPPs</h1>
        <p className="text-ylo-ink-soft mt-2">
          Conecta la wallet del operador económico para emitir y actualizar pasaportes digitales.
        </p>

        <div className="mt-10">
          {!address && (
            <button
              onClick={handleConectar}
              disabled={cargando}
              className="bg-ylo-ink text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-ylo-ink-soft transition-colors disabled:opacity-50"
            >
              {cargando ? "Conectando..." : "Conectar Metamask"}
            </button>
          )}

          {address && (
            <PanelOperador
              address={address}
              esOwner={esOwner}
              modelId={modelId}
              setModelId={setModelId}
              batchId={batchId}
              setBatchId={setBatchId}
              productName={productName}
              setProductName={setProductName}
              productionCountry={productionCountry}
              setProductionCountry={setProductionCountry}
              productionCity={productionCity}
              setProductionCity={setProductionCity}
              productionDate={productionDate}
              setProductionDate={setProductionDate}
              carbonValue={carbonValue}
              setCarbonValue={setCarbonValue}
              publicando={publicando}
              handlePublicar={handlePublicar}
              resultado={resultado}
            />
          )}

          {error && (
            <div className="mt-4 bg-ylo-poppy/10 border border-ylo-poppy rounded-lg p-4">
              <p className="text-sm text-ylo-ink">{error}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface PanelProps {
  address: string;
  esOwner: boolean;
  modelId: string;
  setModelId: (v: string) => void;
  batchId: string;
  setBatchId: (v: string) => void;
  productName: string;
  setProductName: (v: string) => void;
  productionCountry: string;
  setProductionCountry: (v: string) => void;
  productionCity: string;
  setProductionCity: (v: string) => void;
  productionDate: string;
  setProductionDate: (v: string) => void;
  carbonValue: number;
  setCarbonValue: (v: number) => void;
  publicando: boolean;
  handlePublicar: () => void;
  resultado: Resultado | null;
}

function PanelOperador(props: PanelProps) {
  return (
    <div>
      <div className="bg-ylo-surface border border-ylo-border rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wide text-ylo-ink-soft">Wallet conectada</p>
            <p className="text-ylo-ink mt-1 font-mono text-sm break-all">{props.address}</p>
          </div>
          <span
            className={
              "text-xs px-3 py-1 rounded-full whitespace-nowrap ml-4 " +
              (props.esOwner
                ? "bg-ylo-pool/20 text-ylo-pool-dark border border-ylo-pool"
                : "bg-ylo-bg text-ylo-ink-soft border border-ylo-border")
            }
          >
            {props.esOwner ? "Operador autorizado" : "No autorizado"}
          </span>
        </div>
      </div>

      {props.esOwner && (
        <section className="bg-ylo-surface border border-ylo-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-ylo-ink">Emitir nuevo DPP</h2>
          <p className="text-sm text-ylo-ink-soft mt-1 mb-6">
            Rellena los datos clave del lote. El resto del esquema usa valores por defecto de la plantilla.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Model ID" value={props.modelId} onChange={props.setModelId} />
            <Campo label="Batch ID" value={props.batchId} onChange={props.setBatchId} />
            <Campo label="Nombre del producto" value={props.productName} onChange={props.setProductName} />
            <Campo label="País de producción" value={props.productionCountry} onChange={props.setProductionCountry} />
            <Campo label="Ciudad de producción" value={props.productionCity} onChange={props.setProductionCity} />
            <Campo label="Fecha de producción" value={props.productionDate} onChange={props.setProductionDate} />
            <Campo
              label="Huella de carbono"
              value={String(props.carbonValue)}
              onChange={(v) => props.setCarbonValue(Number(v))}
            />
          </div>

          <button
            onClick={props.handlePublicar}
            disabled={props.publicando}
            className="mt-6 bg-ylo-ink text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-ylo-ink-soft transition-colors disabled:opacity-50"
          >
            {props.publicando ? "Publicando..." : "Publicar DPP"}
          </button>
        </section>
      )}

      {props.resultado && <PanelResultado resultado={props.resultado} />}
    </div>
  );
}

function PanelResultado({ resultado }: { resultado: Resultado }) {
  // URL del consumidor: si el tokenId es un número, va a /dpp/{n}
  // Si es simulado, mostramos placeholder
  const tokenIdNumerico = !isNaN(Number(resultado.tokenId)) ? resultado.tokenId : null;

  // Detecta el dominio actual para construir la URL del consumidor.
  // En localhost será http://localhost:XXXX/dpp/N, en producción será https://nom-dpp.vercel.app/dpp/N
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const urlConsumidor = tokenIdNumerico
    ? baseUrl + "/dpp/" + tokenIdNumerico
    : null;

  // URL del auditor: enlace a Polygonscan al token
  const urlAuditor =
    tokenIdNumerico && CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ? "https://amoy.polygonscan.com/token/" + CONTRACT_ADDRESS + "?a=" + tokenIdNumerico
      : null;

  return (
    <section className="mt-8 bg-ylo-pool/10 border border-ylo-pool rounded-lg p-6">
      <h3 className="text-lg font-semibold text-ylo-ink">DPP publicado correctamente</h3>
      <div className="mt-4 space-y-2 text-sm">
        <Fila label="Token ID" valor={resultado.tokenId} />
        <Fila label="Hash de transacción" valor={resultado.txHash} />
        <Fila label="CID en IPFS" valor={resultado.cid} />
        <Fila label="Data hash (SHA-256)" valor={resultado.dataHash} />
      </div>

      {/* DOBLE QR para coser a la prenda */}
      {urlConsumidor && (
        <div className="mt-8 pt-6 border-t border-ylo-pool">
          <p className="text-xs uppercase tracking-wide text-ylo-ink-soft mb-1">
            Códigos QR para etiquetar la prenda
          </p>
          <p className="text-sm text-ylo-ink-soft mb-6">
            Imprime y cose ambos códigos en la etiqueta interior del producto. El primero lleva al consumidor; el segundo permite la verificación pública independiente del DPP.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BloqueQR
              titulo="QR del consumidor"
              descripcion="Lleva a la página pública del DPP."
              url={urlConsumidor}
              nombreArchivo={"qr-consumidor-" + resultado.tokenId}
            />

            {urlAuditor ? (
              <BloqueQR
                titulo="QR del auditor"
                descripcion="Lleva al token en Polygonscan para verificación independiente."
                url={urlAuditor}
                nombreArchivo={"qr-auditor-" + resultado.tokenId}
              />
            ) : (
              <div className="bg-ylo-surface border border-ylo-border rounded-lg p-5 flex items-center justify-center text-center">
                <p className="text-xs text-ylo-ink-soft">
                  El QR del auditor se generará tras el despliegue del contrato en Polygon Amoy.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!urlConsumidor && (
        <p className="mt-4 text-xs text-ylo-ink-soft">
          Verifica el JSON en IPFS pegando el CID en https://gateway.pinata.cloud/ipfs/
        </p>
      )}
    </section>
  );
}

function BloqueQR({
  titulo,
  descripcion,
  url,
  nombreArchivo,
}: {
  titulo: string;
  descripcion: string;
  url: string;
  nombreArchivo: string;
}) {
  function descargarSVG() {
    const svg = document.getElementById("qr-" + nombreArchivo);
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo + ".svg";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="bg-ylo-surface border border-ylo-border rounded-lg p-5 flex flex-col items-center text-center">
      <p className="text-xs uppercase tracking-wide text-ylo-ink-soft">{titulo}</p>
      <p className="text-xs text-ylo-ink-soft mt-1 mb-4">{descripcion}</p>

      <div className="bg-white p-3 rounded-lg border border-ylo-border">
        <QRCodeSVG
          id={"qr-" + nombreArchivo}
          value={url}
          size={160}
          level="M"
          includeMargin={false}
        />
      </div>

      <p className="mt-3 font-mono text-[10px] text-ylo-ink-soft break-all max-w-full">
        {url}
      </p>

      <button
        onClick={descargarSVG}
        className="mt-3 text-xs font-medium text-ylo-ink hover:underline"
      >
        Descargar SVG
      </button>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-ylo-ink-soft">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-ylo-bg border border-ylo-border rounded-md px-3 py-2 text-sm text-ylo-ink focus:outline-none focus:ring-2 focus:ring-ylo-ink"
      />
    </label>
  );
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ylo-ink-soft">{label}</span>
      <span className="text-ylo-ink font-mono text-xs break-all text-right">{valor}</span>
    </div>
  );
}

export default Admin;