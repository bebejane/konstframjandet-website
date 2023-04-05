import {
  allDistricts,
  itemTypeToId,
  allPages,
  htmlToMarkdown,
  cleanObject,
  client,
  htmlToStructuredContent,
  parseLink,
  parseSlug,
  uploadMedia,
  chunkArray,
  buildWpApi,
  insertRecord,
  decodeHTMLEntities
} from './'

const migrateAbout = async (subdomain: string | undefined) => {

  console.time('import')

  try {

    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('about')).id
    const allPosts = await allPages(wpapi, 'about')
    //return console.log(JSON.stringify(allPosts, null, 2))

    let items = await Promise.all(allPosts.map(async ({
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
      content: await htmlToStructuredContent(content.rendered),
      slug: parseSlug(slug),
      dropcap,
      district: districtId
    }))))

    console.log(`Import ${items.length} items...`)

    const chunked = chunkArray(items, 10)

    for (let i = 0, total = 0; i < chunked.length; i++) {
      await Promise.allSettled(chunked[i].map((el) => insertRecord(el, itemTypeId)))
      console.log(`${(total += chunked[i].length)}/${items.length}`)
    }

  } catch (err) {
    console.log(err)
  }
  console.timeEnd('import')
}

migrateAbout('dalarna')