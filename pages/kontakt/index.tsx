import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";

export type Props = {

}

export default function Contact({ }: Props) {

  return (
    <>
      Kontakt
    </>
  );
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'Kontakt'
      }
    },
    revalidate
  };
});