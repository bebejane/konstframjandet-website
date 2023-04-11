import { migrateAbout } from "./abouts.js";
import { migrateNews } from "./news.js";
import { migrateProjects } from "./projects.js";
import { allDistricts } from "./";

const migrateAll = async () => {
  const subdomains = (await allDistricts()).map(d => d.subdomain)
  console.time(`migrateall`)
  for (let i = 0; i < subdomains.length; i++)
    await migrate(subdomains[i])

  console.timeEnd(`migrateall`)
}

export const migrate = async (subdomain?: string) => {
  console.time(`migrate ${subdomain}`)
  console.log(`\n-- ${subdomain} -----------------------------------`)
  await Promise.allSettled([migrateAbout(subdomain), migrateNews(subdomain), migrateProjects(subdomain)]);
  console.timeEnd(`migrate ${subdomain}`)
}

migrateAll()