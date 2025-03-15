
import { useSelector } from "react-redux"
import env from "../../Config/envConfig"
import HomePage from "../../Component/HomePage/HomePage"
import { CurrencyDisplay } from "../../Component/CurrencyDisplay/CurrencyDisplay"
export const Home = () => {
  const welcomeString = useSelector((state: any) => state.tempSlice.value)
  return (
    <div className="home-container" style={{ 
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <h1>Welcome to Kickdrum</h1>
      <div className="environment-info">
        <h2>Environment: {env.environment}</h2>
      </div>
      
      <div className="welcome-content">
        {welcomeString && <p className="welcome-message">{welcomeString}</p>}
        <p>Testing cicd pipeline</p>
      </div>
      
      <div className="actions">
        <button 
          onClick={() => console.log("Action button clicked")}
          style={{
            backgroundColor: "#10072C",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Get Started
        </button>
        
        {/* Debug button - remove in production */}
        {(env.environment === "dev"  || env.environment === "qa" )&& (
          <button 
            onClick={() => {throw new Error("This is your first error!");}}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px 20px",
              marginLeft: "10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Break the world
          </button>
        )}

        <CurrencyDisplay/>
        <HomePage />
      </div>    
    </div>
  )
}