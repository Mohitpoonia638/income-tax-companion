// ─── Generic In-Memory Repository Implementation ──────────────────────────────

import type { IRepository } from './IRepository';

export class InMemoryRepository<T extends { id: string }> implements IRepository<T> {
  protected items = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async findMany(ids: string[]): Promise<T[]> {
    const results: T[] = [];
    for (const id of ids) {
      const item = this.items.get(id);
      if (item) results.push(item);
    }
    return results;
  }

  async findWhere(predicate: (item: T) => boolean): Promise<T[]> {
    return Array.from(this.items.values()).filter(predicate);
  }

  async count(): Promise<number> {
    return this.items.size;
  }

  loadAll(items: T[]): void {
    this.items.clear();
    for (const item of items) {
      this.items.set(item.id, item);
    }
  }

  clear(): void {
    this.items.clear();
  }
}
