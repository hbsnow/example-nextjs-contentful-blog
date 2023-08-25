import { getPosts } from "@/api/getPosts";
import { EntryFieldTypes } from "contentful";
import { Metadata } from "next";
import Link from "next/link";

type Params = {
  params: {
    page: string;
  };
};

export const metadata: Metadata = {
  title: "Page",
};

export default async function Page({ params }: Params) {
  const page = Number(params.page);

  const data = await getPosts<{
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
  }>({
    limit: "5",
    skip: `${(page - 1) * 5}`,
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
      </div>

      <div className="flex gap-4 mt-8 justify-center items-center">
        <div>
          {page === 1 ? (
            <div className="text-gray-400 py-2 px-6 border">前のページ</div>
          ) : (
            <Link
              href={{ pathname: `/pages/${page - 1}` }}
              className="py-2 px-6 border block"
            >
              前のページ
            </Link>
          )}
        </div>
        <div>
          {data.total < page * 5 ? (
            <div className="text-gray-400 py-2 px-6 border">次のページ</div>
          ) : (
            <Link
              href={{ pathname: `/pages/${page + 1}` }}
              className="py-2 px-6 border block"
            >
              次のページ
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
