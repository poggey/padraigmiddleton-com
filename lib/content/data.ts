import { z } from "zod";
import experience from "@/content/experience.json";
import predictions from "@/content/predictions.json";
import site from "@/content/site.json";
import { experienceSchema, parseContent, predictionSchema, siteSchema } from "./schemas";

// The JSON content, validated. Imported at build time, so a bad file fails the build.

export function getPredictions() {
  const list = parseContent(z.array(predictionSchema), predictions, "content/predictions.json");
  const ids = list.map((p) => p.id);
  const repeated = ids.find((id, i) => ids.indexOf(id) !== i);
  if (repeated) throw new Error(`Two predictions share id ${repeated} in content/predictions.json`);
  return list;
}

export function getExperience() {
  return parseContent(experienceSchema, experience, "content/experience.json");
}

export function getSite() {
  return parseContent(siteSchema, site, "content/site.json");
}
