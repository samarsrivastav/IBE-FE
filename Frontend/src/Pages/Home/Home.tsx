
import HomePage from "../../Component/HomePage/HomePage";
import "./Home.scss";
import { useIntl } from "react-intl";

export const Home = () => {
  const intl = useIntl();
 
  return (
    <div className="home-container">
      <HomePage />
    </div>
  );
};
