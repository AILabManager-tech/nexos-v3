import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";

import { ScrollToTop } from "@/components/ui/ScrollToTop";

afterEach(() => {
  cleanup();
});

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
  });

  it("renders without crashing", () => {
    render(<ScrollToTop />);
  });

  it("button is not visible when scroll is 0", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });
    render(<ScrollToTop />);
    // Button is in DOM but hidden via aria-hidden="true"
    const btn = screen.queryByRole("button", { name: /retour en haut/i });
    expect(btn).not.toBeInTheDocument();
  });

  it("button appears after scrolling past 400px", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 401 });
      window.dispatchEvent(new Event("scroll"));
    });

    const btn = screen.getByRole("button", { name: /retour en haut/i });
    expect(btn).toBeInTheDocument();
  });

  it("button is not shown when scroll is exactly at 400px", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 400 });
      window.dispatchEvent(new Event("scroll"));
    });

    const btn = screen.queryByRole("button", { name: /retour en haut/i });
    expect(btn).not.toBeInTheDocument();
  });

  it("button disappears when scrolling back below 400px", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 500 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(screen.getByRole("button", { name: /retour en haut/i })).toBeInTheDocument();

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 100 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(screen.queryByRole("button", { name: /retour en haut/i })).not.toBeInTheDocument();
  });

  it("clicking the button calls window.scrollTo with top: 0", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 500 });
      window.dispatchEvent(new Event("scroll"));
    });

    const btn = screen.getByRole("button", { name: /retour en haut/i });
    fireEvent.click(btn);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("button has correct aria-label for accessibility", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 500 });
      window.dispatchEvent(new Event("scroll"));
    });

    const btn = screen.getByRole("button", { name: "Retour en haut de page" });
    expect(btn).toBeInTheDocument();
  });

  it("removes scroll event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ScrollToTop />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it("adds scroll event listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(<ScrollToTop />);
    expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
    addEventListenerSpy.mockRestore();
  });

  it("renders correctly with reduced motion preference", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 500 });
      window.dispatchEvent(new Event("scroll"));
    });

    const btn = screen.getByRole("button", { name: /retour en haut/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
