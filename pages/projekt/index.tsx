import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllProjectsDocument } from "/graphql";
import { ProjectContainer, ProjectCard } from "/components";

import Link from "next/link";

export type Props = {
  projects: ProjectRecord[]
}

export default function Projects({ projects }: Props) {

  return (
    <div className={s.container}>
      <ProjectContainer>
        {projects.map((item, idx) =>
          <ProjectCard key={idx} project={item} />
        )}
      </ProjectContainer>
    </div>
  );
}

export const getStaticProps = withGlobalProps({ queries: [AllProjectsDocument] }, async ({ props, revalidate }: any) => {

  return {
    props: {
      ...props,
      pageTitle: 'Projekt'
    },
    revalidate
  };
});