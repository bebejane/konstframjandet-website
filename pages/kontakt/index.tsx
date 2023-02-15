import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect } from "react";

export type Props = {

}

export default function Contact({ }: Props) {

  return (
    <>
      <h1 className="noPadding">Kontakt</h1>
    </>
  );
}

//News.page = { title: 'Nyheter' } as PageProps

export const getStaticProps: GetStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  return {
    props,
    revalidate
  };
});