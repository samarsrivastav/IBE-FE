import { Box, Typography } from "@mui/material";

import "./Footer.scss";

export const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        backgroundColor: "#10072C",
        color: "white",
        py: 2,
        px: {xs: 2, md: 9},
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold" fontSize={{xs: "1.5rem", md: "2rem"}}>Kickdrum</Typography>
      <Box textAlign="right">
        <Typography variant="body2">&copy; Kickdrum Technology Group LLC.</Typography>
        <Typography variant="body2">All rights reserved.</Typography>
      </Box>
    </Box>
  );
}