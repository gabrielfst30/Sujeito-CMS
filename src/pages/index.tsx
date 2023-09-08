import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../styles/home.module.scss";

import Image from "next/image";
import techsImage from "../../public/images/techs.svg";

//2 - IMPORTANDO O CLIENT DO PRISMIC
import { getPrismicClient } from "@/services/prismic";
//3 - IMPORTANDO O PRISMIC
import Prismic from "@prismicio/client";
//PARA PEGAR O TEXT DO PRISMIC MAIS FACIL COM O PRISMIC DOM
import { RichText } from 'prismic-dom'


//TIPAGEM DO OBJETO
type Content = {
  title: string, //ele pegará só o texto
  titleContent: string,
  linkAction: string,
  mobileTitle: string,
  mobileContent: string,
  mobileBanner: string,
  webTitle: string,
  webContent: string,
  webBanner: string,
}

//CRIANDO A INTERFACE CONTENT QUE É UM OBJETO
interface ContentProps{
  content: Content
}


export default function Home( { content }: ContentProps) {
  console.log(content)
  return (
    <>
      <Head>
        <title>Apaixonado por tecnologia - Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <span>
              {content.titleContent}
            </span>
            <a href={content.linkAction}>
              <button>COMEÇAR AGORA!</button>
            </a>
          </section>

          <img
            src="/images/banner-conteudos.png"
            alt="Conteúdos Sujeito Programador"
          />
        </div>
        <hr className={styles.divisor} />

        <div className={styles.sectionContent}>
          <section>
            <h2>{content.mobileTitle}</h2>
            <span>
              {content.mobileContent}
            </span>
          </section>

          <img
            src={content.mobileBanner}
            alt="Conteúdos desenvolvimento de apps"
          />
        </div>

        <hr className={styles.divisor} />

        <div className={styles.sectionContent}>
          <img
            src={content.webBanner}
            alt="Conteúdos desenvolvimento de aplicações web"
          />

          <section>
            <h2>{content.webTitle}</h2>
            <span>
              {content.webContent}
            </span>
          </section>
        </div>

        <div className={styles.lvlContent}>
          <Image quality={100} src={techsImage} alt="Tecnologias" />
          <h2>
            Mais de <span className={styles.alunos}>15 mil</span> ja levaram sua
            carreira ao próximo nível.
          </h2>
          <span>
            E você vai perder a chance de evoluir de uma vez por todas?
          </span>
          <a href={content.linkAction}>
            <button>ACESSAR TURMA!</button>
          </a>
        </div>
      </main>
    </>
  );
}

//1 UTILIZANDO STATIC PROPS PARA CONSUMIR A API NUMA PAGINA ESTATICA (LADO SERVIDOR)
export const getStaticProps: GetStaticProps = async () => {
  //INSTANCIANDO O CLIENT
  const prismic = getPrismicClient();

  //CONSUMINDO A API
  const response = await prismic.query([
    //AQUI EU PEGO TUDO QUE VEM NO DOCUMENT.TYPE CHAMADO HOME
    Prismic.Predicates.at("document.type", "home"),
  ]);

  //log especial para ver os resultados do response do document
  // console.log(response.results[0].data);

  //COLOCANDO O RESPONSE EM CONSTANTES PARA CONSUMIR 
  const {
    title,
    sub_title,
    link_action,
    mobile,
    mobile_content,
    mobile_banner,
    title_web,
    web_content,
    web_banner,
  } = response.results[0].data;

  //CRIANDO UM OBJETO E PEGANDO O CONTEÚDO A PARTIR DAS CONSTANTES CRIADAS
  const content = {
    title: RichText.asText(title), //ele pegará só o texto
    titleContent: RichText.asText(sub_title),
    linkAction: link_action.url,
    mobileTitle: RichText.asText(mobile),
    mobileContent: RichText.asText(mobile_content),
    mobileBanner: mobile_banner.url,
    webTitle: RichText.asText(title_web),
    webContent: RichText.asText(web_content),
    webBanner: web_banner.url,
  }

  return {
    props: {
      content //retornando a constante para o StaticProps
    },
    revalidate: 60 * 2 //A cada 2 minutos a pagina será re-gerada
  };
};
