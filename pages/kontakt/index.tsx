import withGlobalProps from "/lib/withGlobalProps";
import { DistrictDocument } from "/graphql";
import { Aside, Article, NewsletterForm } from "/components";

export type Props = {
  district: DistrictRecord
}

export default function Contact({ district: { id, intro, contentContact }, district }: Props) {

  return (
    <>
      <Aside hideOnMobile={true}>
      </Aside>
      <Article
        id={id}
        record={district}
        intro={intro}
        content={contentContact}
      />
      <NewsletterForm />
    </>
  );
}

export const getStaticProps = withGlobalProps({ queries: [DistrictDocument] }, async ({ props, revalidate, context }: any) => {

  return {
    props: {
      ...props,
      page: {
        layout: 'contact',
        title: 'Kontakta oss'
      }
    },
    revalidate
  };
});