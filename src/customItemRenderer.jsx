import React from "react";

/*
item: Object
  key: 26
  title: "6 hours"
  color: "#dd5900"
  row: 3
  start: Moment
  end: Moment
  rowOffset: 0
  className: "rct9k-items-inner"
  style: Object
  backgroundColor: "#dd5900"
*/

const customItemRenderer = props => {
  console.log("customItemRenderer", props);
  const { item = {}, className, style } = props;
  const { key, workload } = item;
  return (
    <div
      key={key}
      style={{ ...style, backgroundColor: "blue", color: "white" }}
      className={className}
    >
      {`${workload * 100}%`}
    </div>
  );
};

export default customItemRenderer;
