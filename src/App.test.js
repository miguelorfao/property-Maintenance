import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders maintenance management app", () => {
  render(<App />);
  const headerElement = screen.getByText(/Maintenance Management/i);
  expect(headerElement).toBeInTheDocument();
});
