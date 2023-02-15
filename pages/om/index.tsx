import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { AllAboutsDocument } from "/graphql";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect } from "react";

export type Props = {
  abouts: AboutRecord[]
}

export default function About({ abouts }: Props) {

  return (
    <>
      <h1 className="noPadding">Om</h1>
      <div className={s.container}>
        <ul>
          {abouts.length > 0 ? abouts.map(({ id, title, slug }, idx) =>
            <li key={id} >
              <Link href={`/om/${slug}`}>{title}</Link>
            </li>
          ) :
            <>Det finns inga Om...</>
          }
        </ul>
      </div>
    </>
  );
}

//News.page = { title: 'Nyheter' } as PageProps

export const getStaticProps: GetStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const { abouts } = await apiQuery(AllAboutsDocument)

  return {
    props: {
      ...props,
      abouts
    },
    revalidate
  };
});