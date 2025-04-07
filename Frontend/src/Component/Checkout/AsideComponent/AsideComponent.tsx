import { Box } from '@mui/material'
import { HelpSection } from '../HelpSection/HelpSection'
import { Itinerary } from '../Itinerary/Itinerary'

export const AsideComponent = () => {
  
  return (
    <Box
      sx={{
      position: {
        xs: "static",
        lg: "fixed",
      },
      width: "min-content",
      margin: "0 auto",
      right: {
        lg: "10rem",
      },
      top: {
        lg: "15rem",
      },
      "@media (max-width: 1300px)": {
        position: "static",
      },
      }}>
      <Itinerary />
      <HelpSection />
    </Box>
  )
}
