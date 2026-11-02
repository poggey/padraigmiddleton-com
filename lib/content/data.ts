import experience from "@/content/experience.json";
import site from "@/content/site.json";
import { experienceSchema, parseContent, siteSchema } from "./schemas";

// The JSON content, validated. Imported at build time, so a bad file fails the build.

export function getExperience() {
  return parseContent(experienceSchema, experience, "content/experience.json");
}

export function getSite() {
  return parseContent(siteSchema, site, "content/site.json");
}
