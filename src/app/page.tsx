import { getPosts } from "@/api/getPosts";
import { EntryFieldTypes } from "contentful";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js",
};

export default async function Page() {
  const data = await getPosts<{
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
  }>({
    limit: "5",
    skip: "0",
    order: "-sys.createdAt",
    select: "sys.createdAt,fields.title,fields.slug",
  });

  return (
    <main>
      <div className="container mx-auto p-2">
        <ul>
          {data.items.map((item) => {
            const {
              sys: { createdAt },
              fields: { title, slug },
            } = item;

            return (
              <li key={slug} className="text-sm border p-2 mt-4 first:mt-6">
                <Link className="flex" href={{ pathname: `/articles/${slug}` }}>
                  <div>{title}</div>
                  <div className="ml-auto text-gray-400">
                    {new Date(createdAt).toLocaleDateString()}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-4 mt-8 justify-center items-center">
          <Link
            href={{ pathname: "/pages/2" }}
            className="py-2 px-6 border block"
          >
            もっと見る
          </Link>
        </div>
      </div>
    </main>
  );
}
