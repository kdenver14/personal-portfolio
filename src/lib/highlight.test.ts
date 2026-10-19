import { describe, expect, it } from "vitest";
import { splitComment } from "./highlight";

describe("splitComment", () => {
  it("separates a trailing C++ comment", () => {
    expect(splitComment("    ptr_deleter(args...);  // recurse", "cpp")).toEqual({
      code: "    ptr_deleter(args...);  ",
      comment: "// recurse",
    });
  });

  it("treats a whole-line Python comment as comment only", () => {
    expect(splitComment("#Pang calculate", "python")).toEqual({ code: "", comment: "#Pang calculate" });
  });

  it("ignores a marker inside a string literal", () => {
    expect(splitComment('print("# not a comment")', "python")).toEqual({
      code: 'print("# not a comment")',
      comment: "",
    });
  });

  it("returns the line unchanged when there is no comment", () => {
    expect(splitComment("delete first;", "cpp")).toEqual({ code: "delete first;", comment: "" });
  });
});
