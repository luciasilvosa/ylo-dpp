export interface Material {
    fiber: string;
    percentage: number;
    origin: string;
  }
  
  export interface Facility {
    facilityId: string;
    name: string;
    country: string;
    city: string;
  }
  
  export interface Production {
    productionDate: string;
    volume: number;
    productionMethod: string;
    facility: Facility;
  }
  
  export interface Supplier {
    role: string;
    name: string;
    country: string;
    city: string;
    certifications: string[];
  }
  
  export interface CarbonFootprint {
    value: number;
    unit: string;
    methodology: string;
    scope: string;
    certified: boolean;
  }
  
  export interface Certification {
    name: string;
    issuer: string;
    validUntil: string;
    certified: boolean;
  }
  
  export interface CareInstructions {
    washing: string;
    drying: string;
    ironing: string;
    repairTips: string;
  }
  
  export interface EndOfLife {
    recyclable: boolean;
    recyclingInstructions: string;
    disassembly: string;
  }
  
  export interface DPP {
    modelId: string;
    batchId: string;
    productName: string;
    category: string;
    materials: Material[];
    production: Production;
    suppliers: Supplier[];
    carbonFootprint: CarbonFootprint;
    certifications: Certification[];
    careInstructions: CareInstructions;
    endOfLife: EndOfLife;
    schema: string;
    version: number;
    language: string;
  }
  
  export const lotes: DPP[] = [
    {
      modelId: "YLO-TOP-001",
      batchId: "YLO-TOP-001-L-2025-04-PT",
      productName: "Top Aurora",
      category: "Sportswear / Activewear",
      materials: [
        { fiber: "Algodón orgánico", percentage: 95, origin: "Turquía" },
        { fiber: "Elastano", percentage: 5, origin: "Alemania" }
      ],
      production: {
        productionDate: "2025-04-15",
        volume: 1200,
        productionMethod: "Tejido circular",
        facility: {
          facilityId: "FAC-PT-COIMBRA-01",
          name: "Têxtil Coimbra",
          country: "Portugal",
          city: "Coimbra"
        }
      },
      suppliers: [
        { role: "Fibra", name: "Anatolia Organic Cotton Cooperative", country: "Turquía", city: "Esmirna", certifications: ["GOTS"] },
        { role: "Hilatura", name: "Fiação do Ave", country: "Portugal", city: "Vila Nova de Famalicão", certifications: ["GOTS", "OEKO-TEX Standard 100"] },
        { role: "Tejeduría", name: "Malhas Ribeiro", country: "Portugal", city: "Vila Nova de Famalicão", certifications: ["GOTS"] },
        { role: "Tintura y acabado", name: "Tinturaria Vale do Ave", country: "Portugal", city: "Guimarães", certifications: ["GOTS", "ZDHC"] },
        { role: "Confección", name: "Têxtil Coimbra", country: "Portugal", city: "Coimbra", certifications: ["GOTS", "SA8000"] }
      ],
      carbonFootprint: {
        value: 4.2,
        unit: "kgCO2e per unit",
        methodology: "PEF v3.1",
        scope: "cradle-to-gate",
        certified: false
      },
      certifications: [
        { name: "GOTS", issuer: "Global Organic Textile Standard", validUntil: "2026-04-14", certified: true }
      ],
      careInstructions: {
        washing: "Lavado a máquina máximo 30 °C, ciclo suave",
        drying: "Secado al aire, evitar secadora",
        ironing: "Plancha a baja temperatura por el revés",
        repairTips: "Pequeñas roturas pueden coserse a mano con hilo de algodón"
      },
      endOfLife: {
        recyclable: true,
        recyclingInstructions: "Depositar en contenedor textil municipal o punto de recogida YLÖ",
        disassembly: "El elastano dificulta el reciclaje mecánico, se recomienda reciclaje químico"
      },
      schema: "https://ylo.com/dpp/schema/v1.json",
      version: 1,
      language: "es"
    },
    {
      modelId: "YLO-TOP-001",
      batchId: "YLO-TOP-001-L-2025-09-MA",
      productName: "Top Aurora",
      category: "Sportswear / Activewear",
      materials: [
        { fiber: "Algodón orgánico", percentage: 95, origin: "Turquía" },
        { fiber: "Elastano", percentage: 5, origin: "Alemania" }
      ],
      production: {
        productionDate: "2025-09-22",
        volume: 1500,
        productionMethod: "Tejido circular",
        facility: {
          facilityId: "FAC-MA-CASA-01",
          name: "Atlas Confección",
          country: "Marruecos",
          city: "Casablanca"
        }
      },
      suppliers: [
        { role: "Fibra", name: "Anatolia Organic Cotton Cooperative", country: "Turquía", city: "Esmirna", certifications: ["GOTS"] },
        { role: "Hilatura", name: "Hilados Mediterráneos", country: "España", city: "Alcoy", certifications: ["GOTS"] },
        { role: "Tejeduría", name: "Hilados Mediterráneos", country: "España", city: "Alcoy", certifications: ["GOTS"] },
        { role: "Tintura y acabado", name: "Tannerie et Teinturerie du Maroc", country: "Marruecos", city: "Casablanca", certifications: ["GOTS"] },
        { role: "Confección", name: "Atlas Confección", country: "Marruecos", city: "Casablanca", certifications: ["GOTS", "SA8000"] }
      ],
      carbonFootprint: {
        value: 5.8,
        unit: "kgCO2e per unit",
        methodology: "PEF v3.1",
        scope: "cradle-to-gate",
        certified: false
      },
      certifications: [
        { name: "GOTS", issuer: "Global Organic Textile Standard", validUntil: "2026-09-21", certified: true }
      ],
      careInstructions: {
        washing: "Lavado a máquina máximo 30 °C, ciclo suave",
        drying: "Secado al aire, evitar secadora",
        ironing: "Plancha a baja temperatura por el revés",
        repairTips: "Pequeñas roturas pueden coserse a mano con hilo de algodón"
      },
      endOfLife: {
        recyclable: true,
        recyclingInstructions: "Depositar en contenedor textil municipal o punto de recogida YLÖ",
        disassembly: "El elastano dificulta el reciclaje mecánico, se recomienda reciclaje químico"
      },
      schema: "https://ylo.com/dpp/schema/v1.json",
      version: 1,
      language: "es"
    },
    {
      modelId: "YLO-SHO-001",
      batchId: "YLO-SHO-001-L-2025-06-VN",
      productName: "Short Vento",
      category: "Sportswear / Running",
      materials: [
        { fiber: "Poliéster reciclado", percentage: 100, origin: "Taiwán" }
      ],
      production: {
        productionDate: "2025-06-08",
        volume: 2000,
        productionMethod: "Tejido por urdimbre",
        facility: {
          facilityId: "FAC-VN-HCM-01",
          name: "Saigon Activewear",
          country: "Vietnam",
          city: "Ho Chi Minh"
        }
      },
      suppliers: [
        { role: "Fibra", name: "Far Eastern New Century", country: "Taiwán", city: "Taipéi", certifications: ["GRS", "OEKO-TEX Standard 100"] },
        { role: "Hilatura", name: "Saigon Activewear", country: "Vietnam", city: "Ho Chi Minh", certifications: ["GRS"] },
        { role: "Tejeduría", name: "Saigon Activewear", country: "Vietnam", city: "Ho Chi Minh", certifications: ["GRS"] },
        { role: "Tintura y acabado", name: "Saigon Activewear", country: "Vietnam", city: "Ho Chi Minh", certifications: ["GRS", "ZDHC"] },
        { role: "Confección", name: "Saigon Activewear", country: "Vietnam", city: "Ho Chi Minh", certifications: ["GRS", "SA8000"] }
      ],
      carbonFootprint: {
        value: 7.1,
        unit: "kgCO2e per unit",
        methodology: "PEF v3.1",
        scope: "cradle-to-gate",
        certified: false
      },
      certifications: [
        { name: "GRS", issuer: "Textile Exchange", validUntil: "2026-06-07", certified: true }
      ],
      careInstructions: {
        washing: "Lavado a máquina máximo 30 °C, ciclo suave, sin suavizante",
        drying: "Secado al aire, evitar secadora",
        ironing: "No planchar",
        repairTips: "Costuras reparables con hilo de poliéster a máquina"
      },
      endOfLife: {
        recyclable: true,
        recyclingInstructions: "Depositar en contenedor textil municipal o punto de recogida YLÖ. El poliéster reciclado puede reincorporarse al circuito mediante reciclaje mecánico",
        disassembly: "Material monofibra, no requiere separación previa"
      },
      schema: "https://ylo.com/dpp/schema/v1.json",
      version: 1,
      language: "es"
    }
  ];