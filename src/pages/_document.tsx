import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,900;1,700&display=swap" rel="stylesheet" />
      <link rel="shortcut icon" href="/favicon.png" type='image/png' />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

