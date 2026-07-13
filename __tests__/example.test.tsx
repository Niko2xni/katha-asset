import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("Example Test", () => {
  it("should render successfully", () => {
    render(<div>Hello Vitest!</div>);
    expect(screen.getByText("Hello Vitest!")).toBeInTheDocument();
  });
});
