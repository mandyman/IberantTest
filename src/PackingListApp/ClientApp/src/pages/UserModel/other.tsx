import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import {
    TestItemsStore,
    TestItem
} from "src/stores/test-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewTestItemView from "./body"

export default class NewComponent extends Component {
    render() {
        return (
            <div>
                <h1>Hey mister</h1>
                <p>Hello world</p>
            </div>
        );
    }
}