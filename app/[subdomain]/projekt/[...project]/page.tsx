import s from './page.module.scss';
import cn from 'classnames';
import { mainDistrict } from '@/lib/utils';
import { apiQuery } from 'next-dato-utils/api';
import {
	ProjectDocument,
	ProjectSubpageDocument,
	ProjectBySubpageDocument,
	AllProjectsDocument,
	DistrictBySubdomainDocument,
} from '@/graphql';
import { Aside, Article, SideMenu, Bubble } from '@/components';
//import { useEffect, useState } from 'react';
//import { usePage } from '@/lib/context/page';
//import { useRouter } from 'next/router';
//import { useScrollInfo } from 'dato-nextjs-utils/hooks';

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
	const { project: _project, subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	const isSubpage = _project.length === 2;
	const slug = _project[!isSubpage ? 0 : 1];
	const districtId = district?.id;
	const { project } = await apiQuery(!isSubpage ? ProjectDocument : ProjectSubpageDocument, {
		variables: { slug, districtId },
	});

	if (!project) return { notFound: true };

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

	const showWebPage = true;

	// const { asPath } = useRouter();
	// const { isHome, district, color } = usePage();
	// const { scrolledPosition, documentHeight, viewportHeight } = useScrollInfo();
	// const [showWebPage, setShowWebPage] = useState(true);

	// useEffect(() => {
	//   const r = document.querySelector<HTMLElement>(':root')
	//   setTimeout(() => { // Override _app styling
	//     r.style.setProperty('--page-color', color ?? district?.color?.hex);
	//   }, 30)

	// }, [isHome, project, parentProject, asPath])

	// useEffect(() => {
	//   const footer = document.getElementById('footer')
	//   const { height } = footer?.getBoundingClientRect() ?? { height: 0 }
	//   const threshold = (documentHeight - height - viewportHeight) - 100
	//   setShowWebPage(scrolledPosition < threshold)
	// }, [scrolledPosition])

	const { id, title, image, content, _seoMetaTags } = project;

	return (
		<>
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
				title={title}
				content={content}
				imageCaption={image?.title}
				backLink={'/projekt'}
				seo={_seoMetaTags}
			/>
			{project.__typename === 'ProjectRecord' && project.webpage && showWebPage && (
				<Bubble href={project.webpage} className={s.direct}>
					Besök projektets hemsida
				</Bubble>
			)}
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

// export const getStaticProps = withGlobalProps(
// 	{ queries: [] },
// 	async ({ props, revalidate, context }: any) => {
// 		const isSubpage = context.params.project.length === 2;
// 		const slug = context.params.project[!isSubpage ? 0 : 1];
// 		const districtId = props.district?.id;
// 		const { project }: { project: ProjectRecord | ProjectSubpageRecord } = await apiQuery(
// 			!isSubpage ? ProjectDocument : ProjectSubpageDocument,
// 			{ variables: { slug, districtId }, preview: context.preview },
// 		);

// 		if (!project) return { notFound: true };

// 		let parentProject: ProjectRecord = null;

// 		if (isSubpage)
// 			parentProject =
// 				(
// 					await apiQuery(ProjectBySubpageDocument, {
// 						variables: { subpageId: project.id, districtId },
// 						preview: context.preview,
// 					})
// 				)?.project ?? null;

// 		const subpages =
// 			project.__typename === 'ProjectRecord' ? project?.subpage : parentProject?.subpage;
// 		const projectMenu = !subpages
// 			? []
// 			: subpages.map(({ id, title, slug }) => ({
// 					id,
// 					title,
// 					slug: `/projekt/${isSubpage ? parentProject.slug : project.slug}/${slug}`,
// 				}));

// 		const projectColor =
// 			parentProject?.color?.hex ??
// 			(project.__typename === 'ProjectRecord' ? project.color?.hex : null);

// 		return {
// 			props: {
// 				...props,
// 				project,
// 				parentProject,
// 				projectMenu,
// 				page: {
// 					title: project.title,
// 					subtitle: project.subtitle,
// 					image: project.image,
// 					intro: project.intro,
// 					layout: 'project',
// 					color: projectColor,
// 					colorOption: project.colorOption ?? parentProject?.colorOption ?? null,
// 				},
// 			},
// 			revalidate,
// 		};
// 	},
// );
