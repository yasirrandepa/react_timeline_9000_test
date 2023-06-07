import { gd } from "./fns";

const users = {
  1: { first_name: "Etienne", last_name: "Constable" },
  2: { first_name: "Isabelle", last_name: "Merot" }
};

const periods = {
  1: [
    { start: gd(-2), end: gd(2), workload: 0.5 },
    { start: gd(2), end: gd(4), workload: 0.75 }
  ],
  2: [
    { start: gd(-4), end: gd(-1), workload: 0.25 },
    { start: gd(0), end: gd(4), workload: 1 }
  ]
};

export const parser = () => {
  const items = [];
  const groups = [];

  let key = 0;
  Object.entries(users).forEach(([id, value], index) => {
    groups.push({ id: index, group: { id, ...value } });
    Object.values(periods[id]).forEach(period => {
      items.push({ key, row: index, ...period });
      key++;
    });
  });

  return { key, items, groups };
};
