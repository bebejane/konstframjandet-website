import { migrateAbout } from "./abouts.js";
import { migrateNews } from "./news.js";
import { migrateProjects } from "./projects.js";

const subdomain = process.argv[2] || undefined

export const migrateAll = async (subdomain?: string) => {
  console.log('migrateAll', subdomain)
  await Promise.allSettled([migrateAbout(subdomain), migrateNews(subdomain), migrateProjects(subdomain)])
}

migrateAll(subdomain.trim())
