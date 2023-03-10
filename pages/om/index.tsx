import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllAboutsDocument } from "/graphql";
import Link from "next/link";
import { MetaSection, Article } from "/components";

export type Props = {
  abouts: AboutRecord[]
}

export default function About({ abouts }: Props) {

  return (
    <>
      <MetaSection>
        <ul>
          {abouts.length > 0 ? abouts.map(({ id, title, slug }, idx) =>
            <li key={id} >
              <Link href={`/om/${slug}`}>{title}</Link>
            </li>
          ) :
            <>Det finns inga Om...</>
          }
        </ul>
      </MetaSection>
      <Article
        id={'id'}

        intro={'intro'}
        //content={content}
        record={{}}

      />
    </>

  );
}

export const getStaticProps = withGlobalProps({ queries: [AllAboutsDocument] }, async ({ props, revalidate }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'Om oss'
      }
    },
    revalidate
  };
});