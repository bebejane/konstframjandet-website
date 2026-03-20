import * as Components from '@/components';

export type BlockProps = {
	data: any;
	record: any;
};

export default function Block({ data, record }: BlockProps) {
	const type = data.__typename.replace('Record', '');
	const BlockComponent = Components[type as keyof typeof Components];

	if (!BlockComponent) return <div>No block match {data.__typename}</div>;

	return <BlockComponent id={record.id} data={data} record={record} />;
}
