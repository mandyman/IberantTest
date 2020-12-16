import { DataStore, DataModel } from './dataStore';
import { FormStore } from './formStore';
import { repository, reduce, AsyncAction } from 'redux-scaffolding-ts';
import { Validator } from "lakmus";
import { AxiosResponse } from 'axios';
import { container } from '../inversify.config';
import { CommandResult } from './types';


export const AdminTypeToString = {0:"Normal", 1:"Vip", 2:"King"}
export enum AdminType {
    Normal,
    Vip,
    King
}


export interface User {
    id: number;
    name: string;
    lastName: string;
    description: string;
    isAdmin: boolean;
    adminType: AdminType;
}


@repository("@@User", "User.summary")
export class UsersStore extends DataStore<User> {
    baseUrl: string = "api/user";

    constructor() {
        super('User', {
            count: 0,
            isBusy: false,
            items: [],
            result: undefined,
            discard: item => { }
        }, container);
    }
}

export interface NewUser {
    name: string,
    lastName: string,
    description: string,
    isAdmin: boolean,
    adminType: AdminType
}

export class NewUserValidator extends Validator<NewUser> {
    constructor()    {
        super();

        this.ruleFor(x => x.name)
            .notNull()
            .withMessage("Name cant be empty");

        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("LastName cant be empty");

        this.ruleFor(x => x.description)
            .maxLength(10)
            .withMessage("Description cant exceed 10 characters");

        this.ruleFor(x => x.adminType)
            .notNull()
            .when(x => x.isAdmin)
            .withMessage("An admin type must be selected");
    }
}

@repository("@@User", "User.new")
export class NewUserStore extends FormStore<NewUser> {
    baseUrl: string = "api/user";

    protected validate(item: NewUser) {
        return (new NewUserValidator()).validate(item);
    }

    constructor() {
        super('NEW_User', {
            isBusy: false,
            status: 'New',
            item: undefined,
            result: undefined
        }, container);
    }
}

export class UserValidator extends Validator<User> {
    constructor() {
        super();

        this.ruleFor(x => x.name)
            .notNull()
            .withMessage("Name cant be null");

        this.ruleFor(x => x.lastName)
            .notNull()
            .withMessage("LastName cant be null");

        this.ruleFor(x => x.description)
            .maxLength(10)
            .withMessage("Description cant exceed 10 characters");

        this.ruleFor(x => x.adminType)
            .notNull()
            .when(x => x.isAdmin)
            .withMessage("Admin type cant be null");
    }
}

const User_UPDATE_ITEM = "User_UPDATE_ITEM";
@repository("@@User", "User.detail")
export class UserStore extends FormStore<User> {
    baseUrl: string = "api/user";

    protected validate(item: User) {
        const result = new UserValidator().validate(item)
        return result;
    }

    constructor() {
        super('User', {
            isBusy: false,
            status: 'Modified',
            item: undefined,
            result: undefined
        }, container);
    }

    public async Update(item: User) {
        var result = await super.patch(User_UPDATE_ITEM, `${item.id}`, item) as any;
        return result.data as CommandResult<User>;
    }

    public async UpdatePut(item: User) {
        return super.put(User_UPDATE_ITEM, `${item.id}`, item);
    }

    @reduce(User_UPDATE_ITEM)
    protected onUpdateBillingOrder(): AsyncAction<AxiosResponse<CommandResult<User>>, DataModel<User>> {
        return super.onPatch();
    }
}