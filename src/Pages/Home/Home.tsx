import { useSelector } from "react-redux"
import env from "../../Config/envConfig"
import { CurrencyDisplay } from "../../Component/CurrencyDisplay/CurrencyDisplay"
export const Home = () => {
  const welcomeString = useSelector((state: any) => state.tempSlice.value)
  return (

    <div>
      <h1>Environment: {env.environment}</h1>
      {welcomeString}
      <p>Testing cicd pipeline-dev</p>
      <CurrencyDisplay/>
    </div>
  )
}
