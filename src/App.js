import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import { Layout } from "antd";
import Timeline from "react-timeline-9000";
import ActionsTab from "./ActionsTab";
// import {customItemRenderer, customGroupRenderer} from 'demo/customRenderers';
import customGroupRenderer from "./customGroupRenderer";
import customItemRenderer from "./customItemRenderer";
import { parser, getRowLayer, gd } from "./utils";

import "antd/dist/antd.css";
import "./styles.css";

const { TIMELINE_MODES } = Timeline;
const snapMinutes = 10;

const log = (...text) => console.log(text);

const ITEM_DURATIONS = [
  moment.duration(3, "days"),
  moment.duration(6, "days"),
  moment.duration(12, "days")
];

const COLORS = [
  "#0099cc",
  "#f03a36",
  "#06ad96",
  "#fce05b",
  "#dd5900",
  "#cc6699"
];

// Moment timezones can be enabled using the following
// import moment from 'moment-timezone';
// moment.locale('en-au');
// moment.tz.setDefault('Australia/Perth');

class App extends Component {
  constructor(props) {
    super(props);

    const startDate = gd(0);
    //const endDate = startDate.clone().add(4, 'days');
    const endDate = gd(1);
    this.state = {
      selectedItems: [],
      groups: [],
      items: [],
      startDate,
      endDate,
      message: "",
      timelineMode:
        TIMELINE_MODES.SELECT | TIMELINE_MODES.DRAG | TIMELINE_MODES.RESIZE
    };
  }

  componentDidMount() {
    this.reRender();
  }

  reRender() {
    const { items = [], groups = [], key } = parser();
    this.key = key;
    this.forceUpdate();
    this.setState({ items, groups });
  }

  handleRowClick = (e, rowNumber, clickedTime, snappedClickedTime) => {
    log("handleRowClick", { rowNumber, clickedTime, snappedClickedTime });
    const message = `Row Click row=${rowNumber} @ time/snapped=${clickedTime.toString()}/${snappedClickedTime.toString()}`;
    this.setState({ selectedItems: [], message });
  };
  zoomIn() {
    let currentMins = this.state.endDate.diff(this.state.startDate, "minutes");
    let newMins = currentMins / 2;
    this.setState({
      endDate: this.state.startDate.clone().add(newMins, "minutes")
    });
  }
  zoomOut() {
    let currentMins = this.state.endDate.diff(this.state.startDate, "minutes");
    let newMins = currentMins * 2;
    this.setState({
      endDate: this.state.startDate.clone().add(newMins, "minutes")
    });
  }

  toggleSelectable() {
    const { timelineMode } = this.state;
    let newMode = timelineMode ^ TIMELINE_MODES.SELECT;
    this.setState({
      timelineMode: newMode,
      message: "Timeline mode change: " + timelineMode + " -> " + newMode
    });
  }
  toggleDraggable() {
    const { timelineMode } = this.state;
    let newMode = timelineMode ^ TIMELINE_MODES.DRAG;
    this.setState({
      timelineMode: newMode,
      message: "Timeline mode change: " + timelineMode + " -> " + newMode
    });
  }
  toggleResizable() {
    const { timelineMode } = this.state;
    let newMode = timelineMode ^ TIMELINE_MODES.RESIZE;
    this.setState({
      timelineMode: newMode,
      message: "Timeline mode change: " + timelineMode + " -> " + newMode
    });
  }
  handleItemClick = (e, key) => {
    const message = `Item Click ${key}`;
    const { selectedItems } = this.state;

    let newSelection = selectedItems.slice();

    // If the item is already selected, then unselected
    const idx = selectedItems.indexOf(key);
    if (idx > -1) {
      // Splice modifies in place and returns removed elements
      newSelection.splice(idx, 1);
    } else {
      newSelection.push(Number(key));
    }

    this.setState({ selectedItems: newSelection, message });
  };

  handleItemDoubleClick = (e, key) => {
    const message = `Item Double Click ${key}`;
    this.setState({ message });
  };

  handleItemContextClick = (e, key) => {
    const message = `Item Context ${key}`;
    this.setState({ message });
  };

  handleRowDoubleClick = (e, rowNumber, clickedTime, snappedClickedTime) => {
    const message = `Row Double Click row=${rowNumber} time/snapped=${clickedTime.toString()}/${snappedClickedTime.toString()}`;

    const randomIndex = Math.floor(
      Math.random() * Math.floor(ITEM_DURATIONS.length)
    );

    let start = snappedClickedTime.clone();
    let end = snappedClickedTime.clone().add(ITEM_DURATIONS[randomIndex]);
    this.key++;

    const item = {
      key: this.key++,
      title: "New item",
      color: "yellow",
      row: rowNumber,
      start: start,
      end: end
    };

    const newItems = _.clone(this.state.items);
    newItems.push(item);

    this.setState({ items: newItems, message });
  };

  handleRowContextClick = (e, rowNumber, clickedTime, snappedClickedTime) => {
    const message = `Row Click row=${rowNumber} @ time/snapped=${clickedTime.toString()}/${snappedClickedTime.toString()}`;
    this.setState({ message });
  };

  handleInteraction = (type, changes, items) => {
    /**
     * this is to appease the codefactor gods,
     * whose wrath condemns those who dare
     * repeat code beyond the sacred 5 lines...
     */
    function absorbChange(itemList, selectedItems) {
      itemList.forEach((item) => {
        let i = selectedItems.find((i) => {
          return i.key === item.key;
        });
        if (i) {
          item = i;
          item.title = moment.duration(item.end.diff(item.start)).humanize();
        }
      });
    }

    switch (type) {
      case Timeline.changeTypes.dragStart: {
        return this.state.selectedItems;
      }
      case Timeline.changeTypes.dragEnd: {
        const newItems = _.clone(this.state.items);

        absorbChange(newItems, items);
        this.setState({ items: newItems });
        break;
      }
      case Timeline.changeTypes.resizeStart: {
        return this.state.selectedItems;
      }
      case Timeline.changeTypes.resizeEnd: {
        const newItems = _.clone(this.state.items);

        // Fold the changes into the item list
        absorbChange(newItems, items);

        this.setState({ items: newItems });
        break;
      }
      case Timeline.changeTypes.itemsSelected: {
        this.setState({ selectedItems: _.map(changes, "key") });
        break;
      }
      default:
        return changes;
    }
  };

  render() {
    const {
      selectedItems,
      startDate,
      endDate,
      items,
      groups,
      message,
      timelineMode
    } = this.state;
    const rangeValue = [startDate, endDate];

    const selectable =
      (TIMELINE_MODES.SELECT & timelineMode) === TIMELINE_MODES.SELECT;
    const draggable =
      (TIMELINE_MODES.DRAG & timelineMode) === TIMELINE_MODES.DRAG;
    const resizeable =
      (TIMELINE_MODES.RESIZE & timelineMode) === TIMELINE_MODES.RESIZE;

    const rowLayers = getRowLayer(this.state);

    const {
      toggleSelectable,
      toggleDraggable,
      toggleResizable,
      zoomIn,
      zoomOut,
      reRender,
      setState
    } = this;
    log("state", this.state);
    return (
      <Layout className="layout">
        <Layout.Content>
          <ActionsTab
            {...{
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
            }}
          />
          <Timeline
            shallowUpdateCheck
            items={items}
            groups={groups}
            startDate={startDate}
            endDate={endDate}
            rowLayers={rowLayers}
            selectedItems={selectedItems}
            timelineMode={timelineMode}
            snapMinutes={snapMinutes}
            onItemClick={this.handleItemClick}
            onItemDoubleClick={this.handleItemDoubleClick}
            onItemContextClick={this.handleItemContextClick}
            onInteraction={this.handleInteraction}
            onRowClick={this.handleRowClick}
            onRowContextClick={this.handleRowContextClick}
            onRowDoubleClick={this.handleRowDoubleClick}
            itemRenderer={customItemRenderer}
            groupRenderer={customGroupRenderer}
            // groupTitleRenderer={<div>Group title</div>}
          />
        </Layout.Content>
      </Layout>
    );
  }
}

export default App;
