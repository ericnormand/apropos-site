import Head from "next/head";

export async function getStaticPaths() {
  const fs = require("fs");
  const { join } = require("path");
  const episodesPath = join(process.cwd(), "data", "episodes.json");
  const fileContents = fs.readFileSync(episodesPath, "utf8");
  const episodes = JSON.parse(fileContents);

  return {
    paths: episodes.map((_, i) => ({ params: { id: `${i + 1}` } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const id = params.id;
  const fs = require("fs");
  const { join } = require("path");
  const episodesPath = join(process.cwd(), "data", "episodes.json");
  const fileContents = fs.readFileSync(episodesPath, "utf8");
  const episodes = JSON.parse(fileContents);

  const episode = episodes[id - 1];
  return {
    props: {
      episode,
      devMode: process.env.NODE_ENV === "development",
    },
  };
}

function VimeoEmbed({ id }) {
  if (!id) return <p>Video Coming Soon</p>;
  return (
    <iframe
      src={`https://player.vimeo.com/video/${id}`}
      width="640"
      height="360"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    ></iframe>
  );
}

function parseDate(date) {
  const [_, y, m, d] = date.match(/(\d\d\d\d)(\d\d)(\d\d)/);
  return `${y}-${m}-${d}`;
}

const URL =
  /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

function htmlize(s) {
  const groups = s.split(/\n\s*\n/);
  const paras = groups
    .map((g) => `<p>${g}</p>`)
    .map((g) => g.replace(URL, (m) => `<a href="${m}">${m}</a>`));
  return paras.join("");
}
export default function Home({ episode }) {
  return (
    <>
      <Head>
        <title>{episode.title} | Apropos Cast</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="prose mx-auto lg:prose-lg">
        <h1>Apropos Clojure</h1>
        <p>A show about Clojure.</p>
        <p>
          <a href="/">See all episodes.</a>
        </p>
        <h2>{episode.title}</h2>
        <div>
          <VimeoEmbed id={episode.vimeoId} />
        </div>
        <div>{parseDate(episode.date)}</div>
        <div
          dangerouslySetInnerHTML={{
            __html: htmlize(episode.description || ""),
          }}
        ></div>
      </main>
    </>
  );
}
