import { Parser } from '@json2csv/plainjs';
import * as fs from "fs";
import * as chalk from "chalk";

import Good from "../models/Good";
import TasksOptions from "../models/TasksOptions";
import ExportModel, { FileType } from "../models/ExportModel";

export async function exportToFile(data: any, type: FileType): Promise<void> {
    const exportConfig: ExportModel[] = [
        {
            type: "json",
            provider: async (data: any): Promise<void> => {
                return new Promise<void>((resolve, reject) => {
                    const json = JSON.stringify(data, null, 2);

                    fs.writeFile("output/output.json", json, {}, (error: any) => {
                        if (error) reject(error);
                        console.log(chalk.bold.yellow("JSON file have been created successfully"));
                        resolve();
                    });
                });
            }
        },
        {
            type: "csv",
            provider: async (data: any): Promise<void> => {
                return new Promise<void>((resolve, reject) => {
                    try {
                        const opts = { header: false };
                        const parser = new Parser(opts);
                        const csv = parser.parse(data);

                        fs.writeFile("output/output.csv", csv, {}, (error: any) => {
                            if (error) reject(error);
                            console.log(chalk.bold.yellow("CSV file have been created successfully"));
                            resolve();
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        }
    ];
    const model = exportConfig.find(model => model.type === type);

    if (model) {
        await model.provider(data);
    }
}

export function runParallelTasks(options: TasksOptions): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        const tasks: Promise<any[]>[] = Array.from({ length: options.tasksCount }, (v, i) => i + 1).map(options.tasksGetter);
        const requestedData = await Promise.all(tasks);
        const result: any[] = new Array<Good>().concat(...requestedData);

        options.onFinish && options.onFinish();
        resolve(result);
    });
}

export function mergeArrayObjects<T, F = T>(arrOne: T[], arrTwo: F[], key: keyof (T & F)): ((T & F) | T)[] {
    return arrOne.map((item: T, i: number) => {
        // @ts-ignore
        if (item[key] === arrTwo[i][key]) {
            //merging two objects
            return Object.assign<{}, T, F>({}, item, arrTwo[i]);
        } else {
            return item;
        }
    })
}
