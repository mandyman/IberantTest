import React, { Component } from "react";
import { Layout, Switch, Select, Input, Checkbox, Alert, Row, Col } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps, } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import {
    UsersStore,
    User,
    AdminType,
    AdminTypeToString
} from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewUserView from "./body"

interface UserListProps extends RouteComponentProps { }

interface UserListState {
    query: Query;
    newShow: boolean;
    disabledAdminType: boolean;
}

@connect(["Users", UsersStore])
export default class UserListPage extends Component<UserListProps, UserListState> {
    private id: number = -1;
    private get UsersStore() {
        return (this.props as any).Users as UsersStore;
    }

    constructor(props: UserListProps) {
        super(props);
        this.state = {
            query: {
                searchQuery: "",
                orderBy: [
                    { field: "id", direction: "Ascending", useProfile: false }
                ],
                skip: 0,
                take: 10
            },
            newShow: false,
            disabledAdminType: true
        };
    }

    componentWillMount() {

        this.load(this.state.query);
    }

    @autobind
    private async load(query: Query) {
        await this.UsersStore.getAllAsync(query);
    }

    @autobind
    private onSwitchChanged(checked: boolean) {
        this.setState({ disabledAdminType: !checked});
    }

    @autobind
    private onQueryChanged(query: Query) {
        this.setState({ query });
        this.load(query);
    }

    @autobind
    private async onNewItem() {
        this.setState({ newShow: true })
    }

    @autobind
    private async onSaveItem(item: User, state: ItemState) {
        var result = await this.UsersStore.saveAsync(
            `${item.id}`,
            item,
            state
        );
        await this.load(this.state.query);
        return result;
    }

    @autobind
    private onNewItemClosed() {
        this.setState({ newShow: false });
        this.load(this.state.query);
    }

    @autobind
    private async onDeleteRow(
        item: User,
        state: ItemState
    ): Promise<CommandResult<any>> {
        return await this.UsersStore.deleteAsync(`${item.id}`);
    }

    render() {
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "Name",
                    title: "Name",
                    renderer: data =>

                        <span>{data.name}</span>,

                    editor: data => <Input />
                },
                {
                    field: "LastName",
                    title: "LastName",
                    renderer: data => <span>{data.lastName}</span>,
                    editor: data => <Input />
                },
                {
                    field: "Description",
                    title: "Description",
                    renderer: data => <span>{data.description}</span>,
                    editor: data => <Input />
                },
                {
                    field: "IsAdmin",
                    title: "IsAdmin",
                    renderer: data => <span>{data.isAdmin ? <Checkbox checked={true} /> : <Checkbox checked={false} />}</span>,
                    editor: data => <Switch onChange={this.onSwitchChanged} />
                },
                {
                    field: "AdminType",
                    title: "AdminType",
                    renderer: data => <span>{data.isAdmin ? AdminTypeToString[data.adminType] : null}</span>,
                    editor: data => <Select disabled={this.state.disabledAdminType} defaultValue={AdminType.Normal}>
                        <Select.Option value={AdminType.Normal}>Normal</Select.Option>
                        <Select.Option value={AdminType.Vip}>VIP</Select.Option>
                        <Select.Option value={AdminType.King}>King</Select.Option>
                    </Select>
                },
            ],
            data: this.UsersStore.state,
            sortFields: [

            ]
        } as TableModel<User>;

        return (
            <Layout>
                <HeaderComponent title="UserModels" canGoBack={true} />

                <Content className="page-content">
                    {this.UsersStore.state.result &&
                        !this.UsersStore.state.result.isSuccess && (
                            <Alert
                                type="error"
                                message={"Ha ocurrido un error"}
                                description={this.UsersStore.state.result.messages
                                    .map(o => o.body)
                                    .join(", ")}
                            />
                        )}

                    <div style={{ margin: "12px" }}>
                        <TableView
                            rowKey={"id"}
                            model={tableModel}
                            onQueryChanged={(q: Query) => this.onQueryChanged(q)}
                            onNewItem={this.onNewItem}
                            onRefresh={() => this.load(this.state.query)}
                            onDeleteRow={this.onDeleteRow}
                            canDelete={true}
                            canCreateNew={true}
                            onSaveRow={this.onSaveItem}
                            hidepagination={true}
                            canEdit={true}
                        />
                        {this.state.newShow && <NewUserView onClose={this.onNewItemClosed} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
