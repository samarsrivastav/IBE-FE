import { render, screen } from "@testing-library/react";
import BannerArea from "./BannerArea";

describe("BannerArea Component", () => {
  const bannerStyle = { backgroundColor: "blue" };

  test("does not render loader when imageLoaded is true", () => {
    render(<BannerArea bannerStyle={bannerStyle} imageLoaded={true} />);
    
    const loaderElement = screen.queryByTestId("loader");
    expect(loaderElement).toBeNull();
  });

});
