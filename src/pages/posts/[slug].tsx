import { GetServerSideProps } from "next";
import styles from "./post.module.scss";

import { getPrismicClient } from "@/services/prismic";
import { RichText } from "prismic-dom";

interface PostProps{
    post:{
        slug: string;
        title: string;
        description: string;
        cover: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostProps ){

console.log(post)

  return (
    <div>
      <h1>DETALHE DO POST</h1>
    </div>
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
