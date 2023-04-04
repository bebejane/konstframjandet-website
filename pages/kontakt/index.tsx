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
        <p className="mid">Nyhetsbrev</p>
        <p className="body-small">
          Anmäl dig till vårt nyhetsbrev för att få information om våra utställningar och projekt,
          och tips på andra konstrelaterade händelser.
        </p>

        <form
          action="//konstframjandet.us3.list-manage.com/subscribe/post?u=8b6aeb8402131fab41dc9e52c&amp;id=94772b4952"
          method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate"
          target="_blank" novalidate>
          <input type="email" value="" placeholder="Din epostadress" name="EMAIL" class="required email"
            id="mce-EMAIL" />
          <div id="mce-responses" class="clear">
            <div id="mce-error-response" style="display:none"></div>
            <div id="mce-success-response" style="display:none"></div>
          </div>
          <div style="position: absolute; left: -5000px;"><input type="text"
            name="b_8b6aeb8402131fab41dc9e52c_94772b4952" tabindex="-1"
            value="" /></div>
          <input type="submit" value="Skicka" name="subscribe" id="mc-embedded-subscribe"
            class="button" /></form>



        <input type="email" placeholder="E-post address..." />
        <button className="small">Skicka</button>
      </div >
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