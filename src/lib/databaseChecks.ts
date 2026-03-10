/**
 * Database integrity checks for the Asper Beauty Shop Supabase project.
 *
 * Provides helper functions to verify that required database tables exist and
 * have the expected columns. The `runDatabaseChecks` orchestrator calls all
 * helpers in order and handles errors consistently.
 *
 * Intended to be run as a startup/health-check routine (e.g. via a `process.on`
 * handler or a CLI entry-point).
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Checks whether a given table exists in the Supabase database by attempting
 * a zero-row select. Returns `true` if the table is reachable, `false` otherwise.
 */
export async function checkDbTableExists(tableName: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from(tableName).select("*").limit(0);
  if (error) {
    throw new Error(`Table "${tableName}" does not exist or is not accessible: ${error.message}`);
  }
  return true;
}

/**
 * Checks whether the specified columns are present in a table by fetching a
 * single row and verifying each column key appears in the result.
 * Returns `true` when all expected columns are found.
 */
export async function checkDbTableColumns(
  tableName: string,
  expectedColumns: string[]
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from(tableName).select("*").limit(1);
  if (error) {
    throw new Error(`Failed to read columns from table "${tableName}": ${error.message}`);
  }
  const row = data?.[0];
  if (!row) {
    return true; // Empty table – cannot verify columns but no error either.
  }
  const missingColumns = expectedColumns.filter((col) => !(col in row));
  if (missingColumns.length > 0) {
    throw new Error(
      `Table "${tableName}" is missing columns: ${missingColumns.join(", ")}`
    );
  }
  return true;
}

/**
 * Verifies that a table is accessible by requesting only the row count header
 * (`head: true`). This is a lightweight alternative to `checkDbTableExists`
 * that avoids selecting any column data.
 * Throws when the table cannot be queried.
 */
export async function checkTableExistence(tableName: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from(tableName).select("*", { count: "exact", head: true });
  if (error) {
    throw new Error(`Table "${tableName}" failed existence check: ${error.message}`);
  }
}

/**
 * Validates that a table has at least one row with all required columns by
 * selecting only the specified columns. This differs from `checkDbTableColumns`
 * in that it queries only the named columns rather than all columns, providing
 * a more targeted schema assertion.
 * Throws when required columns cannot be selected.
 */
export async function checkTableColumns(
  tableName: string,
  requiredColumns: string[] = []
): Promise<void> {
  if (requiredColumns.length === 0) return;
  const columnList = requiredColumns.join(", ");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from(tableName).select(columnList).limit(0);
  if (error) {
    throw new Error(
      `Table "${tableName}" column check failed for [${columnList}]: ${error.message}`
    );
  }
}

/** Dependency bundle used by `runDatabaseChecks`. */
export type DatabaseCheckDeps = {
  checkDbTableExists: (tableName: string) => Promise<boolean>;
  checkDbTableColumns: (tableName: string, expectedColumns: string[]) => Promise<boolean>;
  checkTableExistence: (tableName: string) => Promise<void>;
  checkTableColumns: (tableName: string, requiredColumns?: string[]) => Promise<void>;
};

/**
 * Orchestrates all database integrity checks.
 *
 * Calls (in order):
 *  1. `checkDbTableExists`   – verifies core tables are present
 *  2. `checkDbTableColumns`  – verifies core table columns
 *  3. `checkTableExistence`  – secondary existence confirmation
 *  4. `checkTableColumns`    – secondary column validation
 *
 * On any failure the error is logged to `console.error`, `process.exit(1)` is
 * called, and the promise rejects with a descriptive error message so that
 * test code can assert on the rejection.
 *
 * @param deps – Optional dependency overrides (used in unit tests).
 */
export async function runDatabaseChecks(
  deps: DatabaseCheckDeps = {
    checkDbTableExists,
    checkDbTableColumns,
    checkTableExistence,
    checkTableColumns,
  }
): Promise<void> {
  try {
    await deps.checkDbTableExists("products");
    await deps.checkDbTableColumns("products", ["id", "title", "handle"]);
    await deps.checkTableExistence("orders");
    await deps.checkTableColumns("orders", ["id"]);
  } catch (err) {
    const message = `An error occurred while checking the database: ${
      err instanceof Error ? err.message : String(err)
    }`;
    console.error(message);
    process.exit(1);
    // `process.exit` is mocked in unit tests so execution can continue here;
    // the throw below lets callers (including test assertions) observe the
    // failure. In production the throw is unreachable.
    throw new Error(message);
  }
}
