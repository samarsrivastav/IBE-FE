import { Box, Container, Typography } from "@mui/material";
import "./Footer.scss"
export const Footer = () => {
  return (
    <Box component="footer" sx={{
      backgroundColor: "#10072C",
      color: "white",
      py: 2,
      px: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">Kickdrum</Typography>
        <Box textAlign="right">
          <Typography variant="body2">&copy; Kickdrum Technology Group LLC.</Typography>
          <Typography variant="body2">All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
}
