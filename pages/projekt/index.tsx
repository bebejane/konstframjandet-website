import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllProjectsDocument } from "/graphql";

import Link from "next/link";

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

export const getStaticProps = withGlobalProps({ queries: [AllProjectsDocument] }, async ({ props, revalidate }: any) => {

  return {
    props,
    revalidate
  };
});