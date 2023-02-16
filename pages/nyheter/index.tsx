import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { AllNewsDocument } from "/graphql";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect } from "react";

export type Props = {
  news: NewsRecord[]
}

export default function News({ news }: Props) {

  return (
    <>
      <h1 className="noPadding">Nyheter</h1>
      <div className={s.container}>
        <ul>
          {news.length > 0 ? news.map(({ id, title, slug }, idx) =>
            <li key={id} >
              <Link href={`/nyheter/${slug}`}>{title}</Link>
            </li>
          ) :
            <>Det finns inga nyheter...</>
          }
        </ul>
      </div>
    </>
  );
}

//News.page = { title: 'Nyheter' } as PageProps

/*
export const getServerSideProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const { news } = await apiQuery(AllNewsDocument)

  return {
    props: {
      ...props,
      news
    }
  };
});
*/

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
  const { news } = await apiQuery(AllNewsDocument, { variables: { districtId: props.district.id } })

  return {
    props: {
      ...props,
      news
    },
    revalidate
  }
})