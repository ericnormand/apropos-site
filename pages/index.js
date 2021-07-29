import Head from "next/head";
import Image from "next/image";

export async function getStaticProps({ params }) {
  const fs = require("fs");
  const globby = require("globby");
  const jsonpaths = await globby(["data/episodes/*.json5"]);

  const episodes = {};

  jsonpaths.forEach((path) => {
    const id = path.replace(/data\/episodes\//, "").replace(".json5", "");
    const fileContents = fs.readFileSync(path, "utf8");
    const episode = JSON5.parse(fileContents);
    episode.id = id;
    episodes[id] = episode;
  });

  return {
    props: {
      episodes,
      devMode: process.env.NODE_ENV === "development",
    },
  };
}

function reverse(array) {
  const arrayCopy = array.slice();
  arrayCopy.reverse();
  return arrayCopy;
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

export default function Home({ episodes }) {
  const episodeOrder = Object.keys(episodes).map((id) => episodes[id]);
  episodeOrder.sort((a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
  episodeOrder.reverse();

  return (
    <>
      <Head>
        <title>Apropos Clojure</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="prose mx-auto lg:prose-lg">
        <h1>Apropos Clojure</h1>
        <p>A show about Clojure.</p>
        <h2>Details</h2>
        <p>
          Our show is broadcast live on Discord. We then upload the videos and
          embed them here.
        </p>
        <ul>
          <li>
            <a href="https://discord.gg/hgxAyQaeuX">Discord</a> - Watch and chat
            live
          </li>
          <li>
            <a href="https://twitter.com/AproposClj​">Twitter</a> - Random
            announcements
          </li>
          <li>
            <a href="https://liberapay.com/Apropos-Clojure">Librepay</a> -
            Donate Dollars or Euros to help us with the costs of the show.
          </li>
        </ul>
        <h2>Past episodes</h2>
        {episodeOrder.map((episode) => (
          <div key={episode.title} className="border-t">
            <a href={`/episode/${episode.id}`}>
              <h3 className="">{episode.title}</h3>
            </a>
            <div
              dangerouslySetInnerHTML={{
                __html: htmlize(episode.description || ""),
              }}
            />
          </div>
        ))}
      </main>
    </>
  );
}
