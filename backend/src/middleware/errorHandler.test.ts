import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { errorHandler } from "./errorHandler.js";
import { AppError } from "../errors/AppError.js";

function createMockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const mockReq = {} as Request;
const mockNext = vi.fn() as NextFunction;

describe("errorHandler", () => {
  it("handles AppError with status and message", () => {
    const res = createMockRes();
    const err = new AppError("Not Found", 404);

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not Found" });
  });

  it("handles AppError with details", () => {
    const res = createMockRes();
    const details = [{ path: "title", message: "Required" }];
    const err = new AppError("Validation failed", 400, details);

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Validation failed",
      details,
    });
  });

  it("handles Prisma P2025 as 404", () => {
    const res = createMockRes();
    const err = new Prisma.PrismaClientKnownRequestError("Not found", {
      code: "P2025",
      clientVersion: "5.0.0",
    });

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Resource not found" });
  });

  it("handles Prisma P2002 as 409", () => {
    const res = createMockRes();
    const err = new Prisma.PrismaClientKnownRequestError("Unique constraint", {
      code: "P2002",
      clientVersion: "5.0.0",
    });

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Resource already exists",
    });
  });

  it("handles Prisma P2003 as 400", () => {
    const res = createMockRes();
    const err = new Prisma.PrismaClientKnownRequestError("FK constraint", {
      code: "P2003",
      clientVersion: "5.0.0",
    });

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid reference to related resource",
    });
  });

  it("handles SyntaxError with body as 400 invalid JSON", () => {
    const res = createMockRes();
    const err = new SyntaxError("Unexpected token") as SyntaxError & {
      body: string;
    };
    (err as unknown as Record<string, unknown>).body = "bad json";

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid JSON in request body",
    });
  });

  it("handles unknown errors as 500", () => {
    const res = createMockRes();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const err = new Error("Something unexpected");

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
    consoleSpy.mockRestore();
  });
});
