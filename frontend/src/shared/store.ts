import { Storage } from '@ionic/storage';

export class Store {
    private static instance: Store;
    private storage = new Storage();

    private constructor() {
        this.init();
    }

    async init() {
        const storage = await this.storage.create();
        this.storage = storage;
    }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }

        return Store.instance;
    }

    public get(key: string){
       return this.storage.get(key);
    }

    public set(key: string, value: unknown){
       return this.storage.set(key, value);
    }
    public remove(key: string){
       return this.storage.remove(key);
    }
}
