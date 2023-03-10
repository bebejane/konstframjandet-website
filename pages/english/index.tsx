import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { DistrictDocument } from "/graphql";
import { MetaSection, Article } from "/components";

export type Props = {
  district: DistrictRecord
}

export default function English({ }: Props) {

  return (
    <>
      {/*
      <MetaSection>
      </MetaSection>
      <Article
        id={id}
        record={district}
        intro={intro}
        content={content}
      />
    */}
      English
    </>
  );
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'English'
      }
    },
    revalidate
  };
});