import _ from "lodash";

export function treeToArray(array = [], { children = "submenu" } = {}): Array<any> {
  const iterateFn = (item: any) => {
    return !item[children] || !item[children].length ? item : [item, _.flatMapDeep(item[children], iterateFn)];
  };
  return _.flatMapDeep(array, iterateFn);
}

export function arrayToTree(array = [], { id = null, parentId = "parentId", children = "submenu" } = {}): Array<any> {
  return array
    .filter((item) => item[parentId] === id)
    .map((item) => ({
      ...item,
      [children]: arrayToTree(array, { id: item.id }),
    }))
    .map((item) => {
      if (!item[children].length) {
        delete item[children];
      }
      return item;
    });
}
