import { Box } from '@mui/material'
import { HelpSection } from '../HelpSection/HelpSection'
import { Itinerary } from '../Itinerary/Itinerary'

export const AsideComponent = () => {
  return (
    <Box
      sx={{
        width: "min-content",
        "@media (min-width: 1024px)": {
          position: "sticky",
          top: "2rem"
        },
        "@media (max-width: 1023px)": {
          width: "100%",
          maxWidth: "400px"
        }
      }}>
      <Itinerary />
      <HelpSection />
    </Box>
  )
}
