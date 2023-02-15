import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { AllProjectsTreeDocument } from "/graphql";
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
          {projects.length > 0 ? projects.map(({ id, title, slug, children }, idx) =>
            <li key={id} >
              <Link href={`/projekt/${slug}`}>{title}</Link>
              {children &&
                <ul>
                  {children.map(({ id, title, slug }) =>
                    <li>- <Link href={`/projekt/${slug}`}>{title}</Link></li>
                  )}
                </ul>
              }
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

export const getServerSideProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const { projects } = await apiQuery(AllProjectsTreeDocument)

  return {
    props: {
      ...props,
      projects
    }
  };
});

export const config = {
  runtime: 'experimental-edge'
}