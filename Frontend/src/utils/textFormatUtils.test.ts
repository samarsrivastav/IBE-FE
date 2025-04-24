import { formatCamelText } from "./textFormatUtils"; // Update with actual path

describe("formatCamelText", () => {
  test("converts snake_case to Title Case", () => {
    expect(formatCamelText("hello_world")).toBe("Hello World");
    expect(formatCamelText("this_is_a_test")).toBe("This Is A Test");
  });

  test("handles single words correctly", () => {
    expect(formatCamelText("hello")).toBe("Hello");
    expect(formatCamelText("test")).toBe("Test");
  });

  test("works with uppercase input", () => {
    expect(formatCamelText("HELLO_WORLD")).toBe("Hello World");
    expect(formatCamelText("UPPER_CASE_TEST")).toBe("Upper Case Test");
  });

  test("returns an empty string when given an empty input", () => {
    expect(formatCamelText("")).toBe("");
  });

  test("preserves formatting when input has no underscores", () => {
    expect(formatCamelText("alreadyFormatted")).toBe("Alreadyformatted");
  });
});
