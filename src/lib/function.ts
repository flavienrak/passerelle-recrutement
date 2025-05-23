import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

import { v4 as uuidv4 } from 'uuid';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';
import JSON5 from 'json5';
import {
  matriceGlobalSynthese,
  matriceSynthese,
  syntheseEvaluation,
} from './constants';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const pageText = content.items
      .filter((item): item is TextItem => (item as TextItem).str !== undefined)
      .map((item) => item.str)
      .join(' ');

    text += pageText + '\n';
  }

  return text;
};

const extractTextFromDocx = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value; // Texte brut
};

/**
 * Échappe les retours à la ligne à l’intérieur des littéraux de chaîne JSON
 */
const escapeNewlinesInJsonStrings = (block: string): string =>
  block.replace(/"(?:[^"\\]|\\.)*"/g, (strLiteral) => {
    const inner = strLiteral.slice(1, -1);
    const escaped = inner.replace(/(\r\n|\r|\n)/g, '\\n');
    return `"${escaped}"`;
  });

/**
 * Extrait et parse un bloc JSON ou JSON5 (objet `{...}` ou tableau `[...]`) depuis une chaîne arbitraire.
 * @param value La chaîne potentiellement contenant du JSON
 * @returns L’objet JavaScript parsé ou `null` si on n’a pas réussi à parser
 */
const extractJson = (value?: string | null): any | null => {
  if (!value) {
    return null;
  }
  // 1) Extraire soit un bloc ```json``` soit un objet/ tableau JSON brut
  const raw =
    value.match(/```json\s*([\s\S]*?)\s*```/)?.[1] ||
    value.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)?.[0] ||
    null;
  if (!raw) return null;

  // 2) Échapper les retours à la ligne dans les chaînes JSON
  const prepped = escapeNewlinesInJsonStrings(raw);

  // 3) Tenter JSON.parse (strict)
  try {
    return JSON.parse(prepped);
  } catch {
    console.warn('JSON.parse a échoué, essai avec JSON5.parse');
  }

  // 4) Tenter JSON5.parse (plus permissif)
  try {
    return JSON5.parse(prepped);
  } catch {
    console.warn('JSON5.parse a échoué, sanitation en dernier recours');
  }

  // 5) Sanitation + dernier essai JSON5.parse
  const sanitized = prepped
    .replace(/[\x00-\x1F]+/g, '') // supprime caractères de contrôle
    .replace(/(?<!\\)(\r\n|\r|\n)/g, '\\n'); // échappe tout retour à la ligne

  try {
    return JSON5.parse(sanitized);
  } catch (err) {
    console.error('Sanitation + JSON5.parse a échoué :', err);
    return null;
  }
};

const percentage = (value: number): number => {
  return Math.min(100, Math.round(value * 100));
};

const getSyntheseValue = (average: number): string | undefined => {
  const entry = syntheseEvaluation.find(
    (item) => average >= item.min && average <= item.max
  );

  if (!entry) return undefined;

  if (typeof entry.value === 'string') {
    return entry.value;
  }

  if (Array.isArray(entry.value)) {
    const randomIndex = Math.floor(Math.random() * entry.value.length);
    return entry.value[randomIndex];
  }
};

const getValueForScore = (id: number, score: number): string | undefined => {
  // 1) On cherche l’évaluation correspondant à l’ID
  const evaluation = matriceSynthese.find((item) => item.id === id);
  if (!evaluation) return undefined;

  // 2) On cherche l’option dont le score est dans [min, max]
  const opt = evaluation.options.find(
    (item) => score >= item.min && score <= item.max
  );
  return opt?.value;
};

const getGlobalValueForScore = (
  id: number,
  score: number
): string | undefined => {
  // 1) On cherche l’évaluation correspondant à l’ID
  const evaluation = matriceGlobalSynthese.find((item) => item.id === id);
  if (!evaluation) return undefined;

  // 2) On cherche l’option dont le score est dans [min, max]
  const opt = evaluation.options.find(
    (item) => score >= item.min && score <= item.max
  );
  return opt?.value;
};

const generateUniqueId = (): string => {
  return uuidv4();
};

export {
  extractTextFromPDF,
  extractTextFromDocx,
  extractJson,
  percentage,
  getSyntheseValue,
  getValueForScore,
  getGlobalValueForScore,
  generateUniqueId,
};
