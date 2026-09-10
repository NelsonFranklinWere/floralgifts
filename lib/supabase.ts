/**
 * PostgreSQL-backed drop-in replacement for lib/supabase.ts
 * Implements the subset of the supabase-js fluent API used by the app.
 * Reads connection settings from PG* / DATABASE_URL environment variables.
 */
import { Pool } from 'pg';

function parseDatabaseUrl(url: string | undefined) {
  if (!url) return {};
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: Number(u.port || 5432),
      database: decodeURIComponent(u.pathname.slice(1)),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
    };
  } catch {
    return {};
  }
}

const fromUrl = parseDatabaseUrl(process.env.DATABASE_URL);

const pool = new Pool({
  host: process.env.PGHOST || fromUrl.host,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : fromUrl.port,
  database: process.env.PGDATABASE || fromUrl.database,
  user: process.env.PGUSER || fromUrl.user,
  password: process.env.PGPASSWORD || fromUrl.password,
  max: 10,
});

export type PostgrestResult = {
  data: any;
  error: { message?: string; details?: string; hint?: string; code?: string } | null;
};

class QueryBuilder implements PromiseLike<PostgrestResult> {
  private table: string;
  private selectCols: string = '*';
  private wheres: string[] = [];
  private params: any[] = [];
  private orders: string[] = [];
  private limitVal: number | null = null;
  private singleMode: boolean = false;
  private insertData: any = null;
  private updateData: any = null;
  private deleteMode: boolean = false;

  constructor(table: string) { this.table = table; }

  // PromiseLike interface: makes await work
  then<TResult1 = PostgrestResult, TResult2 = never>(
    onfulfilled?: ((value: PostgrestResult) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.buildAndExec().then(onfulfilled as any, onrejected as any) as PromiseLike<TResult1 | TResult2>;
  }

  select(cols?: string) { this.selectCols = cols || '*'; return this; }
  eq(col: string, val: any) { this.params.push(val); this.wheres.push('"' + col + '" = $' + this.params.length); return this; }
  neq(col: string, val: any) { this.params.push(val); this.wheres.push('"' + col + '" <> $' + this.params.length); return this; }
  in(col: string, vals: any[]) {
    if (vals.length === 0) { this.wheres.push('false'); return this; }
    const ph = vals.map(v => { this.params.push(v); return '$' + this.params.length; }).join(',');
    this.wheres.push('"' + col + '" IN (' + ph + ')');
    return this;
  }
  contains(col: string, vals: any[]) { this.params.push(vals); this.wheres.push('"' + col + '" @> $' + this.params.length + '::text[]'); return this; }
  order(col: string, opts?: { ascending?: boolean }) { this.orders.push('"' + col + '" ' + (opts?.ascending === false ? 'DESC' : 'ASC')); return this; }
  limit(n: number) { this.limitVal = n; return this; }
  single() { this.singleMode = true; return this; }
  insert(data: any) { this.insertData = data; return this; }
  update(data: any) { this.updateData = data; return this; }
  delete() { this.deleteMode = true; return this; }

  private buildWhere() { return this.wheres.length ? (' WHERE ' + this.wheres.join(' AND ')) : ''; }

  private async buildAndExec(): Promise<PostgrestResult> {
    try {
      if (this.insertData !== null) return await this.doInsert();
      if (this.updateData !== null) return await this.doUpdate();
      if (this.deleteMode) return await this.doDelete();
      return await this.doSelect();
    } catch (err: any) {
      return { data: null, error: { message: err.message, details: err.details, code: String(err.code || '') } };
    }
  }

  private async doSelect(): Promise<PostgrestResult> {
    const order = this.orders.length ? (' ORDER BY ' + this.orders.join(', ')) : '';
    const limit = this.limitVal ? (' LIMIT ' + this.limitVal) : '';
    const sql = 'SELECT ' + this.selectCols + ' FROM "' + this.table + '"' + this.buildWhere() + order + limit;
    const res = await pool.query(sql, this.params);
    const rows = res.rows;
    if (this.singleMode) {
      if (!rows.length) return { data: null, error: { code: 'PGRST116', message: 'No rows returned', details: 'The result contains 0 rows' } };
      return { data: rows[0], error: null };
    }
    return { data: rows, error: null };
  }

  private async doInsert(): Promise<PostgrestResult> {
    const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
    const results: any[] = [];
    for (const item of items) {
      const keys = Object.keys(item).filter(k => item[k] !== undefined);
      const colNames = keys.map(k => '"' + k + '"').join(', ');
      const vals = keys.map(k => item[k]);
      const ph = vals.map((_, i) => '$' + (i + 1)).join(', ');
      const res = await pool.query('INSERT INTO "' + this.table + '" (' + colNames + ') VALUES (' + ph + ') RETURNING *', vals);
      results.push(res.rows[0]);
    }
    return { data: Array.isArray(this.insertData) ? results : results[0], error: null };
  }

  private async doUpdate(): Promise<PostgrestResult> {
    const data = this.updateData;
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    const vals: any[] = [...this.params];
    const sets = keys.map(k => { vals.push(data[k]); return '"' + k + '" = $' + vals.length; });
    const sql = 'UPDATE "' + this.table + '" SET ' + sets.join(', ') + this.buildWhere() + ' RETURNING *';
    const res = await pool.query(sql, vals);
    return { data: res.rows[0], error: null };
  }

  private async doDelete(): Promise<PostgrestResult> {
    const sql = 'DELETE FROM "' + this.table + '"' + this.buildWhere() + ' RETURNING *';
    await pool.query(sql, this.params);
    return { data: null, error: null };
  }
}

const rpcExecutor = async (fnName: string, args?: Record<string, any>) => {
  try {
    if (fnName === 'bulk_update_review_sort_order' && args?.updates_arg) {
      const updates = args.updates_arg;
      const arr = typeof updates === 'string' ? JSON.parse(updates) : updates;
      for (const u of (arr || [])) {
        if (!u || !u.id) continue;
        await pool.query('UPDATE reviews SET sort_order = $1 WHERE id = $2', [u.sort_order, u.id]);
      }
      return { data: { ok: true }, error: null };
    }
    return { data: null, error: { message: 'rpc not supported: ' + fnName } };
  } catch (e: any) {
    return { data: null, error: { message: e.message } };
  }
};

export const supabase = { from: (t: string) => new QueryBuilder(t), rpc: rpcExecutor };
export const supabaseAdmin = { from: (t: string) => new QueryBuilder(t), rpc: rpcExecutor };
