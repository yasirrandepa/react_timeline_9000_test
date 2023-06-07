import { Form, InputNumber, Button, DatePicker, Checkbox, Switch } from "antd";
import React from "react";

const ActionsTab = props => {
  const {
    rangeValue,
    message,
    selectable,
    draggable,
    resizeable,
    toggleSelectable,
    toggleDraggable,
    toggleResizable,
    zoomIn,
    zoomOut,
    reRender,
    setState
  } = props;
  console.log(props);
  return (
    <div style={{ margin: 24 }}>
      <Form layout="inline">
        <Form.Item label="Date Range">
          <DatePicker.RangePicker
            allowClear={false}
            value={rangeValue}
            showTime
            onChange={e => {
              setState({ startDate: e[0], endDate: e[1] }, () => reRender());
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => reRender()}>
            Regenerate
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={zoomIn}>Zoom in</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={zoomOut}>Zoom out</Button>
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={toggleSelectable} checked={selectable}>
            Enable selecting
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={toggleDraggable} checked={draggable}>
            Enable dragging
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={toggleResizable} checked={resizeable}>
            Enable resizing
          </Checkbox>
        </Form.Item>
      </Form>
      <div>
        <span>Debug: </span>
        {message}
      </div>
    </div>
  );
};

export default ActionsTab;
