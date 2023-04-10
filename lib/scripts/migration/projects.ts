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
  noImage,
  writeErrors,
  printProgress
} from './'


export const migrateProjects = async (subdomain: string | undefined) => {

  console.time(`import-project-${subdomain}`)

  const errors = []

  try {

    const wpapi = buildWpApi(subdomain)
    const districts = await allDistricts()
    const districtId = districts.find(el => el.subdomain === subdomain).id
    const itemTypeId = (await itemTypeToId('project')).id
    const itemTypeIdSub = (await itemTypeToId('project_subpage')).id
    const blockIds = await allBlockIds()
    const allPosts = await allPages(wpapi, 'project')
    fs.writeFileSync('./lib/scripts/migration/projects.json', JSON.stringify(allPosts, null, 2))
    //const allPosts = JSON.parse(fs.readFileSync('./lib/scripts/migration/projects.json', { encoding: 'utf-8' }))
    //return await parseACFContent(allPosts[0].acf.layout)
    //return console.log(JSON.stringify(allPosts, null, 2))

    // Main projects
    console.log(`Parse ${allPosts.length} project items...`)
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
      intro: htmlToMarkdown(excerpt),
      content: await htmlToStructuredContent(content.rendered, blockIds),
      dropcap,
      color: color ? { red: hex2rgb(color).rgb[0], green: hex2rgb(color).rgb[1], blue: hex2rgb(color).rgb[2], alpha: 255 } : undefined,
      completed: is_archived,
      slug: parseSlug(slug),
      district: districtId
    }))))

    // Subprojects
    console.log('Parse subproject items...')
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
        image: image ? { url: image.url, title: image.caption } : layout && layout[0].image ? { url: layout[0].image, title: layout[0].caption } : noImage,
        title: title.rendered,
        subtitle: layout?.[0]?.sub_headline,
        content: await htmlToStructuredContent(layout && layout.map(({ text }) => text).join('') ? layout.map(({ text }) => text).join(' ') : content?.rendered, blockIds),
        dropcap,
        slug: parseSlug(slug),
        district: districtId
      }))))
    })))
    //return
    //return console.log(allPosts)
    //return console.log(JSON.stringify(projects, null, 2))
    const totalItems = projects.length + projects.map(el => el.subprojects.length).reduce((a, b) => a + b, 0)
    let errs = 0;
    let success = 0;

    console.log(`Insert ${totalItems} project items...`)

    for (let i = 0; i < projects.length; i++) {

      const subprojects = projects[i].subprojects
      const result = await Promise.allSettled(subprojects.map(el => insertRecord({
        ...el,
        id: undefined,
        parent: undefined
      }, itemTypeIdSub)))

      const fulfilled = result.filter(el => el.status === 'fulfilled')
      const rejected = result.filter(el => el.status === 'rejected')
      result.forEach((el, index) => el.status === 'rejected' && errors.push({ item: subprojects[index], error: el.reason }));

      errs += rejected.length
      success += fulfilled.length

      //if (rejected.length > 0) console.log(rejected.map((el: any) => parseDatoError(el.reason)).join('\n'))
      //if (fulfilled.length > 0) console.log(`${(success + errs)}/${allPosts.length}`)

      const subpage = result.filter(res => res.status === 'fulfilled').map((res) => res.status === 'fulfilled' ? res.value.id : undefined)

      try {
        await insertRecord({ ...projects[i], subprojects: undefined, subpage }, itemTypeId)
        success++
      } catch (err) {
        errors.push({ item: projects[i], error: err })
        errs++;
        //console.log('FAILED', projects[i].title)
        //console.log(parseDatoError(err))


      }
      printProgress(`${(success + errs)}/${totalItems}`)
    }
    console.log('\nDONE', `${success}/${totalItems}`, `Errors: ${errs}/${totalItems}`)
  } catch (err) {
    console.log(err)
  }

  writeErrors(errors, subdomain, 'project')

  console.timeEnd(`import-project-${subdomain}`)
}

//migrateProjects('vastmanland')