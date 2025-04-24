import { Box, Typography } from "@mui/material";
import "./Footer.scss";

export const Footer = () => {
  
  return (
    <Box 
      component="footer" 
      className="footer"
    >
      <img src= "/kickdrum-footer.png" alt="logo" className= "navbar_logo_img" />
      <Box className="footer__text">
        <Typography  className="footer__text--body2">&copy; Kickdrum Technology Group LLC. All rights reserved.</Typography>
        
      </Box>
    </Box>
  );
}