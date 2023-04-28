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
  writeErrors,
  printProgress,
} from './'

export const migrateNews = async (subdomain: string = 'forbundet') => {

  console.time(`import-news-${subdomain}`)
  const errors = []

  try {

    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('news')).id
    const blockIds = await allBlockIds()
    const allPosts = await allPages(wpapi, 'news')

    fs.writeFileSync(`./lib/scripts/migration/data/${subdomain}-news.json`, JSON.stringify(allPosts, null, 2))

    console.log(`Import ${allPosts.length} news items...`)
    console.log('Parse news items...')
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
      createdAt,
      image: { url: image.url, title: image.caption || caption },
      title: title.rendered,
      subtitle: subtitle,
      intro: htmlToMarkdown(excerpt),
      content: await htmlToStructuredContent(text, blockIds, [subdomain]),
      extra: await htmlToStructuredContent(extra_text, blockIds, [subdomain]),
      dropcap,
      where: place,
      address,
      date,
      time,
      price,
      external_link: parseLink(external_link),
      slug: parseSlug(slug),
      district: districtId
    }))))

    const chunked = chunkArray(news, 40)

    console.log('Insert news items...')
    for (let i = 0, total = 0; i < chunked.length; i++) {

      const res = await Promise.allSettled(chunked[i].map((el) => insertRecord(el, itemTypeId, [subdomain])))
      res.forEach((el, index) => el.status === 'rejected' && errors.push({ item: chunked[i][index], error: el.reason }));
      const fulfilled = res.filter(el => el.status === 'fulfilled')
      printProgress(`${(total += fulfilled.length)}/${news.length}`)
      //console.log(res.filter(el => el.status === 'rejected').map((el) => el.status === 'rejected' && parseDatoError(el.reason)))
    }

    writeErrors(errors, subdomain, 'news')
  } catch (err) {
    writeErrors([{ error: err }], subdomain, 'news')
  }

  console.timeEnd(`import-news-${subdomain}`)
}

//migrateNews('vasterbotten')