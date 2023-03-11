import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { DistrictDocument } from "/graphql";
import { Aside, Article } from "/components";

export type Props = {
  district: DistrictRecord
}

export default function English({ }: Props) {

  return (
    <>
      {/*
      <Aside>
      </Aside>
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