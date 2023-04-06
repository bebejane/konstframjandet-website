import hex2rgb from 'hex2rgb'
import fs from 'fs'
import {
  allDistricts,
  itemTypeToId,
  allPages,
  htmlToMarkdown,
  cleanObject,
  htmlToStructuredContent,
  parseSlug,
  buildWpApi,
  insertRecord,
  decodeHTMLEntities
} from './'

const parseACFContent = async (layout: any[]) => {
  if (!layout) return

  console.log(layout.map(({ text }) => text).join(''))

  return await htmlToStructuredContent(layout.map(({ text }) => text).join(''))
}

const migrateProjects = async (subdomain: string | undefined) => {

  console.time('import')
  try {

    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('project')).id
    const itemTypeIdSub = (await itemTypeToId('project_subpage')).id
    //const allPosts = await allPages(wpapi, 'project')
    const allPosts = JSON.parse(fs.readFileSync('./lib/scripts/migration/projects.json', { encoding: 'utf-8' }))

    return await parseACFContent(allPosts[0].acf.layout)
    //return console.log(JSON.stringify(allPosts, null, 2))

    // Main projects
    let projects = await Promise.all(allPosts.filter(({ parent }) => !parent).map(async ({
      id,
      date: createdAt,
      title,
      slug,
      content,
      acf: {
        color,
        image,
        is_archived,
        excerpt,
        dropcap
      } }) =>
    (cleanObject({
      id,
      createdAt,
      image: image ? { url: image?.url, title: image?.caption } : undefined,
      title: decodeHTMLEntities(title.rendered),
      intro: htmlToMarkdown(excerpt),
      content: await htmlToStructuredContent(content.rendered),
      dropcap,
      color: color ? { red: hex2rgb(color).rgb[0], green: hex2rgb(color).rgb[1], blue: hex2rgb(color).rgb[2], alpha: 255 } : undefined,
      completed: is_archived,
      slug: parseSlug(slug),
      district: districtId
    }))))

    // Subprojects
    projects = await Promise.all(projects.map(async (el) => ({
      ...el,
      id: undefined,
      subprojects: await Promise.all(allPosts.filter(({ parent }) => el.id === parent).map(async ({
        date: createdAt,
        title,
        slug,
        content,
        acf: {
          image,
          layout,
          dropcap
        } }) =>
      (cleanObject({
        createdAt,
        image: layout && layout[0].image ? { url: layout[0].image, title: layout[0].caption } : undefined,
        title: decodeHTMLEntities(title.rendered),
        subtitle: layout?.[0]?.sub_headline ?? undefined,
        content: await parseACFContent(layout) ?? await htmlToStructuredContent(content.rendered),
        dropcap,
        slug: parseSlug(slug),
        district: districtId
      }))))
    })))

    return console.log(allPosts)
    //return console.log(JSON.stringify(projects, null, 2))

    for (let i = 0, total = 0; i < projects.length; i++) {

      const subprojects = projects[i].subprojects
      const result = await Promise.allSettled(subprojects.map(el => insertRecord({
        ...el,
        id: undefined,
        parent: undefined
      }, itemTypeIdSub)))

      if (projects[i].subprojects.length)
        console.log(`${(total += subprojects.length)}/${allPosts.length}`)

      const subpage = result.filter(res => res.status === 'fulfilled').map((res) => res.status === 'fulfilled' ? res.value.id : undefined)

      try {
        await insertRecord({ ...projects[i], subprojects: undefined, subpage }, itemTypeId)
        console.log(`${(total += 1)}/${allPosts.length}`)
      } catch (err) {
        console.log('FAILED', projects[i].title, projects[i].slug)
        console.log(err)
      }
    }

  } catch (err) {
    console.log(err)
  }
  console.timeEnd('import')
}

migrateProjects('vastmanland')