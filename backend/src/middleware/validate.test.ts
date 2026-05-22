import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "./validate.js";
import { AppError } from "../errors/AppError.js";

const testSchema = z.object({
  name: z.string().min(1),
});

function createMockReq(overrides: Partial<Request> = {}) {
  return { body: {}, params: {}, ...overrides } as Request;
}

describe("validate middleware", () => {
  it("calls next() with no error when body is valid", () => {
    const req = createMockReq({ body: { name: "Test" } });
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    validate(testSchema, "body")(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: "Test" });
  });

  it("replaces req[source] with parsed data (strips extra fields)", () => {
    const req = createMockReq({ body: { name: "Test", extra: "field" } });
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    validate(testSchema, "body")(req, res, next);

    expect(req.body).toEqual({ name: "Test" });
  });

  it("calls next with AppError 400 when validation fails", () => {
    const req = createMockReq({ body: { name: "" } });
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    validate(testSchema, "body")(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0]?.[0] as AppError;
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Validation failed");
    expect(err.details).toBeDefined();
  });

  it("validates params source", () => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const req = createMockReq({
      params: { id: "550e8400-e29b-41d4-a716-446655440000" },
    });
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    validate(paramsSchema, "params")(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("rejects invalid params", () => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const req = createMockReq({ params: { id: "not-uuid" } });
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    validate(paramsSchema, "params")(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
