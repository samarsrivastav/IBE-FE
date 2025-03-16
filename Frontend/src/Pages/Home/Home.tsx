import { useSelector } from "react-redux";
import env from "../../Config/envConfig";
import HomePage from "../../Component/HomePage/HomePage";
import { CurrencyDisplay } from "../../Component/CurrencyDisplay/CurrencyDisplay";
import "./Home.scss";

export const Home = () => {
  const welcomeString = useSelector((state: any) => state.tempSlice.value);
  return (
    <div className="home-container">
      <h1 className="home-container__header">Welcome to Kickdrum</h1>
      <div className="home-container__environment-info">
        <h2>Environment: {env.environment}</h2>
      </div>

      <div className="home-container__welcome-content">
        {welcomeString && <p className="welcome-message">{welcomeString}</p>}
      </div>
      <div className="home-container__actions">
        <button
          onClick={() => console.log("Action button clicked")}
          className="home-container__actions__button"
        >
          Get Started
        </button>

        {/* Debug button - remove in production */}
        {env.environment != "prod" && (
          <button
            onClick={() => {
              throw new Error("This is your first error!");
            }}
            className="home-container__actions__button home-container__actions__button--debug"
          >
            Break the world
          </button>
        )}
      </div>
      <CurrencyDisplay />
      <HomePage />
    </div>
  );
};
