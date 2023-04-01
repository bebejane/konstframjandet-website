import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllNewsDocument } from "/graphql";
import { NewsCard, NewsContainer, Bubble } from "/components";
import { useState } from "react";

export type Props = {
  news: NewsRecord[]
}

export default function News({ news }: Props) {

  const [listView, setListView] = useState(true)

  return (
    <>
      <div className={cn(s.container, listView && s.list)}>
        <NewsContainer view={listView ? 'list' : 'full'}>
          {news.map(item =>
            <NewsCard key={item.id} news={item} view={listView ? 'list' : 'full'} />
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
        title: 'Aktuellt'
      }
    },
    revalidate
  }
})