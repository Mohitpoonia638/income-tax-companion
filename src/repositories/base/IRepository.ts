// ─── Generic Repository Interface ──────────────────────────────────────────────

export interface IRepository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  findMany(ids: string[]): Promise<T[]>;
  findWhere(predicate: (item: T) => boolean): Promise<T[]>;
  count(): Promise<number>;
  loadAll(items: T[]): void;
  clear(): void;
}
