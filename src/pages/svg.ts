// Copyrights © 2026 by Worajedt Sitthidumrong

export function polygonPoints(cx: number, cy: number, radius: number, sides: number, rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + index * ((Math.PI * 2) / sides);
    return `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(' ');
}

export function cssPolygon(sides: number) {
  return `polygon(${Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + index * ((Math.PI * 2) / sides);
    return `${(50 + Math.cos(angle) * 47).toFixed(1)}% ${(50 + Math.sin(angle) * 47).toFixed(1)}%`;
  }).join(', ')})`;
}
