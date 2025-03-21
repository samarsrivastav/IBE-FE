import { Box, Typography } from "@mui/material";

import "./Footer.scss";

export const Footer = () => {
  return (
    <Box 
      component="footer" 
      className="footer"
    >
      <Typography variant="h4" className="footer__title">Kickdrum</Typography>
      <Box className="footer__text">
        <Typography  className="footer__text--body2">&copy; Kickdrum Technology Group LLC.</Typography>
        <Typography  className="footer__text--body2">All rights reserved.</Typography>
      </Box>
    </Box>
  );
}