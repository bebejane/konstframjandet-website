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

//News.page = { title: 'Nyheter' } as PageProps

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  return {
    props
  };
});