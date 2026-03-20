import s from './StartProject.module.scss';
import { ProjectContainer, ProjectCard } from '@/components';
import Link from '@/components/nav/Link';

export type Props = {
	data: StartProjectRecord;
};

export default function StartProject({ data: { projects } }: Props) {
	return (
		<section className={s.container}>
			<header className='mid'>
				<h2>Aktuella projekt</h2>
				<Link href={'/projekt'} className='mid'>
					Visa alla
				</Link>
			</header>
			<ProjectContainer>
				{projects.map((item, index) => (
					<ProjectCard key={item.id} project={item} index={index} total={projects.length} />
				))}
			</ProjectContainer>
		</section>
	);
}
