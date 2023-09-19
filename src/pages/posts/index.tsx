import styles from "./styles.module.scss";
import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import {
  FiChevronLeft,
  FiChevronsLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";

import { GetStaticProps } from "next";

//IMPORTAÇÃO PRISMIC
import { getPrismicClient } from "@/services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

type Post = {
  slug: string;
  title: string;
  cover: string;
  description: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts: postsBlog }: PostsProps) {
  //recebe todos os posts ou uma array vazia
  const [posts, setPosts] = useState(postsBlog || []);

  return (
    <>
      <Head>
        <title>Blog | Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}legacyBehavior>
              <a key={post.slug}>
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={720}
                  height={410}
                  quality={100}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO0cQ2sBwAC6gFTXnYA8wAAAABJRU5ErkJggg=="
                />
                <strong>{post.title}</strong>
                <time>{post.updatedAt}</time>
                <p>{post.description}</p>
              </a>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            <div>
              <button>
                <FiChevronsLeft size={25} color="#fff" />
              </button>
              <button>
                <FiChevronLeft size={25} color="#fff" />
              </button>
            </div>

            <div>
              <button>
                <FiChevronRight size={25} color="#fff" />
              </button>
              <button>
                <FiChevronsRight size={25} color="#fff" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  //PEGANDO O TIPO DE DOCUMENTO
  const response = await prismic.query(
    [Prismic.Predicates.at("document.type", "post")],
    {
      orderings: "[document.last_publication_date desc]", //Ordernar posts pelo mais recente
      fetch: ["post.title", "post.description", "post.cover"], //FILTANDO oque vai vir no response
      pageSize: 3, //delimitando uma quantidade de 3 posts por página
    }
  );

  // console.log(JSON.stringify(response, null, 2))

  const posts = response.results.map((post) => {
    return {
      slug: post.uid, //nome do post que ficar armazenado no uid do documento
      title: RichText.asText(post.data.title), //rich text, consome só o text
      description:
        post.data.description.find(
          (content: { type: string }) => content.type === "paragraph"
        )?.text ?? "", //buscando o paragráfo dentro da descrição
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ), //ultima vez que foi atualizado
    };
  });

  return {
    props: {
      posts,
    },
    revalidate: 60 * 30, //Atualiza a cada 30 minutos.
  };
};
