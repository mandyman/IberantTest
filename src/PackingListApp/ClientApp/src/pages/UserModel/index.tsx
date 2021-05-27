import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col, Checkbox, Select } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";

import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate, nameof } from "src/utils/object";
import { AdminType, UserItem, UserItemsStore } from "src/stores/user-store";

import NewUserItemView from "./body"
import Item from "antd/lib/list/Item";
import { debug } from "console";

const { Content } = Layout;

interface UserItemListProps extends RouteComponentProps { }

interface UserItemListState {
    query: Query;
    newShow: boolean;
    edit: boolean;
    editUser?: UserItem

}


@connect(["UserItems", UserItemsStore])
export default class UserItemListPage extends Component<
UserItemListProps,
UserItemListState
> {
    private id: number = -1;
    private get UserItemsStore() {
        return (this.props as any).UserItems as UserItemsStore;
    }

    constructor(props: UserItemListProps) {
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
            edit: false,
            editUser: undefined
        };
    }

    componentWillMount() {

        this.load(this.state.query);
    }

    @autobind
    private async load(query: Query) {
        await this.UserItemsStore.getAllAsync(query);
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
    private async onEdit(item: UserItem) {
        this.setState({ edit: true, editUser: item })
    }


    @autobind
    private async onSaveItem(item: UserItem, state: ItemState) {
        var result = await this.UserItemsStore.saveAsync(
            `${item.id}`,
            item,
            state
        );
        await this.load(this.state.query);
        return result;
    }



    @autobind
    private onModaClosed() {
        this.setState({ newShow: false, editUser: undefined, edit: false });
        this.load(this.state.query);
    }

    @autobind
    private async onDeleteRow(
        item: UserItem,
        state: ItemState
    ): Promise<CommandResult<any>> {
        return await this.UserItemsStore.deleteAsync(`${item.id}`);
    }



    render() {

        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: nameof<UserItem>("firstName"),
                    title: "First Name",
                    renderer: data => <span>{data.firstName}</span>,
                    editor: data => <Input />
                },
                {
                    field: nameof<UserItem>("lastName"),
                    title: "Last Name",
                    renderer: data => <span>{data.lastName}</span>,
                    editor: data => <Input />
                },
                {
                    field: nameof<UserItem>("address"),
                    title: "Address",
                    renderer: data => <span>{data.address}</span>,
                    editor: data => <Input />
                },
                {
                    field: nameof<UserItem>("description"),
                    title: "Description",
                    renderer: data => <span>{data.description}</span>,
                    editor: data => <Input />
                },
                {
                    field: nameof<UserItem>("isAdmin"),
                    title: "Is Admin",
                    renderer: data => <Checkbox defaultChecked={data.isAdmin} disabled={true} />,
                    editor: data => Checkbox
                },
                {
                    field: nameof<UserItem>("adminType"),
                    title: "Admin Type",
                    renderer: data => data.isAdmin === true ? < span > {AdminType[data.adminType!]}</span> : "",
                    editor: data => {
                        console.log(data)
                        return data?.isAdmin === true ? (<Select>
                            <Select.Option value={AdminType.Normal}>Normal</Select.Option>
                            <Select.Option value={AdminType.Vip}>Vip</Select.Option>
                            <Select.Option value={AdminType.King}>King</Select.Option>
                        </Select>) : <span/>
                    }
                },

            ],
            data: this.UserItemsStore.state,
            sortFields: [


            ]
        } as TableModel<UserItem>;

        return (
         
            <Layout>
                <HeaderComponent title="UserModels" canGoBack={true} />

                <Content className="page-content">
                    {this.UserItemsStore.state.result &&
                        !this.UserItemsStore.state.result.isSuccess && (
                            <Alert
                                type="error"
                                message={"Ha ocurrido un error"}
                                description={this.UserItemsStore.state.result.messages
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
                            canDelete={true}
                            onDeleteRow={(item, state) => this.onDeleteRow(item, state)}
                            canCreateNew={true}
                            onSaveRow={this.onSaveItem}
                            hidepagination={true}
                            canEdit={true}
                            onEdit={this.onEdit}
                        />
                        {(this.state.newShow || this.state.edit) && <NewUserItemView onClose={this.onModaClosed} user={this.state.edit ? this.state.editUser : undefined} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
