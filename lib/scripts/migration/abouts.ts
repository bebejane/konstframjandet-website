import fs from 'fs'
import {
  allDistricts,
  itemTypeToId,
  allPages,
  htmlToMarkdown,
  cleanObject,
  htmlToStructuredContent,
  parseSlug,
  allBlockIds,
  chunkArray,
  buildWpApi,
  insertRecord,
  decodeHTMLEntities,
  writeErrors,
  printProgress
} from './'

export const migrateAbout = async (subdomain: string | undefined) => {

  console.time(`import-about-${subdomain}`)

  const errors = []

  try {

    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('about')).id
    const allPosts = await allPages(wpapi, 'about')
    const blockIds = await allBlockIds()

    fs.writeFileSync(`./lib/scripts/migration/data/${subdomain}-about.json`, JSON.stringify(allPosts, null, 2))

    console.log(`Parse ${allPosts.length} about items...`)
    let items;

    items = await Promise.all(allPosts.map(async ({
      date: createdAt,
      title,
      slug,
      content,
      acf: {
        intro,
        dropcap
      } }) =>
    (cleanObject({
      createdAt,
      title: decodeHTMLEntities(title.rendered),
      intro: intro ? htmlToMarkdown(intro) : undefined,
      content: await htmlToStructuredContent(content.rendered, blockIds, [subdomain]),
      slug: parseSlug(slug),
      dropcap,
      district: districtId
    }))))

    console.log(`Import ${items.length} about items...`)
    const chunked = chunkArray(items, 30)

    for (let i = 0, total = 0; i < chunked.length; i++) {
      const res = await Promise.allSettled(chunked[i].map((el) => insertRecord(el, itemTypeId, [subdomain])))
      res.forEach((el, index) => el.status === 'rejected' && errors.push({ item: chunked[i][index], error: el.reason }));
      printProgress(`${(total += chunked[i].length)}/${items.length}`)
    }
    writeErrors(errors, subdomain, 'about')
  } catch (err) {
    writeErrors([{ error: err }], subdomain, 'about')
  }
  console.timeEnd(`import-about-${subdomain}`)
}

migrateAbout('vastmanland')