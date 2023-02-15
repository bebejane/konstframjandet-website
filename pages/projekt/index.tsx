import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { AllProjectsDocument } from "/graphql";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect } from "react";

export type Props = {
  projects: ProjectRecord[]
}

export default function Projects({ projects }: Props) {

  return (
    <>
      <h1 className="noPadding">Projekt</h1>
      <div className={s.container}>
        <ul>
          {projects.length > 0 ? projects.map(({ id, title, slug }, idx) =>
            <li key={id} >
              <Link href={`/projekt/${slug}`}>{title}</Link>
            </li>
          ) :
            <>Det finns inga projekt...</>
          }
        </ul>
      </div>
    </>
  );
}

//News.page = { title: 'Nyheter' } as PageProps

export const getStaticProps: GetStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const { projects } = await apiQuery(AllProjectsDocument)

  return {
    props: {
      ...props,
      projects
    },
    revalidate
  };
});