import s from './page.module.scss';
import cn from 'classnames';
import { AllProjectsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { ProjectContainer, ProjectCard, SectionHeader } from '@/components';
import { notFound } from 'next/navigation';
import { apiQuery } from 'next-dato-utils/api';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/[subdomain]/layout';

export type Props = {
	projects: ProjectRecord[];
	completedProjects: ProjectRecord[];
};

export default async function Projects({ params }: PageProps<'/[subdomain]/projekt'>) {
	const { subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	if (!district) return notFound();

	const { allProjects } = await apiQuery(AllProjectsDocument, {
		all: true,
		variables: { districtId: district.id },
	});
	const projects = allProjects.filter(({ completed }) => !completed);
	const completedProjects = allProjects.filter(({ completed }) => completed);

	return (
		<>
			<SectionHeader title={'Aktuella projekt'} layout='project' />
			<article>
				<div className={s.container}>
					<ProjectContainer>
						{projects.map((item, idx) => (
							<ProjectCard
								key={idx}
								project={item as ProjectRecord}
								index={idx}
								total={projects.length}
							/>
						))}
						{projects.length === 0 && (
							<p className={s.noProjects}>Det finns inga aktuella projekt just nu.</p>
						)}
					</ProjectContainer>
					{completedProjects.length > 0 && (
						<>
							<h2 className={cn('big', s.completed)}>Avslutade projekt</h2>
							<ProjectContainer>
								{completedProjects.map((item, idx) => (
									<ProjectCard
										key={idx}
										project={item as ProjectRecord}
										index={idx}
										total={completedProjects.length}
									/>
								))}
							</ProjectContainer>
						</>
					)}
				</div>
			</article>
		</>
	);
}
export async function generateMetadata({
	params,
}: PageProps<'/[subdomain]/projekt'>): Promise<Metadata> {
	const { subdomain } = await params;
	return await buildMetadata({
		title: 'Aktuella projekt',
		pathname: `/projekt`,
		subdomain,
	});
}
