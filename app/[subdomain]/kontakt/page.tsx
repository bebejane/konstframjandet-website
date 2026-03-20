import { DistrictBySubdomainDocument, DistrictDocument } from "@/graphql";
import { Aside, Article, NewsletterForm } from '@/components';
import { apiQuery } from "next-dato-utils/api";
import { notFound } from "next/navigation";

export default async function Contact({ params }: PageProps<'/[subdomain]/kontakt'>) {
const { subdomain } = await params
  const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } })
  if(!district) return notFound()
  const { id, contentContact, intro, _seoMetaTags } = district

  return (
    <>
      <Aside hideOnMobile={true}/>
      <Article
        id={id}
        record={district}
        intro={intro}
        content={contentContact}
        seo={_seoMetaTags}
      />
      <NewsletterForm />
    </>
  );
}