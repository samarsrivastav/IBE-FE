import { Box } from '@mui/material'
import { HelpSection } from '../HelpSection/HelpSection'
import { Itinerary } from '../Itinerary/Itinerary'

export const AsideComponent = () => {
  
  return (
    <Box
        sx={{
            position: "fixed",
            right: "10rem",
            top: "15rem",
        }}>
        <Itinerary/>
        <HelpSection />
    </Box>
  )
}
