'use client';
import useStore, { useShallow } from '@/lib/store';
import s from './NewsContainer.module.scss';
import cn from 'classnames';

export type Props = {
	children?: React.ReactNode | React.ReactNode[];
};

export default function NewsContainer({ children }: Props) {
	const [view] = useStore(useShallow((state) => [state.view]));
	return <ul className={cn(s.container, view === 'list' && s.list)}>{children}</ul>;
}
