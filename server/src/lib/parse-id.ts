// Convierte un valor en un ID válido (entero positivo) o devuelve null
export function parseId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}