const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;

export function sanitizeDownloadFilename(name: string | null | undefined, fallback: string, extension = "") {
  const baseName = name?.split(/[\\/]/).pop()?.replace(INVALID_FILENAME_CHARS, "-").trim();
  const safeName = (baseName || fallback).replace(/\.+$/g, "").trim() || fallback;
  if (!extension || /\.[^./\\]+$/.test(safeName)) return safeName;
  return `${safeName}.${extension.replace(/^\./, "")}`;
}

export async function fetchResourceBlob(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to download the file (${response.status}).`);
  return response.blob();
}

export async function downloadResourceFile(url: string, filename: string) {
  const blob = await fetchResourceBlob(url);
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}