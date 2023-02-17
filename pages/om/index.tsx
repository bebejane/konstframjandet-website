import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { apiQueryAll } from "/lib/utils";
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

export const getServerSideProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const { abouts } = await apiQueryAll(AllAboutsDocument, { variables: { districtId: props.district.id } })

  return {
    props: {
      ...props,
      abouts
    }
  };
});

export const config = {
  runtime: 'experimental-edge'
}