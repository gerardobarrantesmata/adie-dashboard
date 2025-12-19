export function instantiateToothSvg(svgText: string, toothNumber: number) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const svg = doc.documentElement;

  // Map de ids viejos -> ids nuevos
  const idMap = new Map<string, string>();

  // 1) Renombrar IDs: tooth_<cualquierNumero|template>_<suffix> => tooth_<toothNumber>_<suffix>
  const nodesWithId = Array.from(doc.querySelectorAll<SVGElement>("[id]"));
  for (const node of nodesWithId) {
    const oldId = node.getAttribute("id");
    if (!oldId) continue;

    const m = oldId.match(/^tooth_(\d+|template)_(.+)$/);
    if (!m) continue;

    const suffix = m[2];
    const newId = `tooth_${toothNumber}_${suffix}`;

    if (newId !== oldId) {
      idMap.set(oldId, newId);
      node.setAttribute("id", newId);
    }
  }

  // helper: reemplaza referencias tipo #id y url(#id) dentro de atributos
  const rewriteValue = (value: string) => {
    let out = value;
    for (const [oldId, newId] of idMap.entries()) {
      out = out.replaceAll(`#${oldId}`, `#${newId}`);
      out = out.replaceAll(`url(#${oldId})`, `url(#${newId})`);
    }
    return out;
  };

  // 2) Actualizar atributos que suelen referenciar IDs (clipPath, mask, href, style, etc.)
  const attrsToRewrite = [
    "href",
    "xlink:href",
    "clip-path",
    "mask",
    "filter",
    "fill",
    "stroke",
    "marker-start",
    "marker-mid",
    "marker-end",
    "style",
  ] as const;

  const allNodes = Array.from(doc.querySelectorAll<SVGElement>("*"));
  for (const node of allNodes) {
    for (const attr of attrsToRewrite) {
      const val = node.getAttribute(attr);
      if (!val) continue;

      const next = rewriteValue(val);
      if (next !== val) node.setAttribute(attr, next);
    }
  }

  return new XMLSerializer().serializeToString(svg);
}
