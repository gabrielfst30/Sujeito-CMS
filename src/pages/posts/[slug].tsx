import { GetServerSideProps } from "next";
import styles from "./post.module.scss";

import { getPrismicClient } from "@/services/prismic";
import { RichText } from "prismic-dom";

import Head from "next/head";
import Image from "next/image";

//tipagem do post
interface PostProps {
  post: {
    slug: string;
    title: string;
    description: string;
    cover: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <Image
            quality={100}
            src={post.cover}
            width={720}
            height={410}
            alt={post.title}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO0cQ2sBwAC6gFTXnYA8wAAAABJRU5ErkJggg=="
          />
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          {/* dangerous seta um html dentro da div */}
          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.description }}></div>
        </article>
      </main>
    </>
  );
}

//server-side
export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;
  //dentro do server side é necessario passar a req para o prismic client
  const prismic = getPrismicClient(req);

  //query de buscar meu post pelo UID para ter o post exato
  const response = await prismic.getByUID("post", String(slug), {});

  //caso o response nao retorne nada, para nao quebrar a aplicaçao redirecionamos para posts
  if (!response) {
    return {
      redirect: {
        destination: "/posts",
        permanent: false,
      },
    };
  }

  //desconstruindo response e formatando para a const post
  const post = {
    slug: slug,
    title: RichText.asText(response.data.title),
    description: RichText.asHtml(response.data.description),
    cover: response.data.cover.url,
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  console.log(response.data);
  console.log(slug);

  return {
    props: {
      post
    },
  };
};
