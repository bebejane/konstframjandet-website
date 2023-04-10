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
  decodeHTMLEntities,
  ApiError,
  allBlockIds,
  parseDatoError,
  noImage
} from './'


export const migrateProjects = async (subdomain: string | undefined) => {

  console.time('import')
  try {

    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('project')).id
    const itemTypeIdSub = (await itemTypeToId('project_subpage')).id
    const blockIds = await allBlockIds()
    //const allPosts = await allPages(wpapi, 'project')
    const allPosts = JSON.parse(fs.readFileSync('./lib/scripts/migration/projects.json', { encoding: 'utf-8' }))
    //return await parseACFContent(allPosts[0].acf.layout)
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
      image: image ? { url: image?.url, title: image?.caption } : noImage,
      title: decodeHTMLEntities(title.rendered),
      intro: htmlToMarkdown(excerpt) || 'No intro...',
      content: await htmlToStructuredContent(content.rendered, blockIds),
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
        image: layout && layout[0].image ? { url: layout[0].image, title: layout[0].caption } : noImage,
        title: title.rendered,
        intro: 'No intro...',
        subtitle: layout?.[0]?.sub_headline,
        content: await htmlToStructuredContent(layout?.map(({ text }) => text).join(' ') || ' ', blockIds),
        dropcap,
        slug: parseSlug(slug),
        district: districtId
      }))))
    })))
    //return
    //return console.log(allPosts)
    //return console.log(JSON.stringify(projects, null, 2))
    let errors = 0;
    let success = 0;

    for (let i = 0; i < projects.length; i++) {

      const subprojects = projects[i].subprojects
      const result = await Promise.allSettled(subprojects.map(el => insertRecord({
        ...el,
        id: undefined,
        parent: undefined
      }, itemTypeIdSub)))

      const fulfilled = result.filter(el => el.status === 'fulfilled')
      const rejected = result.filter(el => el.status === 'rejected')

      errors += rejected.length
      success += fulfilled.length

      if (rejected.length > 0)
        console.log(rejected.map((el: any) => parseDatoError(el.reason)).join('\n'))
      if (fulfilled.length > 0)
        console.log(`${(success + errors)}/${allPosts.length}`)

      const subpage = result.filter(res => res.status === 'fulfilled').map((res) => res.status === 'fulfilled' ? res.value.id : undefined)

      try {
        await insertRecord({ ...projects[i], subprojects: undefined, subpage }, itemTypeId)
        success++
      } catch (err) {
        errors++;
        console.log('FAILED', projects[i].title)
        console.log(parseDatoError(err))

      }
      console.log(`${(success + errors)}/${allPosts.length}`)
    }
    console.log('DONE', `${success}/${allPosts.length}`, `Errors: ${errors}/${allPosts.length}`)
  } catch (err) {
    console.log(err)
  }

  console.timeEnd('import')
}

//migrateProjects('vastmanland')