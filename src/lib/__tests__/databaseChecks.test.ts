import { describe, it, expect, vi, afterEach } from "vitest";
import { runDatabaseChecks } from "../databaseChecks";

describe("runDatabaseChecks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call checkDbTableExists, checkDbTableColumns, checkTableExistence, and checkTableColumns in the correct order", async () => {
    const callOrder: string[] = [];

    const checkDbTableExistsMock = vi.fn().mockImplementation(() => {
      callOrder.push("checkDbTableExists");
      return Promise.resolve(true);
    });
    const checkDbTableColumnsMock = vi.fn().mockImplementation(() => {
      callOrder.push("checkDbTableColumns");
      return Promise.resolve(true);
    });
    const checkTableExistenceMock = vi.fn().mockImplementation(() => {
      callOrder.push("checkTableExistence");
      return Promise.resolve();
    });
    const checkTableColumnsMock = vi.fn().mockImplementation(() => {
      callOrder.push("checkTableColumns");
      return Promise.resolve();
    });

    await runDatabaseChecks({
      checkDbTableExists: checkDbTableExistsMock,
      checkDbTableColumns: checkDbTableColumnsMock,
      checkTableExistence: checkTableExistenceMock,
      checkTableColumns: checkTableColumnsMock,
    });

    expect(checkDbTableExistsMock).toHaveBeenCalled();
    expect(checkDbTableColumnsMock).toHaveBeenCalled();
    expect(checkTableExistenceMock).toHaveBeenCalled();
    expect(checkTableColumnsMock).toHaveBeenCalled();

    expect(callOrder).toEqual([
      "checkDbTableExists",
      "checkDbTableColumns",
      "checkTableExistence",
      "checkTableColumns",
    ]);
  });

  it("should handle errors by logging the error and exiting the process", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as (code?: number) => never);

    const checkDbTableExistsMock = vi
      .fn()
      .mockRejectedValue(new Error("Test error"));
    const checkDbTableColumnsMock = vi.fn().mockResolvedValue(true);
    const checkTableExistenceMock = vi.fn().mockResolvedValue(undefined);
    const checkTableColumnsMock = vi.fn().mockResolvedValue(undefined);

    await expect(
      runDatabaseChecks({
        checkDbTableExists: checkDbTableExistsMock,
        checkDbTableColumns: checkDbTableColumnsMock,
        checkTableExistence: checkTableExistenceMock,
        checkTableColumns: checkTableColumnsMock,
      })
    ).rejects.toThrow(
      "An error occurred while checking the database: Test error"
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "An error occurred while checking the database: Test error"
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
