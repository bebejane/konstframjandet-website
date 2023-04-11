import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllProjectsDocument } from "/graphql";
import { ProjectContainer, ProjectCard } from "/components";

export type Props = {
  projects: ProjectRecord[]
  completedProjects: ProjectRecord[]
}

export default function Projects({ projects, completedProjects }: Props) {

  return (
    <>
      <div className={s.container}>
        <ProjectContainer>
          {projects.map((item, idx) =>
            <ProjectCard key={idx} project={item} index={idx} total={projects.length} />
          )}
        </ProjectContainer>
        {completedProjects.length > 0 &&
          <>
            <h2 className={cn('big', s.completed)}>Avslutade projekt</h2>
            <ProjectContainer>
              {completedProjects.map((item, idx) =>
                <ProjectCard key={idx} project={item} index={idx} total={completedProjects.length} />
              )}
            </ProjectContainer>
          </>
        }
      </div>
    </>
  );
}

export const getStaticProps = withGlobalProps({ queries: [AllProjectsDocument] }, async ({ props, revalidate }: any) => {

  return {
    props: {
      ...props,
      projects: props.projects.filter(({ completed }) => !completed),
      completedProjects: props.projects.filter(({ completed }) => completed),
      page: {
        title: 'Aktuella projekt'
      }
    },
    revalidate
  };
});