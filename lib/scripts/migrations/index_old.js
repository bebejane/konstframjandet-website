require('dotenv').config({path:'./.env.local'})
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const stripTags = require('striptags');
const TurndownService = require('turndown')
const turndownService = new TurndownService()
const {decode : decodeEntities} = require('html-entities');

const wait = (ms = 0) => new Promise((resolve) => setTimeout(()=>resolve(), ms))
const writeToFile = (name, obj) => fs.writeFileSync(`./migrations/data/${name}.json`, JSON.stringify(obj, null, 2))

const { SiteClient, buildModularBlock } = require('datocms-client');
const WPAPI = require( 'wpapi' );
const wpapi = new WPAPI({ endpoint: process.env.WP_ENDPOINT, username: process.env.WP_USERNAME, password: process.env.WP_PASSWORD, auth:true});
const datoClient = new SiteClient(process.env.CMS_API_TOKEN);

const locales = ['en', 'sv']
const english = {wpml_language:'en'}
const swedish = {wpml_language:'sv'}
const lang = english;

let conn;

const variantBlockId = '1801308'
const modelBlockId = '1801307'
const featureBlockId = '1801299'
const lightsourceBlockId = '1801306'
const accessoryBlockId = '1801309'
const accessoryModelId = '1852419'


const getAllRecords = async (query) =>{
  const items = [];
  
  for(let offset = 0; true; offset+=30){
    const records = await datoClient.items.all({...query, page:{offset, limit:30}});
    if(records.length)
      items.push.apply(items, records)
    else
      break;
  }

  return items;
}

const productExists = async (slug) => {
  const records = await datoClient.items.all({
    filter: {
      type: 'product',
      fields: {
        slug: {
          eq: slug,
        }
      }
    }
  });
  return records.length ? records[0] : false
}
const findRecord = async (type, key, val) => {
  const records = await datoClient.items.all({
    filter: {
      type,
      fields: {
        [key]: {
          eq: val,
        }
      }
    }
  });
  return records.length ? records[0] : false
}

const taxonomies = {
  'category':{
    name:'name',
    description:'description',
    _dato:{
      id:1765134
    }
  },
  'family':{
    name:'name',
    _dato:{
      id:1765136
    }
  },
  'electrical-data':{
    name:'name',
    _dato:{
      id:1765137,
      column: 'electrical'
    }
  },
  'connection':{
    name:'name',
    _dato:{
      id:1765138
    }
  },
  'mounting':{
    name:'name',
    _dato:{
      id:1765139
    }
  },
  'color':{
    name:'name',
    _dato:{
      id:1765140
    }
  },
  'material':{
    name:'name',
    _dato:{
      id:1765215
    }
  },
  'socket':{
    name:'name',
    _dato:{
      id:1765141
    }
  },
  'lightsource':{
    name:'name',
    lightsource_price:'price',
    lightsource_art_no: 'article_no',
    _dato:{
      id:1765143
    }
  },
  'dimmable':{
    name:'name',
    _dato:{
      id:1765144
    }
  },
}


const migrateProducts = async () => {

  console.log('Migrating product db...')

  
  const taxMap = await generateTaxonomyMap()
  console.log(taxMap)
  try{
    console.log('Loading products...')

    const parsed = []
    const failed = []
    let page = 1;

    wpapi.product = wpapi.registerRoute('wp/v2', '/product/(?P<id>)', {wpml_language:'en'});
    let products = await wpapi.product().perPage(100).page(page).param(english).param({status:'publish'})
    let productsSv = await wpapi.product().perPage(100).page(page).param(swedish).param({status:'publish'})
    
    for (let i = 0; i < products.length; i++) {
      
      try{
        
        const exist = await productExists(products[i].slug)
        if(!exist)
          console.log(products[i].slug)
        continue

        if(exist) {
          console.log('update:', products[i].slug)
          const prodSv = productsSv.filter(p => p.slug === products[i].slug)[0]
          if(!prodSv) continue

          const record = await datoClient.items.update(exist.id, {
            description:{
              en:cleanContent(products[i].content.rendered),
              sv:cleanContent(prodSv.content.rendered)
            }
          })  
          continue
        }
        continue

        

        
        console.log('---------------')

        /*

        const p = await parseProduct(products[i], taxMap, prodSv);
        parsed.push(p)
        fs.writeFileSync(`./migrations/data/products/${p.slug}.json`, JSON.stringify(p, null, 2))      
        fs.writeFileSync(`./migrations/data/products/${p.slug}_.json`, JSON.stringify(products[i], null, 2))
        const record = await datoClient.items.create({
          itemType: '1765120',
          ...{...p, models:undefined},
          models: p.models?.map((m)=> 
            buildModularBlock({
              itemType:'1765343',
              name:m.name,
              drawing:m.drawing,
              lightsources: m.lightsources?.map(l => buildModularBlock({
                itemType:'1765346',
                ...l
              })),
              variants: m.variants?.map(v => buildModularBlock({
                itemType:'1765356',
                ...v
              })),
              accessories: m.accessories?.map(a => buildModularBlock({
                itemType:'1765450',
                ...a
              }))
            })
          )
        });
        */

      }catch(err){
        console.log('failed')
        console.log(err)
        failed.push({...products[i], error:err})
      }
    }
    writeToFile('passed', parsed)
    writeToFile('failed', failed)
  }catch(err){
    console.error(err)
  }
}

const cleanContent = (content) => { 
  content = content.replace(/<p>/gi, '').replace(/<br \/>/gi, '').replace(/\<\!--more--\>/gi, '\n').replace(/<\/p>/gi, '\n')
  content = content.replace(/\n\n\n/gi, '\n\n')
  for (let i = content.length-1; i >= 0 && content[i] === '\n'; i--) content = content.slice(0,-1);
  return content.trim()
}

const parseProduct = async (p, taxMap, pSv) => {
  
  if(!pSv) throw 'No swedish for ' + p.slug

  const wpIdToDatoId = (taxonomy, wpId) => {
    if(!wpId) return undefined
    return taxMap[taxonomy][wpId]
  }
  const uploadMedia = async (arr, key, tags) => {
    const uploads = []
    for (let i = 0; i < arr.length; i++) 
      uploads.push(migrateMedia(arr[i][key], tags))
    const res = await Promise.all(uploads)
    return res.map( r => r ? ({upload_id:r.id}) : undefined);
  }
  console.time('parse')
  console.log('Product: ' + p.title.rendered.trim(), p.status)

  const image = !p.featured_media ? undefined : await migrateMedia(p.featured_media, ['product-image'])
  const environmentImage = !p.acf.product_environment ? undefined : await migrateMedia(p.acf.product_environment, ['product-enviroment-image'])
  const gallery = await uploadMedia(p.acf.gallery, 'id', ['product-gallery'])
  const colorImages = await uploadMedia(p.acf.colors, 'id', ['product-color'])
  const drawings = await uploadMedia(p.acf.model.map(m => ({id:m.drawing})), 'id', ['product-drawing'])

  const electricalData = !p.acf.electrical_data ? undefined : p.acf.electrical_data.map((el)=> wpIdToDatoId('electrical', el.term_id))
  const sockets = p.acf.socket ? p.acf.socket.map(({term_id}) => wpIdToDatoId('socket', term_id)) : undefined
  //const pdfFile = !p.acf.pdf ? undefined : await migrateMedia(p.acf.pdf, ['product-pdf'])
  const lightFile = !p.acf.light_file ? undefined : await migrateMedia(p.acf.light_file, ['product-light-file']);
  const categories = !p['product-category'] ? null : p['product-category'].map((c)=>wpIdToDatoId('category', c))
  console.log(categories, p['product-category'])
  const prod = {
    title: decodeEntities(p.title.rendered.trim()),
    bimLink:p.acf.bim_link,
    colorImages,
    environmentImage: environmentImage ? {upload_id: environmentImage.id} : undefined,
    description: {
      en: decodeEntities(cleanContent(p.content.rendered)),
      sv: decodeEntities(cleanContent(pSv.content.rendered)),
    },
    family: !p['product-family'] ? undefined : wpIdToDatoId('family', p['product-family'][0]),
    categories,
    designer: wpIdToDatoId('designer', p.acf.designer?.ID),
    connection: wpIdToDatoId('connection', p.acf.connection?.term_id),
    dimmable: wpIdToDatoId('dimmable', p.acf.dimmable?.term_id),
    mounting: wpIdToDatoId('mounting', p.acf.mounting?.term_id),
    electricalData,
    image: image ? {upload_id: image.id} : undefined,
    gallery,
    lightFile: lightFile ? {upload_id: lightFile.id} : undefined,
    //pdfFile: pdfFile ? {upload_id:pdfFile.id} : undefined,
    presentation: {
      en: decodeEntities(p.acf.desc),
      sv: decodeEntities(pSv.acf.desc)
    },
    slug:p.slug,
    sockets,
    models: p.acf.model.map((m, idx)=> ({
      name:decodeEntities(m.name),
      drawing: !m.drawing ? undefined : drawings[idx],
      lightsources:!m.lightsources ? undefined : m.lightsources.map((el)=> ({
        amount:el.amount,
        included:el.included,
        lightsource:wpIdToDatoId('lightsource', el.lightsource.term_id)
      })),
      variants: !m.versions ? undefined : m.versions.map((v) => ({
        articleNo:v.art_no,
        color:wpIdToDatoId('color', v.color.term_id),
        material:wpIdToDatoId('material', v.material.term_id),
        extraPercent:v.extra,
        price:v.price,
        specificFeature:v.difference,
        vat:v.exclude_price_factor,
        volume: v.volume ? parseFloat(v.volume.replace(/\,/, '.')) : null,
        weight: v.weight
      })),
      accessories: !m.accessories ? undefined : m.accessories.map((a) => ({
        product:a.product,
        priceNoVat:a.amount,
        articleNo:a.product_no
      }))
    }))
  }
  console.timeEnd('parse')
  console.log('')
  return prod
}

const migrateMedia = async (id, tags = []) => {

  if(!id) return undefined
  const media = isNaN(id) ? { source_url:id } : await wpapi.media().id(id)
  if(!media) return undefined

  const {caption, source_url : url} = media;
  const title = caption?.rendered ? stripTags(caption.rendered).replace(/\n/g, '').trim() : undefined
  console.log(`Uploading ${url.split('/').pop()} - "${title}"`)

  const path = await datoClient.createUploadPath(url);
  const defaultFieldMetadata = title ? {
    en: {
      alt: title,
      title: title,
      customData:{}
    }
  } : null
  
  let data = { path, tags}
  if(defaultFieldMetadata)
    data = {...data, defaultFieldMetadata}

  const upload = await datoClient.uploads.create(data);
  return upload
}

const migrateSvMedia = async () => {
  //const colorImages = await uploadMedia(p.acf.colors, 'id', ['product-color'])

  const images = await datoClient.uploads.all({
    filter: {
      fields: {
        type: {
          eq: 'image'
        }
      }
    }
  }, {allPages:true})
  
  wpapi.product = wpapi.registerRoute('wp/v2', '/product/(?P<id>)', {wpml_language:'en'});
  //let productsSv = await wpapi.product().perPage(100).page(1).param(english).param({status:'publish'})
  let productsSv = await wpapi.product().perPage(100).page(1).param(swedish).param({status:'publish'})

  let count = 0
  for (let i = 0; i < productsSv.length; i++) {
    const p = productsSv[i];
    for (let x = 0; x < p.acf.colors.length; x++) {
      const color = p.acf.colors[x];
      const caption = color.caption
      const imgs = images.filter(img => img.filename.toLowerCase() == color.filename.toLowerCase())

      if(imgs.length && caption) {
          for (let y = 0; y < imgs.length; y++) {
            await datoClient.uploads.update(imgs[y].id, {
              defaultFieldMetadata:{
                ...imgs[y].defaultFieldMetadata,
                sv:{
                  title:caption,
                  alt:caption,
                  customData:{}
                }
              }
            })
            console.log(imgs[y].filename, caption) 
          }
        }
      }
    }
    

    
  
  console.log(count)
  //console.log(images)
//  products.forEach(p => console.log(p.acf.colors))
  console.log(images.map(i => i.filename))
  
  


}

const migrateLightsources = async () => {
  return
  wpapi['productlightsource'] = wpapi.registerRoute('wp/v2', `/product-lightsource/(?P<id>)`);
  const data = await wpapi['productlightsource']().perPage(100).param(english)//.param({status:'publish'})
  const dataSv = await wpapi['productlightsource']().perPage(100).param(swedish)//.param({status:'publish'})
  
  //console.log(data)
  //console.log(dataSv)
  //return
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const prod = await findRecord('product_lightsource', 'name',  data[i].name)
    if(!prod) continue
//    const itemSv = dataSv.filter((d) => d.acf.lightsource_art_no === )[0]

    const record = await datoClient.items.update(prod.id, {
      price:item.acf.lightsource_price ? parseFloat(item.acf.lightsource_price) : null,
      articleNo:item.acf.lightsource_art_no || null
    })    
  }
}

//return migrateLightsources()

const migrateSpecificFeature = async () => {
  console.log('migrate features...')
  const featureMap = {}
  const featureMapItems = {}

  wpapi.product = wpapi.registerRoute('wp/v2', '/product/(?P<id>)', english);
  let productsEn = await wpapi.product().perPage(100).page(1).param(english).param({status:'publish'})
  let productsSv = await wpapi.product().perPage(100).page(1).param(swedish).param({status:'publish'})

  const products = await getAllRecords({
    nested:true,
    filter:{
      type: 'product'
    }
  });
  


  const records = await datoClient.items.all({filter: { type: variantBlockId}}, {allPages:true})


  productsEn.forEach(p => {
    //console.log(p)
    p.acf.model.forEach((m)=>{
      m.versions && m.versions.forEach(v => {
        if(!featureMap[v.art_no]) 
          featureMap[v.art_no] = {}
          
        featureMap[v.art_no] = {en:v.difference, sv:''}
      })
    })
  })
  productsSv.forEach(p => {
    //console.log(p)
    p.acf.model.forEach((m)=>{
      m.versions && m.versions.forEach(v => {
        featureMap[v.art_no] = {...featureMap[v.art_no], sv:v.difference}
      })
    })
  })
  
  
  for (let i = 0; i < records.length; i++) {
    const item = records[i];
    if(featureMap[item.articleNo])
      featureMap[item.articleNo].id = item.id;
  }
  Object.keys(featureMap).forEach(k => {
    const item = featureMap[k];
    if(!featureMap[k].id || (!featureMap[k].en && !featureMap[k].sv)) return
    if(!featureMapItems[featureMap[k].en+featureMap[k].sv])
      featureMapItems[featureMap[k].en+featureMap[k].sv] = {...featureMap[k], items:[]}
    featureMapItems[featureMap[k].en+featureMap[k].sv].items.push(featureMap[k].id)    
  })

  //return console.log(featureMapItems)
  
  for (let i = 0; i < Object.keys(featureMapItems).length; i++) {
    const k = Object.keys(featureMapItems)[i];
    const variantIds = featureMapItems[k].items;
    const feature = {
      itemType:featureBlockId,
      name:{
        sv: featureMapItems[k].sv || null,
        en: featureMapItems[k].en || null
      }
    }

    //return console.log(JSON.stringify(products[0].models[0], null, 4));
    //return console.log(products[0].models[0].attributes.lightsources.map(l => ({...l.attributes})))

    const f = await datoClient.items.create(feature);
    const updates = []
    for (let x = 0; x < variantIds.length; x++) {
      const variantId = variantIds[x]
      let product;
       products.forEach(p => {
          p.models?.forEach( async m => {
            for(let z = 0;  m.attributes.variants && z < m.attributes.variants.length; z++){
              const v = m.attributes.variants[z];
              if(v.id !== variantId) continue
              updates.push({
                id:p.id, 
                data: {
                  models: p.models.map((model)=> buildModularBlock({
                    itemType: modelBlockId,
                    name:model.attributes.name,
                    drawing:model.attributes.drawing,
                    lightsources: model.attributes.lightsources.map(l => buildModularBlock({
                      itemType: lightsourceBlockId,
                      ...l.attributes,
                    })),
                    accessories: model.attributes.accessories.map(a => buildModularBlock({
                      itemType: accessoryBlockId,
                      ...a.attributes,
                    })),
                    variants: model.attributes.variants.map(v => buildModularBlock({
                      itemType: variantBlockId,
                      ...v.attributes,
                      feature: v.id === variantId ? f.id : v.attributes.feature,
                    }))
                  }))
                }
              });
            }
          })
       })
    }
    for (let q  = 0; q < updates.length; q++) {
      console.log(updates[q].id)
      await datoClient.items.update(updates[q].id, updates[q].data)
    }
  }
}



//return migrateSpecificFeature()


const migrateDesignersAgain = async () => {
  return console.log('designers...')
  wpapi.designer = wpapi.registerRoute('wp/v2', '/designer/(?P<id>)', english);
  wpapi.product = wpapi.registerRoute('wp/v2', '/product/(?P<id>)', english);
  
  const productsEn = await wpapi.product().perPage(100).page(1).param(english).param({status:'publish'})
  const products = await getAllRecords({
    nested:true,
    filter:{
      type: 'product'
    }
  });
  const designers = await wpapi.designer().perPage(100).param(english)
  const datoDesigners = await getAllRecords({
    filter:{
      type: 'designer'
    }
  });
  //console.log(productsEn[0])
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const wpP = productsEn.filter((prod) => prod.slug === p.slug)[0]
    if(!wpP) continue
    const designerSlug = wpP.acf.designer.post_name;
    const datoDesigner = datoDesigners.filter(d => d.slug === designerSlug)[0]
    console.log(datoDesigner.id)
    await datoClient.items.update(p.id, {designer:datoDesigner.id})
    

  }
  

  //p.acf.designer.post_name
  return
  return console.log(productsEn.map((p)=>p.acf.designer.post_name))
}

//return migrateDesignersAgain()

const migrateTaxonomies = async () => {
  console.log('Get all taxonomies...') 
  
  try {
    for (let i = 0; i < Object.keys(taxonomies).length; i++) {
      const k = Object.keys(taxonomies)[i];      
      wpapi['product'+k] = wpapi.registerRoute('wp/v2', `/product-${k}/(?P<id>)`);
      //const wpTaxMap = await importWpTaxMap(k)
      //const trids = Object.keys(wpTaxMap[k])
      const data = await wpapi['product'+k]().perPage(100).param(swedish)//.param({status:'publish'})
      const dataEn = await wpapi['product'+k]().perPage(100).param(english)//.param({status:'publish'})

      
      for (let i = 0; i < datoData.length; i++) {
        const item = datoData[i];
        try{
          const record = await datoClient.items.create({
            itemType: '' + taxonomies[k]._dato.id,
            ...item
          }); 
        } catch(err){
          
        }
        console.log(k, taxonomies[k]._dato.id, item)
        await wait(300)
      }
      
    }
    //await migrateDesigners()

  }catch(err){
    console.log(err)
    console.error('exist')
  }
  conn.end()
}

const migrateDesigners = async () => {
  console.log('Migrating designers...')
  
  wpapi.designer = wpapi.registerRoute('wp/v2', '/designer/(?P<id>)', {wpml_language:'en'});
  const designers = await wpapi.designer().perPage(100).param(english)
  const designersSv = await wpapi.designer().perPage(100).param(swedish)
  
  console.log(`Migrating ${designers.length} items...`)

  for (let i = 0; i < designers.length; i++) {
    const element = designers[i];
    const elementSv = designersSv[i];
    
    try{
      const upload = await migrateMedia(element.featured_media, ['designer'])
      const item = {
        itemType: '1765453',
        slug:element.slug,
        name:element.title.rendered,
        description: {
          en: turndownService.turndown(element.content.rendered),
          sv: turndownService.turndown(elementSv.content.rendered),
        },
        image:{
          upload_id:upload.id
        }
      }
      console.log('Add ' + item.name)
      const record = await datoClient.items.create(item); 

    } catch(err){
      console.log(err)
      console.log('failed')
    } 
    await wait(300) 
  }
}


const getWPTaxonomies = async () => {
  const t = {...taxonomies}
  for (let i = 0; i < Object.keys(t).length; i++) {
    const k = Object.keys(t)[i];
    wpapi['product'+k] = wpapi.registerRoute('wp/v2', `/product-${k}/(?P<id>)`);
    t[k].data = await wpapi['product'+k]().perPage(100).param(lang)
  }
  return t;
}

const getDatoTaxonomies = async () => {
  
  const types = ['designer','product_category','product_color','product_connection','product_dimmable','product_electrical','product_family','product_lightsource', 'product_material', 'product_mounting', 'product_socket']
  const tax = {}

  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    tax[types[i].replace('product_', '')] = await datoClient.items.all({filter: {type}, page:{limit:100}});
  }
  return tax
}

const generateTaxonomyMap = async () => {
  wpapi.designer = wpapi.registerRoute('wp/v2', '/designer/(?P<id>)', {wpml_language:'en'});
  const wpTaxonomy = {...await getWPTaxonomies(), designer:{data: await wpapi.designer().perPage(100).param(lang)}}
  const datoTaxonomy = await getDatoTaxonomies()
  const taxMap = {}

  wpTaxonomy['electrical'] = wpTaxonomy['electrical-data']
  delete wpTaxonomy['electrical-data']

  console.log('Creating taxonomy map...')
  Object.keys(wpTaxonomy).forEach(k => {  
    console.log(wpTaxonomy[k].data)
    wpTaxonomy[k].data.forEach((item, idx) => {
      const wpId = wpTaxonomy[k].data[idx].id
      const datoId = datoTaxonomy[k].filter((el)=> el.name.en === wpTaxonomy[k].data[idx].name ||  el.name.en === wpTaxonomy[k].data[idx].title?.rendered)[0]?.id
      if(!taxMap[k]) taxMap[k] = {}
      taxMap[k][wpId] = datoId
    })
  })
  return taxMap
}




const connectDb = async () =>{
  const mysql = require('mysql');
  const auth = {
    host:process.env.WP_DB_HOST,
    port: 3306,
    user: process.env.WP_DB_USERNAME,
    password: process.env.WP_DB_PASSWORD,
    database:process.env.WP_DB_DATABASE
  }
  
  if(!conn){
    conn = mysql.createConnection(auth)
    conn.connect()
  }
  return conn
}
const queryDb = async (sql) =>{
  const conn = await connectDb()
  return new Promise((resolve, reject)=>{
    conn.query(sql, (err, res, fields)=>{
      if(err) return reject(err)
      resolve(res.map((obj)=>({...obj})))
    });
  })
}
const importWpTaxMap = async (type) =>{

  const cats = Object.keys(taxonomies).map(k => 'tax_product-' + k)
  let sql = `SELECT * FROM wp_icl_translations WHERE element_type='${type ? `tax_product-${type}` : cats.join('\' OR element_type=\'')}'`
  //let sql = `SELECT * FROM wp_icl_translations`

  console.log(sql)

  const taxMap = {}
  const res = await queryDb(sql)
  //conn.end()

  for (let i = 0; i < res.length; i++) {
    const el = res[i];
    const k = el.element_type.replace('tax_product-', '')
    if(!taxMap[k]) taxMap[k] = {}
    if(!taxMap[k][el.trid]) taxMap[k][el.trid] = []
    taxMap[k][el.trid].push(el.element_id)
  }
  console.log(taxMap)
  return taxMap

}
//return importWpTaxMap()


const migrateAccessories = async () => {
  console.log('migrate access...')
  return
  /*
  const accessoryMap = {}
  const accessoryMapItems = {}

  wpapi.product = wpapi.registerRoute('wp/v2', '/product/(?P<id>)', english);
  let productsEn = await wpapi.product().perPage(100).page(1).param(english).param({status:'publish'})
  let productsSv = await wpapi.product().perPage(100).page(1).param(swedish).param({status:'publish'})

  productsEn.forEach((p)=> p.acf.model.forEach( m => {
    if(m.accessories){
      m.accessories.forEach(a => {
        if(!accessoryMap[a.product_no] && a.product_no)
          accessoryMap[a.product_no] = { slug:p.slug, en: a.product }
      })
    }
  }))
  productsSv.forEach((p)=> p.acf.model.forEach( m => {
    if(m.accessories){
      m.accessories.forEach(a => {
        if(!accessoryMap[a.product_no] && a.product_no)
          accessoryMap[a.product_no] = { slug:p.slug, sv: a.product }
        else if(accessoryMap[a.product_no] && a.product_no)
          accessoryMap[a.product_no].sv = a.product
      })
    }
  }))

  for (let i = 0; i < Object.keys(accessoryMap).length; i++) {
    const articleNo = Object.keys(accessoryMap)[i];
    const accessory = {
      itemType:accessoryModelId,
      name:{
        sv: accessoryMap[articleNo].sv || null,
        en: accessoryMap[articleNo].en || null,
        no:null
      },
      articleNo
    }
    console.log(accessory)
    const f = await datoClient.items.create(accessory);  
  }

  */


  const accessories = await getAllRecords({
    nested:true,
    filter:{
      type: 'product_accessory'
    }
  });

  const products = await getAllRecords({
    nested:true,
    filter:{
      type: 'product'
    }
  });
  
  const updates = []
  products.forEach(p => {
    p.models?.forEach( async m => {
      if(!m.attributes.accessories.length) return 
      updates.push({
        id:p.id, 
        data: {
          models: p.models.map((model)=> buildModularBlock({
            itemType: modelBlockId,
            name:model.attributes.name,
            drawing:model.attributes.drawing,
            lightsources: model.attributes.lightsources.map(l => buildModularBlock({
              itemType: lightsourceBlockId,
              ...l.attributes,
            })),
            accessories: model.attributes.accessories.map(a => buildModularBlock({
              itemType: accessoryBlockId,
              ...a.attributes,
              accessory: accessories.filter(el => a.attributes.articleNo && el.articleNo.trim() === a.attributes.articleNo.trim())[0]?.id || null
            })),
            variants: model.attributes.variants.map(v => buildModularBlock({
              itemType: variantBlockId,
              ...v.attributes
            }))
          }))
        }
      });
    })
  })
  for (let q  = 0; q < updates.length; q++) {
    console.log(updates[q].data)
    await datoClient.items.update(updates[q].id, updates[q].data)
  }
}

//return migrateAccessories()
