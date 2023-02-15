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
          {news.length > 0 ? news.map(({ id, title }, idx) =>
            <li key={id} >
              - {title}
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

export const getStaticProps: GetStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const { news } = await apiQuery(AllNewsDocument)

  return {
    props: {
      ...props,
      news
    },
    revalidate
  };
});