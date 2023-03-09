import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { AllNewsDocument } from "/graphql";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect } from "react";
import { NewsCard, NewsContainer } from "/components";

export type Props = {
  news: NewsRecord[]
}

export default function News({ news }: Props) {

  return (
    <>
      <div className={s.container}>
        <NewsContainer>
          {news.map(item =>
            <NewsCard news={item} />
          )}
        </NewsContainer>
      </div>
    </>
  );
}


export const getStaticProps = withGlobalProps({ queries: [AllNewsDocument] }, async ({ props, revalidate, context }: any) => {

  return {
    props: {
      ...props,
      pageTitle: 'Aktuellt'
    },
    revalidate
  }
})