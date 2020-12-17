import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import {  UserItem, UserItemStore } from 'src/stores/user-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';
import { max } from 'moment';

interface EditUserItemViewProps {
    item: UserItem ,
    onClose: (id: string | undefined, item?: UserItem) => void;
}

interface EditUserItemViewState {
    item: UserItem
}

interface ClassFormBodyProps {
    item: UserItem | undefined,
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

export enum AdminTypes {
    'Normal',
    'Vip',
    'King'
}

export class UserItemFormBody extends React.Component<ClassFormBodyProps> {

    stringIsNumber = (val: any) => isNaN(Number(val)) === false;

    render() {

        const { getFieldDecorator } = this.props;
        console.log("CCCCCC", this.props);
        var item = this.props.item || {} as UserItem;
        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>
                <Col span={8}>
                    <FormItem label={"Name"}>
                        {getFieldDecorator(nameof<UserItem>('name'), {
                            initialValue: item.name,
                            rules: [
                                {
                                    min: 1,
                                    required: true,
                                    message: 'Name cannot be null or empty'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'LastName'}>
                        {getFieldDecorator(nameof<UserItem>('lastname'), {
                            initialValue: item.lastname,
                            rules: [
                                {
                                    required: true,
                                    message: 'Lastname cannot be null or empty'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<UserItem>('address'), {
                            initialValue: item.address,
                            rules: [
                                {
                                    required: true,
                                    max: 10,
                                    message: 'Address must have at most 10 characters'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>            
                <FormItem label={'Is Admin'} className="inlineForm">
                    {getFieldDecorator(nameof<UserItem>('isAdmin'), {
                        initialValue: item.isAdmin,
                    })(
                        <Checkbox checked={this.props.getFieldValue('isAdmin')} />
                    )}
                </FormItem>
            </Row>
            <Row>
                <FormItem label={'Admin Type'}>
                    {getFieldDecorator(nameof<UserItem>('adminType'), {
                        initialValue: item.adminType,
                        rules: [
                            {
                                required: true
                            }
                        ]
                    })(
                        <Select
                            value={item.adminType}
                            disabled={!this.props.getFieldValue('isAdmin')}
                        >
                            {
                                Object.keys(AdminTypes)
                                    .filter(this.stringIsNumber)
                                    .map((key: any) =>
                                        <option key={key} value={key}>{AdminTypes[key]}</option>
                                    )
                            }
                        </Select>
                    )}
                </FormItem>
            </Row>
        </Form>
    }
}



@connect(["userItem", UserItemStore])   
class EditUserItemView extends React.Component<EditUserItemViewProps & FormComponentProps, EditUserItemViewState> {
    private get UserItemsStore() {
        console.log("DDDDDDDD", this.props);
        return (this.props as any).userItem as UserItemStore;
    }

    constructor(props: EditUserItemViewProps & FormComponentProps) {
        super(props);

        this.state = {
            item: { id: -1, name: "", lastname: "", address: "", adminType: -1, isAdmin: false }
        };
    }

    componentWillReceiveProps(nextProps: EditUserItemViewProps) {
        console.log("BBBBBBBBBB", nextProps);

        if (nextProps.item.id !== this.props.item.id) {
            this.UserItemsStore.state.item
            this.setState({ item: nextProps.item });
        }
        if (this.UserItemsStore.state.result && this.UserItemsStore.state.result.isSuccess)
            nextProps.onClose((this.UserItemsStore.state.result as any).aggregateRootId, this.UserItemsStore.state.item)
    }

    @autobind
    private onEditItem() {
        var self = this;
        console.log("VALUES", self.props.form.getFieldsValue());
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                
                if (!event) {
                    values = { ...values, };
                    self.UserItemsStore.change(values);
                    self.UserItemsStore.submit().then(result => {
                        if (result.isSuccess) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            });
        })
    }

    @autobind
    private onCancelEditItem() {
        this.UserItemsStore.clear();
        this.props.onClose(undefined);
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (          
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelEditItem}
                onOk={this.onEditItem}
                closable={false}
                width='800px'
                title={"Edit UserItem"}>
                {this.UserItemsStore.state.result && !this.UserItemsStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                        description={formatMessage(this.UserItemsStore.state.result)}
                    />
                }
                <Spin spinning={this.UserItemsStore.state.isBusy}>
                    <UserItemFormBody item={this.props.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onEditItem} />
                </Spin>
            </Modal>
        );
    }
}


// Wire up the React component to the Redux store
export default Form.create({})(EditUserItemView as any) as any as React.ComponentClass<EditUserItemViewProps>;