import { mainDistrict } from '@/lib/utils';
import { apiQuery } from 'next-dato-utils/api';
import {
	ProjectDocument,
	ProjectSubpageDocument,
	ProjectBySubpageDocument,
	AllProjectsDocument,
	DistrictBySubdomainDocument,
} from '@/graphql';
import { Aside, Article, SideMenu, SectionHeader } from '@/components';
import { ProjectWebpage } from './ProjectWebpage';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/[subdomain]/layout';

export type Props = {
	project: ProjectRecord | ProjectSubpageRecord;
	parentProject?: ProjectRecord;
	projectMenu: {
		id: string;
		slug: string;
		title: string;
	}[];
};

export default async function ProjectItem({
	params,
}: PageProps<'/[subdomain]/projekt/[...project]'>) {
	const { project, parentProject, projectMenu, projectColor, colorOption } = await getData(params);
	if (!project) return notFound();

	const { id, title, image, intro, subtitle, content, _seoMetaTags } = project;

	return (
		<>
			<SectionHeader
				title={title}
				layout='project'
				image={image as FileField}
				intro={intro}
				color={projectColor}
				colorOption={colorOption}
			/>
			<article>
				<Aside
					title={parentProject?.title ?? project.title}
					titleHref={parentProject ? `/projekt/${parentProject.slug}` : undefined}
					backLink={'/projekt'}
					backLinkType={'projekt'}
				>
					{projectMenu.length > 0 && <SideMenu items={projectMenu as any} />}
				</Aside>
				<Article
					id={id}
					content={content}
					intro={intro}
					imageCaption={image?.title}
					subtitle={subtitle}
					backLink={'/projekt'}
					seo={_seoMetaTags}
				/>
				{project.__typename === 'ProjectRecord' && project.webpage && (
					<ProjectWebpage href={project.webpage} color={projectColor}>
						Besök projektets hemsida
					</ProjectWebpage>
				)}
			</article>
		</>
	);
}

export async function generateStaticParams() {
	const district = await mainDistrict();
	const { allProjects } = await apiQuery(AllProjectsDocument, {
		variables: { districtId: district.id },
	});

	const paths: { project: string[] }[] = [];
	allProjects.forEach(({ slug, subpage }) =>
		paths.push({ project: [slug, ...subpage.map(({ slug: subslug }) => subslug)] }),
	);

	return paths;
}

export async function generateMetadata({
	params,
}: PageProps<'/[subdomain]/projekt/[...project]'>): Promise<Metadata> {
	const { project, subdomain } = await getData(params);

	return await buildMetadata({
		title: project?.title,
		pathname: `/projekt/${project.slug}`,
		subdomain,
		image: project?.image as FileField,
		description: project?.intro,
	});
}

async function getData(params: PageProps<'/[subdomain]/projekt/[...project]'>['params']) {
	const { project: _project, subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	const isSubpage = _project.length === 2;
	const slug = _project[!isSubpage ? 0 : 1];
	const districtId = district?.id;
	const { project } = await apiQuery(!isSubpage ? ProjectDocument : ProjectSubpageDocument, {
		variables: { slug, districtId },
	});

	if (!project) return notFound();

	let parentProject: ProjectRecord | null = null;

	if (isSubpage) {
		const res = await apiQuery(ProjectBySubpageDocument, {
			variables: { subpageId: project.id, districtId },
		});
		parentProject = res?.project as ProjectRecord | null;
	}
	const subpages =
		project.__typename === 'ProjectRecord' ? project?.subpage : parentProject?.subpage;

	const projectMenu =
		subpages?.map(({ id, title, slug }) => ({
			id,
			title,
			slug: `/projekt/${isSubpage ? parentProject?.slug : project.slug}/${slug}`,
		})) ?? [];

	const projectColor =
		parentProject?.color?.hex ??
		(project.__typename === 'ProjectRecord' ? project.color?.hex : null);

	const colorOption = project.colorOption ?? parentProject?.colorOption ?? null;

	return { project, parentProject, projectMenu, projectColor, colorOption, subdomain };
}
