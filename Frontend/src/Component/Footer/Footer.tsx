import { Box, Typography } from "@mui/material";

import "./Footer.scss";

export const Footer = () => {
  return (
    <Box 
      component="footer" 
      className="footer"
    >
      <Typography variant="h6" className="footer__title">Kickdrum</Typography>
      <Box className="footer__text">
        <Typography variant="body2" className="footer__text--body2">&copy; Kickdrum Technology Group LLC.</Typography>
        <Typography variant="body2" className="footer__text--body2">All rights reserved.</Typography>
      </Box>
    </Box>
  );
}