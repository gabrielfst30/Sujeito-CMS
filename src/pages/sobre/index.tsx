import { GetStaticProps } from "next";

import Head from "next/head";
import styles from "./styles.module.scss";

//api prismic
import { getPrismicClient } from "@/services/prismic";
//client prismic
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { FaYoutube, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

//tipando a propriedade content
type Content = {
  title: string;
  description: string;
  banner: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
};

//recebendo a tipagem das propriedades do content
interface ContentProps {
  content: Content;
}

export default function Sobre({ content }: ContentProps) {
  return (
    <>
      <Head>
        <title>Quem somos?</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <a href={content.facebook}>
              <FaFacebook size={40} />
            </a>
            <a href={content.instagram}>
              <FaInstagram size={40} />
            </a>
            <a href={content.youtube}>
              <FaYoutube size={40} />
            </a>
            <a href={content.linkedin}>
              <FaLinkedin size={40} />
            </a>
          </section>

          <img src={content.banner} alt="sobre Sujeito Programador" />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //só e necessário passar req qnd for server-side
  const prismic = getPrismicClient();

  //chamando o documento criado de nome "about"
  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "about"),
  ]);

  //desestruturando o response
  const { title, description, banner, facebook, instagram, youtube, linkedin } =
    response.results[0].data;

  //montando novo objeto content
  const content = {
    title: RichText.asText(title),
    description: RichText.asText(description),
    banner: banner.url,
    facebook: facebook.url,
    instagram: instagram.url,
    youtube: youtube.url,
    linkedin: linkedin.url,
  };

  //retornando as propriedades para pegarmos no parametro
  return {
    props: {
      content,
    },
    //sem o revalidade, nao ocorrerá atualizaçao na pagina sem build
    revalidate: 60 * 15 //a cada 15 minutos será revalidado
  };
};
