import s from './NewsContainer.module.scss';
import cn from 'classnames';

export type Props = {
	children?: React.ReactNode | React.ReactNode[];
	view?: 'list' | 'full';
};

export default function NewsContainer({ children, view = 'full' }: Props) {
	return <ul className={cn(s.container, view === 'list' && s.list)}>{children}</ul>;
}
