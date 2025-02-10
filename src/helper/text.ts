import { filter } from 'rxjs';

export function createTagsArray(
  tags: string[],
  findTags: { tag: string }[],
): { tag: string }[] {
  console.log(tags);
  console.log(findTags);

  const filterSameTags = tags.filter(
    (val) => !findTags.some((item) => item.tag === val),
  );

  if (findTags.length) {
    const tagsInput = filterSameTags.map((val) => {
      return { tag: val };
    });
    return tagsInput;
  } else {
    const tagsInput = tags.map((val) => {
      return { tag: val };
    });
    return tagsInput;
  }
}
