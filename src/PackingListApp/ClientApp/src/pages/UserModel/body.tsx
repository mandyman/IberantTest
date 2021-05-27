import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';
import { AdminType, UserItemStore, UserItem } from 'src/stores/user-store';
import { debug } from 'console';



interface UserItemViewProps {
    onClose: (id: string | undefined, item?: UserItem) => void;
    user?: UserItem;
}

interface UserItemViewState {

}

interface ClassFormBodyProps {
    item: UserItem | undefined,
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

export class UserItemFormBody extends React.Component<ClassFormBodyProps> {


    render() {
        const { getFieldDecorator, getFieldValue } = this.props;

        var isAdmin: boolean = getFieldValue(nameof<UserItem>("isAdmin"))

        
        var item = this.props.item || {} as UserItem;
        getFieldDecorator(nameof<UserItem>('id'), {
            initialValue: item.id,
        })


        return <Form
            id="modaForm"
            onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}
            >
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"First Name"}>
                        {getFieldDecorator(nameof<UserItem>('firstName'), {
                            initialValue: item.firstName,
                            rules: [{ required: true, message: "This field is required", whitespace: true }]


                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Last Name'}>
                        {getFieldDecorator(nameof<UserItem>('lastName'), {
                            initialValue: item.lastName,
                            rules: [{ required: true, message: "This field is required", whitespace: true }]


                        })(
                            <Input  />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<UserItem>('address'), {
                            initialValue: item.address,
                            rules: [{ required: true, message: "This field is required", whitespace: true }]

                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Description'}>
                        {getFieldDecorator(nameof<UserItem>('description'), {
                            initialValue: item.description,
                            rules: [
                                { required: true, message: "This field is required", whitespace: true },
                                { max: 10, message: "Max 10 characters" }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={4}>
                    <FormItem label={'Is Admin'}>
                        {getFieldDecorator(nameof<UserItem>('isAdmin'), {
                            initialValue: item.isAdmin,

                        })(
                            <Checkbox />
                        )}
                    </FormItem>
                </Col>

                <Col span={8}>
                    {isAdmin === true ? <FormItem label={'Admin Type'}>
                        {getFieldDecorator(nameof<UserItem>('adminType'), {
                            initialValue: item.adminType,
                            rules: [{ required: true, message: "This field is required"}],
                        })(
                            <Select>
                                <Select.Option value={AdminType.Normal}>Normal</Select.Option>
                                <Select.Option value={AdminType.Vip}>Vip</Select.Option>
                                <Select.Option value={AdminType.King}>King</Select.Option>
                            </Select>
                        )}
                    </FormItem> : null}
                </Col>
            </Row>

        </Form>
    }
}

@connect(["userItem", UserItemStore])
class UserItemView extends React.Component<UserItemViewProps & FormComponentProps, UserItemViewState> {
    private get UserItemStore() {
        return (this.props as any).userItem as UserItemStore;
    }

    constructor(props: UserItemViewProps & FormComponentProps) {
        super(props);
        this.UserItemStore.createNew(props.user || {} as UserItem);
    }

    componentWillReceiveProps(nextProps: UserItemViewProps) {
        if (this.UserItemStore.state.result && this.UserItemStore.state.result.isSuccess)
            nextProps.onClose((this.UserItemStore.state.result as any).aggregateRootId, this.UserItemStore.state.item)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        const isEditing = self.props.user !== undefined;
        return new Promise<void>((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (values.isAdmin !== true) {
                    values.adminType = undefined;
                }

                if (!event) {
                    values = { ...values, };
                    if (isEditing) {
                        self.UserItemStore.Update(values as UserItem).then(result => {
                            if (result.isSuccess) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    } else {
                        debugger
                        self.UserItemStore.change(values);
                        self.UserItemStore.submit().then(result => {
                            if (result.isSuccess) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    
                }
            });
        })
    }

    @autobind
    private onCancelNewItem() {
        this.UserItemStore.clear();
        this.props.onClose(undefined);
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelNewItem}
                onOk={this.onCreateNewItem}
                closable={false}
                width='800px'
                title={"New UserItem"}>
                {this.UserItemStore.state.result && !this.UserItemStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                    description={formatMessage(this.UserItemStore.state.result)}
                    />
                }
                <Spin spinning={this.UserItemStore.state.isBusy}>
                    <UserItemFormBody
                        item={this.UserItemStore.state.item}
                        getFieldDecorator={getFieldDecorator}
                        getFieldValue={this.props.form.getFieldValue}
                        setFieldsValue={this.props.form.setFieldsValue}
                        onSave={this.onCreateNewItem}
                    />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(UserItemView as any) as any as React.ComponentClass<UserItemViewProps>;