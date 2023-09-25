import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import Good from "../models/Good";
import GoodDetail from "../models/GoodDetail";

interface PagingOptions {
    pageNum: number;
    pageSize: number;
}

export default class Api {
    protected static instance: Api;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({ baseURL: process.env.API_URL } as CreateAxiosDefaults);
    }

    public static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api();
        }

        return Api.instance;
    }

    public async getGoodsList(options: PagingOptions): Promise<Good[]> {
        const requestOptions: Partial<AxiosRequestConfig> = {
            url: "GoodsList",
            method: "get",
            params: options
        };
        const result = await this.execute(requestOptions as AxiosRequestConfig) as { GoodsList: { Good: Good[] }};

        return result.GoodsList.Good;
    }

    public async getGoodsDetailList(options: PagingOptions): Promise<GoodDetail[]> {
        const requestOptions: Partial<AxiosRequestConfig> = {
            url: "GoodsDetailList",
            method: "get",
            params: options
        };
        const result = await this.execute(requestOptions as AxiosRequestConfig) as { GoodsDetailList: { Good: GoodDetail[] }};

        return result.GoodsDetailList.Good;
    }

    private async execute(options: AxiosRequestConfig): Promise<any> {
        return (await this.axiosInstance.request(options)).data;
    }
}
