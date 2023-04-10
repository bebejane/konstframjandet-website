import { migrateAbout } from "./abouts.js";
import { migrateNews } from "./news.js";
import { migrateProjects } from "./projects.js";

const subdomain = process.argv[2] || undefined

export const migrateAll = async (subdomain?: string) => {
  console.time(`migrateAll-${subdomain}`)
  console.log('\n\n')
  console.log(`-- ${subdomain} -----------------------------------`)
  await Promise.allSettled([migrateAbout(subdomain), migrateNews(subdomain), migrateProjects(subdomain)]);
  /*
  await migrateAbout(subdomain)
  await migrateNews(subdomain)
  await migrateProjects(subdomain)
  */
  console.timeEnd(`migrateAll-${subdomain}`)

}

migrateAll(subdomain.trim())
