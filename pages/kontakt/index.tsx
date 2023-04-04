import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { DistrictDocument } from "/graphql";
import { Aside, Article } from "/components";

export type Props = {
  district: DistrictRecord
}

export default function Contact({ district: { id, intro, contentContact }, district }: Props) {

  return (
    <>
      <Aside>
      </Aside>
      <Article
        id={id}
        record={district}
        intro={intro}
        content={contentContact}
      />
      <div className={s.newsletter}>
        <h2>Nyhetsbrev</h2>
        <p>
          Anmäl dig till vårt nyhetsbrev för att få information om våra utställningar och projekt,
          och tips på andra konstrelaterade händelser.
        </p>
        <input type="email" placeholder="E-post address..." />
        <button>Skicka</button>
      </div>
    </>
  );
}

export const getStaticProps = withGlobalProps({ queries: [DistrictDocument] }, async ({ props, revalidate, context }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'Kontakta oss'
      }
    },
    revalidate
  };
});