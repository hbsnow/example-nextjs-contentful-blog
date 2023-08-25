import {
  EntryCollection,
  EntryFieldTypes,
  EntrySkeletonType,
  FieldsType,
} from "contentful";

type Posts<T extends FieldsType> = EntryCollection<
  EntrySkeletonType<T, "blog">,
  undefined
>;

export async function getPosts<T extends FieldsType>(
  init: ConstructorParameters<typeof URLSearchParams>[0]
): Promise<Posts<T>> {
  const params = new URLSearchParams(init);
  if (process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN) {
    params.set("access_token", process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN);
  }
  params.set("content_type", "blog");

  const url = new URL(
    `/spaces/16i63vyg8y5h/environments/master/entries?${params}`,
    "https://cdn.contentful.com"
  );

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
