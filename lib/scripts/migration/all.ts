import { migrateAbout } from "./abouts.js";
import { migrateNews } from "./news.js";
import { migrateProjects } from "./projects.js";
import { allDistricts } from "./";

const subdomain = process.argv[2] || undefined

const migrateAll = async () => {
  const subdomains = (await allDistricts()).map(d => d.subdomain)
  //const subdomains = ['dalarna']
  console.time(`migrateall`)
  for (let i = 0; i < subdomains.length; i++)
    await migrate(subdomains[i])

  console.timeEnd(`migrateall`)
}

export const migrate = async (subdomain?: string) => {
  console.time(`migrate ${subdomain}`)
  console.log(`\n-- ${subdomain} -----------------------------------`)
  await Promise.allSettled([migrateAbout(subdomain), migrateNews(subdomain), migrateProjects(subdomain)]);
  /*
  await migrateAbout(subdomain)
  await migrateNews(subdomain)
  await migrateProjects(subdomain)
  */
  console.timeEnd(`migrate ${subdomain}`)

}

//migrate(subdomain.trim())
migrateAll()