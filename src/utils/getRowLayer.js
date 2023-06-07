export const getRowLayer = (state) => {
  const { startDate, endDate, items = [], groups = [] } = state;

  const rowLayers = [];
  groups.forEach((group, i) => {
    if (!(i % 5 === 0 && i !== 0)) {
      let curDate = startDate.clone();
      while (curDate.isSameOrBefore(endDate)) {
        const dayOfWeek = Number(curDate.format("d")); // 0 -> 6: Sun -> Sat
        let bandDuration = 0; // days
        let color = "";
        if (dayOfWeek % 6 === 0) {
          color = "black";
          bandDuration = dayOfWeek === 6 ? 2 : 1; // 2 if sat, 1 if sun
        } else {
          color = "white";
          bandDuration = 6 - dayOfWeek;
        }

        rowLayers.push({
          start: curDate.clone(),
          end: curDate.clone().add(bandDuration, "days"),
          style: { backgroundColor: color, opacity: "0.3" },
          rowNumber: i
        });
        curDate.add(bandDuration, "days");
      }
    }
  });
  return rowLayers;
};
