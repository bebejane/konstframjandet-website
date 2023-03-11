import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllNewsDocument } from "/graphql";
import { NewsCard, NewsContainer } from "/components";

export type Props = {
  news: NewsRecord[]
}

export default function News({ news }: Props) {

  return (
    <>
      <div className={s.container}>
        <NewsContainer>
          {news.map(item =>
            <NewsCard key={item.id} news={item} />
          )}
        </NewsContainer>
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