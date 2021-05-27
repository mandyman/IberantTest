import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';
import { debug } from 'console';

export enum AdminType {
    Normal = 0,
    Vip = 1,
    King = 2
}

export interface UserItem {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    description: string;
    isAdmin: boolean;
    adminType?: AdminType;
}

@repository("@@UserItem", "UserItem.summary")
export class UserItemsStore extends DataStore<UserItem> {
    baseUrl: string = "api/users";

    constructor() {
        super('UserItem', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }
}

export type NewUserItem = Pick<UserItem, "firstName" | "address" | "lastName" | "isAdmin" | "adminType" | "description" >;

export class NewUserValidator extends Validator<NewUserItem> {
    constructor() {
        super();

        this.ruleFor(x => x.firstName)
            .notNull()
            .withMessage("Title cant be empty");
    }
}

@repository("@@UserItem", "UserItem.new")
export class NewUserItemStore extends FormStore<NewUserItem> {
    baseUrl: string = "api/users";

    protected validate(item: NewUserItem) {
        return (new NewUserValidator()).validate(item);
    }

    constructor() {
        super('NEW_UserItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}



export class UserValidator extends Validator<UserItem> {
    constructor() {
        super();

        this.ruleFor(x => x.firstName)
            .notNull()
            .withMessage("firstName can not be null");

    }
}

const UserItem_UPDATE_ITEM = "UserItem_UPDATE_ITEM";
@repository("@@UserItem", "UserItem.detail")
export class UserItemStore extends FormStore<UserItem> {
    baseUrl: string = "api/users";

    protected validate(item: UserItem) {
        return new UserValidator().validate(item);
    }

    constructor() {
        super('UserItem', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }

    public async Update(item: UserItem) {
        debugger
        var result = await super.put(UserItem_UPDATE_ITEM, `${item.id}`, item) as any;
        return result.data as CommandResult<UserItem>;
    }


    @reduce(UserItem_UPDATE_ITEM)
    protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<UserItem>>, DataModel<UserItem>> {
        return super.onPatch();
    }
}