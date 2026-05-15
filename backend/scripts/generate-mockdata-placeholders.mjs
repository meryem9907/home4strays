/**
 * Creates minimal placeholder files for local/Docker MinIO seeding.
 * Run from repo root: node backend/scripts/generate-mockdata-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockdataDir = path.resolve(__dirname, "../mockdata");

/** Smallest valid 1x1 JPEG */
const JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGfAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z",
  "base64",
);

/** Smallest valid 1x1 PNG */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

/** Minimal PDF */
const PDF = Buffer.from(
  "%PDF-1.1\n1 0 obj<<>>endobj\n2 0 obj<</Length 0>>stream\nendstream\nendobj\ntrailer<</Root 1 0 R>>\n%%EOF\n",
);

const FILES = [
  "claudia weber.jpg",
  "jonas berger.jpg",
  "nadine kunz.jpg",
  "leon fischer.jpg",
  "pfotenhilfe_verificationdoc.pdf",
  "pfotenhilfesued.jpg",
  "nordlicht_verificationdoc.pdf",
  "nordlicht.png",
  "luna.jpg",
  "luna2.jpg",
  "max.jpg",
  "max2.jpg",
  "mimi.jpg",
  "rocky.jpg",
  "bella.jpg",
  "bella2.jpg",
  "charly.jpg",
  "nala.jpg",
  "simba.png",
];

function contentFor(name) {
  if (name.endsWith(".png")) return PNG;
  if (name.endsWith(".pdf")) return PDF;
  return JPEG;
}

await mkdir(mockdataDir, { recursive: true });

for (const name of FILES) {
  const filePath = path.join(mockdataDir, name);
  await writeFile(filePath, contentFor(name));
  console.log("wrote", filePath);
}

console.log(`\nDone. ${FILES.length} placeholders in backend/mockdata/`);
