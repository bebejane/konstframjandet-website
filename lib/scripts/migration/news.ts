import fs from 'fs'
import {
  allDistricts,
  itemTypeToId,
  allPages,
  htmlToMarkdown,
  htmlToStructuredContent,
  striptags,
  decodeHTMLEntities,
  cleanObject,
  parseLink,
  parseSlug,
  chunkArray,
  buildWpApi,
  allBlockIds,
  insertRecord,
  parseDatoError,
} from './'

export const migrateNews = async (subdomain: string = 'forbundet') => {

  console.time('import')

  try {
    const errors = []
    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('news')).id
    const blockIds = await allBlockIds()

    //const allPosts = JSON.parse(fs.readFileSync('./news.json', { encoding: 'utf-8' }))
    const allPosts = await allPages(wpapi, 'news')

    fs.writeFileSync('./lib/scripts/migration/news.json', JSON.stringify(allPosts, null, 2))

    let news = await Promise.all(allPosts.map(async ({
      date: createdAt,
      title,
      slug,
      acf: {
        caption,
        image,
        subtitle,
        extra_text,
        excerpt,
        text,
        place,
        address,
        date,
        time,
        price,
        external_link,
        dropcap
      } }) =>
    (cleanObject({
      image: { url: image.url, title: image.caption || caption },
      title: title.rendered,
      subtitle: subtitle,
      intro: htmlToMarkdown(excerpt) || 'xxx',
      content: await htmlToStructuredContent(text, blockIds),
      dropcap,
      where: place,
      address,
      date,
      time,
      misc: decodeHTMLEntities(striptags(extra_text))?.trim(),
      external_link: parseLink(external_link),
      slug: parseSlug(slug),
      district: districtId
    }))))
    //return
    console.log(`Import ${news.length} items...`)

    const chunked = chunkArray(news, 40)

    for (let i = 0, total = 0; i < chunked.length; i++) {

      const res = await Promise.allSettled(chunked[i].map((el) => insertRecord(el, itemTypeId)))
      const fulfilled = res.filter(el => el.status === 'fulfilled')
      console.log(`${(total += fulfilled.length)}/${news.length}`)
      console.log(res.filter(el => el.status === 'rejected').map((el) => el.status === 'rejected' && parseDatoError(el.reason)))
    }

  } catch (err) {
    console.log(err)
    console.log(parseDatoError(err))
  }
  console.timeEnd('import')
}

//migrateNews('dalarna')