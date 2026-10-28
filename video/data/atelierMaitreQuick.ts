import {defineProductDemoSpec} from "../contracts/productDemo";
import {atelierMaitreGeneralDemo} from "./atelierMaitre";

function scene(id: string, durationSeconds: number) {
  const source = atelierMaitreGeneralDemo.scenes.find((item) => item.id === id);
  if (!source) throw new Error(`missing Atelier Maître source scene: ${id}`);
  return {...source, durationSeconds};
}

export const atelierMaitreQuickDemo = defineProductDemoSpec({
  ...atelierMaitreGeneralDemo,
  id: "atelier-maitre-quick-sales-demo-fr",
  audience: {
    label: "Démo express · Atelier Maître",
    goal: "Comprendre le parcours atelier en un peu plus d'une minute"
  },
  scenes: [
    scene("intro", 8),
    scene("dashboard", 10),
    scene("workshop", 14),
    scene("planning", 12),
    scene("billing", 12),
    scene("outro", 11)
  ],
  cta: {
    label: "Voir Atelier Maître sur votre propre atelier",
    supportingText:
      "Démo express basée sur de vraies vues du produit et sur le workflow Atelier Maître."
  },
  legal: {
    footer: "Atelier Maître — démonstration commerciale Trigenys."
  }
});
