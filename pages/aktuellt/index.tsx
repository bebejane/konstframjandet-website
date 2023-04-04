import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllNewsDocument } from "/graphql";
import { NewsCard, NewsContainer, Bubble } from "/components";
import useStore from "/lib/store";

export type Props = {
  news: NewsRecord[]
}

export default function News({ news }: Props) {

  const [view] = useStore((state) => [state.view])

  return (
    <>
      <div className={cn(s.container, view && s.list)}>
        <NewsContainer view={view}>
          {news.map(item =>
            <NewsCard
              key={item.id}
              news={item}
              view={view}
            />
          )}
        </NewsContainer>
        <Bubble className={s.more}>Fler</Bubble>
      </div>
    </>
  );
}


export const getStaticProps = withGlobalProps({ queries: [AllNewsDocument] }, async ({ props, revalidate, context }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'Aktuellt',
        layout: 'news'
      } as PageProps
    },
    revalidate
  }
})