import "dotenv/config";
import * as chalk from "chalk";

import Api from "./lib/services/Api";
import { runParallelTasks, exportToFile, mergeArrayObjects } from "./lib/helpers";
import Good from "./lib/models/Good";
import GoodDetail from "./lib/models/GoodDetail";
import TasksOptions from "./lib/models/TasksOptions";
import { FileType } from "./lib/models/ExportModel";

const DEFAULT_MAX_RECORDS_COUNT = 1900;
const DEFAULT_PAGE_SIZE = 500;
const count = parseInt(process.env.MAX_RECORDS_COUNT as string) || DEFAULT_MAX_RECORDS_COUNT;
const pageSize = parseInt(process.env.PAGE_SIZE as string) || DEFAULT_PAGE_SIZE;
const exportFileType = process.env.EXPORT_FILE_TYPE as FileType;
const tasksCount = Math.ceil(count / pageSize);
const api = Api.getInstance();

(async () => {
    console.log(
        chalk.bold.yellow("Passed settings:\n"),
        chalk.red(`max records count = ${count}\n`),
        chalk.red(`page size = ${pageSize}\n`),
        chalk.red(`export file type = ${exportFileType}\n`)
    );

    const goodsTasksOptions: TasksOptions = {
        tasksCount,
        tasksGetter: (taskNumber) => api.getGoodsList({ pageNum: taskNumber, pageSize }),
        onFinish: () => console.log(chalk.bold.green("Goods have been loaded successfully"))
    };
    const goodsDetailTasksOptions: TasksOptions = {
        tasksCount,
        tasksGetter: (taskNumber) => api.getGoodsDetailList({ pageNum: taskNumber, pageSize }),
        onFinish: () => console.log(chalk.bold.green("Good Details have been loaded successfully"))
    };
    const [goods, goodsDetail] = await Promise.all([
        runParallelTasks(goodsTasksOptions),
        runParallelTasks(goodsDetailTasksOptions)
    ]);
    const mergedResult = mergeArrayObjects<Good, GoodDetail>(goods, goodsDetail, "ID");

    await exportToFile(mergedResult, exportFileType);
})();
