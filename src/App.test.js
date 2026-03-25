import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

jest.mock("./firebase", () => ({
  db: {},
  auth: {},
  app: {},
}));

jest.mock("./components/Invoice.jsx", () => () => null);

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  signOut: jest.fn(),
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(async () => ({ docs: [] })),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  getFirestore: jest.fn(() => ({})),
}));

test("renders maintenance management app", () => {
  render(<App />);
  const headerElement = screen.getByText(/Maintenance Manager/i);
  expect(headerElement).toBeInTheDocument();
});
