import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { lotes } from "../data/lotes";

type Tab = "producto" | "materiales" | "blockchain";

function PaginaDPP() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const index = Number(tokenId);
  const lote = lotes[index];
  const [tab, setTab] = useState<Tab>("producto");

  if (!lote) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Pasaporte no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="text-sm text-stone-500 hover:text-stone-900">
            ← Volver al catálogo
          </Link>
          <span className="text-xs uppercase tracking-wide text-stone-400">
            DPP verificado en blockchain
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-wide text-stone-500">
          {lote.category}
        </p>
        <h1 className="text-4xl font-bold text-stone-900 mt-2">
          {lote.productName}
        </h1>
        <p className="text-stone-600 mt-2">Lote {lote.batchId}</p>

        <div className="mt-10 border-b border-stone-200 flex gap-8">
          <BotonTab activo={tab === "producto"} onClick={() => setTab("producto")}>
            Producto
          </BotonTab>
          <BotonTab activo={tab === "materiales"} onClick={() => setTab("materiales")}>
            Materiales y cadena
          </BotonTab>
          <BotonTab activo={tab === "blockchain"} onClick={() => setTab("blockchain")}>
            Blockchain
          </BotonTab>
        </div>

        <div className="mt-8">
          {tab === "producto" && <PanelProducto lote={lote} />}
          {tab === "materiales" && <PanelMateriales lote={lote} />}
          {tab === "blockchain" && <PanelBlockchain lote={lote} index={index} />}
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="text-xs text-stone-500">
            YLÖ · Moda Activa Sostenible S.L. · Trabajo Fin de Grado UIE 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

function BotonTab({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
        activo
          ? "border-stone-900 text-stone-900"
          : "border-transparent text-stone-500 hover:text-stone-900"
      }`}
    >
      {children}
    </button>
  );
}

function PanelProducto({ lote }: { lote: typeof lotes[0] }) {
  return (
    <div className="space-y-8">
      <Bloque titulo="Producción">
        <Fila etiqueta="Fecha de fabricación" valor={lote.production.productionDate} />
        <Fila etiqueta="Volumen" valor={`${lote.production.volume} unidades`} />
        <Fila etiqueta="Método" valor={lote.production.productionMethod} />
        <Fila
          etiqueta="Centro de producción"
          valor={`${lote.production.facility.name} (${lote.production.facility.city}, ${lote.production.facility.country})`}
        />
      </Bloque>

      <Bloque titulo="Huella de carbono">
        <Fila
          etiqueta="Valor"
          valor={`${lote.carbonFootprint.value} ${lote.carbonFootprint.unit}`}
        />
        <Fila etiqueta="Metodología" valor={lote.carbonFootprint.methodology} />
        <Fila etiqueta="Alcance" valor={lote.carbonFootprint.scope} />
        <Fila
          etiqueta="Verificación externa"
          valor={lote.carbonFootprint.certified ? "Sí" : "No (autodeclaración)"}
        />
      </Bloque>

      <Bloque titulo="Cuidado">
        <Fila etiqueta="Lavado" valor={lote.careInstructions.washing} />
        <Fila etiqueta="Secado" valor={lote.careInstructions.drying} />
        <Fila etiqueta="Planchado" valor={lote.careInstructions.ironing} />
        <Fila etiqueta="Reparación" valor={lote.careInstructions.repairTips} />
      </Bloque>

      <Bloque titulo="Fin de vida">
        <Fila
          etiqueta="Reciclable"
          valor={lote.endOfLife.recyclable ? "Sí" : "No"}
        />
        <Fila etiqueta="Instrucciones" valor={lote.endOfLife.recyclingInstructions} />
        <Fila etiqueta="Desensamblaje" valor={lote.endOfLife.disassembly} />
      </Bloque>
    </div>
  );
}

function PanelMateriales({ lote }: { lote: typeof lotes[0] }) {
  return (
    <div className="space-y-8">
      <Bloque titulo="Composición">
        {lote.materials.map((m, i) => (
          <Fila
            key={i}
            etiqueta={m.fiber}
            valor={`${m.percentage}% · Origen: ${m.origin}`}
          />
        ))}
      </Bloque>

      <Bloque titulo="Cadena de suministro">
        <div className="space-y-4">
          {lote.suppliers.map((s, i) => (
            <div
              key={i}
              className="border-l-2 border-stone-200 pl-4 py-1"
            >
              <p className="text-xs uppercase tracking-wide text-stone-500">
                {s.role}
              </p>
              <p className="text-stone-900 mt-1">{s.name}</p>
              <p className="text-sm text-stone-600">
                {s.city}, {s.country}
              </p>
              {s.certifications.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.certifications.map((c) => (
                    <span
                      key={c}
                      className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Bloque>

      <Bloque titulo="Certificaciones del lote">
        {lote.certifications.map((c, i) => (
          <Fila
            key={i}
            etiqueta={`${c.name} (${c.issuer})`}
            valor={`Válida hasta ${c.validUntil} · ${
              c.certified ? "Verificada externamente" : "Autodeclaración"
            }`}
          />
        ))}
      </Bloque>
    </div>
  );
}

function PanelBlockchain({
  lote,
  index,
}: {
  lote: typeof lotes[0];
  index: number;
}) {
  return (
    <div className="space-y-8">
      <Bloque titulo="Identidad criptográfica del pasaporte">
        <Fila etiqueta="Token ID" valor={String(index)} />
        <Fila etiqueta="Estándar" valor="ERC-721 + EIP-5192 (Soulbound)" />
        <Fila etiqueta="Red" valor="Polygon Amoy (testnet)" />
        <Fila etiqueta="Versión del DPP" valor={String(lote.version)} />
      </Bloque>

      <Bloque titulo="Almacenamiento off-chain">
        <Fila
          etiqueta="Protocolo"
          valor="IPFS (InterPlanetary File System)"
        />
        <Fila
          etiqueta="CID del JSON"
          valor="[se rellenará tras el despliegue]"
        />
      </Bloque>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <p className="text-sm text-amber-900 font-medium">
          Verificación pública independiente
        </p>
        <p className="text-sm text-amber-800 mt-2">
          Cualquier tercero puede verificar la integridad de este pasaporte
          consultando directamente la blockchain. Una vez desplegado el contrato
          en Polygon Amoy, el QR de auditor llevará al token en Polygonscan.
        </p>
      </div>
    </div>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-stone-200 rounded-lg p-6">
      <h3 className="text-sm uppercase tracking-wide text-stone-500 mb-4">
        {titulo}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="text-stone-600">{etiqueta}</span>
      <span className="text-stone-900 text-right">{valor}</span>
    </div>
  );
}

export default PaginaDPP;