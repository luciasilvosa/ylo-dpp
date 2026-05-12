import type { DPP } from "../data/lotes";

export function crearPlantillaDPP(input: {
  modelId: string;
  batchId: string;
  productName: string;
  productionCountry: string;
  productionCity: string;
  productionDate: string;
  carbonValue: number;
}): DPP {
  return {
    modelId: input.modelId,
    batchId: input.batchId,
    productName: input.productName,
    category: "Sportswear / Activewear",
    materials: [
      { fiber: "Algodón orgánico", percentage: 95, origin: "Turquía" },
      { fiber: "Elastano", percentage: 5, origin: "Alemania" },
    ],
    production: {
      productionDate: input.productionDate,
      volume: 1000,
      productionMethod: "Tejido circular",
      facility: {
        facilityId: `FAC-${input.productionCountry.slice(0, 2).toUpperCase()}-01`,
        name: `Centro ${input.productionCity}`,
        country: input.productionCountry,
        city: input.productionCity,
      },
    },
    suppliers: [
      {
        role: "Fibra",
        name: "Anatolia Organic Cotton Cooperative",
        country: "Turquía",
        city: "Esmirna",
        certifications: ["GOTS"],
      },
      {
        role: "Confección",
        name: `Centro ${input.productionCity}`,
        country: input.productionCountry,
        city: input.productionCity,
        certifications: ["GOTS", "SA8000"],
      },
    ],
    carbonFootprint: {
      value: input.carbonValue,
      unit: "kgCO2e per unit",
      methodology: "PEF v3.1",
      scope: "cradle-to-gate",
      certified: false,
    },
    certifications: [
      {
        name: "GOTS",
        issuer: "Global Organic Textile Standard",
        validUntil: "2026-12-31",
        certified: true,
      },
    ],
    careInstructions: {
      washing: "Lavado a máquina máximo 30 °C, ciclo suave",
      drying: "Secado al aire, evitar secadora",
      ironing: "Plancha a baja temperatura por el revés",
      repairTips: "Pequeñas roturas pueden coserse a mano",
    },
    endOfLife: {
      recyclable: true,
      recyclingInstructions:
        "Depositar en contenedor textil municipal o punto de recogida YLÖ",
      disassembly: "Material principalmente algodón, reciclable",
    },
    schema: "https://ylo.com/dpp/schema/v1.json",
    version: 1,
    language: "es",
  };
}