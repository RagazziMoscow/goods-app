export default interface TasksOptions {
    tasksCount: number;
    tasksGetter: (tasksNumber: number) => Promise<any>;
    onFinish?: () => void;
}
