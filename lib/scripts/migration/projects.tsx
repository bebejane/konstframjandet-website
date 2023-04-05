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

import hex2rgb from 'hex2rgb'

const parseACFContent = async (layout: any[]) => {
  if (!layout) return
  return await htmlToStructuredContent(layout.map(({ text }) => text).join('<br/>'))
}

const migrateProjects = async (subdomain: string | undefined) => {

  console.time('import')
  try {

    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('project')).id
    const itemTypeIdSub = (await itemTypeToId('project_subpage')).id
    const allPosts = await allPages(wpapi, 'project')

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
        image: layout && layout[0].image ? { url: layout[0].image, title: layout[0].caption } : undefined,
        title: decodeHTMLEntities(title.rendered),
        subtitle: layout?.[0]?.sub_headline ?? undefined,
        content: await parseACFContent(layout) ?? await htmlToStructuredContent(content.rendered),
        dropcap,
        slug: parseSlug(slug),
        district: districtId
      }))))
    })))


    projects.forEach((el, idx) => {
      delete projects[idx].id
      delete projects[idx].parent
      projects[idx].subprojects.forEach((el, i) => {
        delete projects[idx].subprojects[i].id
        delete projects[idx].subprojects[i].parent
      })
    })
    //return console.log(JSON.stringify(projects, null, 2))

    for (let i = 0, total = 0; i < projects.length; i++) {

      const subprojects = projects[i].subprojects
      const result = await Promise.allSettled(subprojects.map(el => insertRecord(el, itemTypeIdSub)))

      if (projects[i].subprojects.length)
        console.log(`${(total += subprojects.length)}/${allPosts.length}`)

      const subpage = result.filter(res => res.status === 'fulfilled').map((res) => res.status === 'fulfilled' ? res.value.id : undefined)
      const project = { ...projects[i] }
      delete project.subprojects;

      try {
        await insertRecord({ ...project, subpage }, itemTypeId)
        console.log(`${(total += 1)}/${allPosts.length}`)
      } catch (err) {
        console.log('FAILED', project.title, project.slug)
        console.log(err)
      }
    }

  } catch (err) {
    console.log(err)
  }
  console.timeEnd('import')
}

migrateProjects('vastmanland')