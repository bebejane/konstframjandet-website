import { apiQuery, SEOQuery } from "dato-nextjs-utils/api";
import { GetStaticProps, GetServerSideProps } from 'next'
import { AllDistricsDocument, GlobalDocument } from "/graphql";
import type { TypedDocumentNode } from "@apollo/client/core/types.js";
import { buildMenu } from "/lib/menu";

export default function withGlobalProps(opt: any, callback: Function): GetStaticProps | GetServerSideProps {

  const revalidate: number = parseInt(process.env.REVALIDATE_TIME)
  const queries: TypedDocumentNode[] = [GlobalDocument]

  if (opt.query)
    queries.push(opt.query)
  if (opt.queries)
    queries.push.apply(queries, opt.queries)
  if (opt.seo)
    queries.push(SEOQuery(opt.seo))

  return async (context) => {

    // Avoid invalid district paths
    if (context.params?.district && isInvalidDistrictPath(context.params?.district))
      return { notFound: true };

    const { districts } = await apiQuery(AllDistricsDocument)
    const district = districts.find(({ subdomain }) => context.params?.district ? subdomain === context.params?.district : subdomain === context.locale)

    if (!district)
      return { notFound: true };

    const variables = queries.map(el => ({ districtId: district.id }))
    const props = await apiQuery(queries, { variables, preview: context.preview });
    const subdomain = context.locale || null

    props.menu = await buildMenu(district.id)
    props.district = props.district ?? districts.find(el => el.subdomain === subdomain) ?? null
    props.districts = districts
    props.subdomain = subdomain

    if (callback)
      return await callback({ context, props: { ...props }, revalidate });
    else
      return { props: { ...props }, context, revalidate };
  }
}

const isInvalidDistrictPath = (path: string) => {
  return ['.', '.php', 'wp-content'].some(el => path.includes(el))
}