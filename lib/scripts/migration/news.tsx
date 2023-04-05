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
  insertRecord
} from './'

const migrateNews = async (subdomain: string | undefined) => {

  console.time('import')
  try {

    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('news')).id
    const allPosts = await allPages(wpapi, 'news')

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
      subtitle,
      intro: htmlToMarkdown(excerpt),
      content: await htmlToStructuredContent(text),
      dropcap,
      where: place,
      address,
      date,
      time,
      misc: extra_text,
      external_link: parseLink(external_link),
      slug: parseSlug(slug),
      district: districtId
    }))))

    console.log(`Import ${news.length} items...`)

    const chunked = chunkArray(news, 10)

    for (let i = 0, total = 0; i < chunked.length; i++) {
      console.log(`${(total += chunked[i].length)}/${news.length}`)
      await Promise.allSettled(chunked[i].map((el) => insertRecord(el, itemTypeId)))
    }

  } catch (err) {
    console.log(err)
  }
  console.timeEnd('import')
}

migrateNews('dalarna')