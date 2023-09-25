export type FileType = "json" | "csv";

export default interface ExportModel {
    type: FileType;
    provider: (data: string) => Promise<void>;
}
