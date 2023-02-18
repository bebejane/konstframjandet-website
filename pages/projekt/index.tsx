import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { apiQueryAll } from "/lib/utils";
import { AllProjectsTreeDocument } from "/graphql";

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

  const { projects } = await apiQueryAll(AllProjectsTreeDocument, { variables: { districtId: props.district.id } })

  return {
    props: {
      ...props,
      projects
    }
  };
});