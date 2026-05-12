/** sql.js 最小类型声明 */
declare module 'sql.js' {
  interface Database {
    run(sql: string, params?: unknown[]): void;
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  interface Statement {
    bind(params?: unknown[]): boolean;
    step(): boolean;
    getAsObject(): Record<string, number | string | null>;
    free(): boolean;
  }

  interface SqlJs {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  export default function initSqlJs(): Promise<SqlJs>;
}