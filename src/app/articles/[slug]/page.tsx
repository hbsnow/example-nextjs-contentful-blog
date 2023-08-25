import { getPosts } from "@/api/getPosts";
import { EntryFieldTypes } from "contentful";
import markdownHtml from "zenn-markdown-html";

import { Metadata } from "next";

type Params = {
  params: {
    slug: string;
  };
};

export const metadata: Metadata = {
  title: "Page",
};

export default async function Page({ params }: Params) {
  const data = await getPosts<{
    title: EntryFieldTypes.Text;
    content: EntryFieldTypes.Text;
  }>({
    limit: "1",
    skip: "0",
    "fields.slug": params.slug,
  });

  const article = data.items.at(0);

  if (article == null) {
    throw new Error("記事がありません");
  }

  const html = markdownHtml(article.fields.content);

  return (
    <main>
      <div className="container mx-auto p-2 py-8">
        <article>
          <header>
            <h2 className="text-2xl font-bold">{article.fields.title}</h2>
            <div className="text-gray-500 text-sm mt-2">
              {new Date(article.sys.createdAt).toLocaleDateString()}
            </div>
          </header>

          <div className="mt-8">
            <div
              className="znc"
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </div>
        </article>

        <details className="mt-8">
          <pre className="text-sm bg-gray-900 text-gray-50 p-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}
