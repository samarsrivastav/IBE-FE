import {
  AppBar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useIntl } from "react-intl";

import styles from "./Navbar.module.scss";

interface NavbarProps {
  locale: string;
  setLocale: (locale: string) => void;
}

export const Navbar = ({ locale, setLocale }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const intl = useIntl();

  return (
    <AppBar position="static" className={styles.navbar} sx={{ backgroundColor: 'white' , boxShadow: 'none',padding:'0.8rem 2rem'}}>
      <Toolbar className={styles.toolbar}>
        {/* Logo */}
        <Typography variant="h6" className={styles.logo}>
          <div className={styles.title}>Kickdrum{" "}</div>
          <Typography component="span" className={styles.subtitle}>
            {intl.formatMessage({ id: "title" })}
          </Typography>
        </Typography>

        {/* Desktop Menu - Only show on medium screens and larger */}
        <Box className={styles.desktopMenu} sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography variant="body2" className={styles.menuItem}>
            {intl.formatMessage({ id: "myBookings" })}
          </Typography>
          
          <div className= {styles.language}>
          <LanguageIcon className={styles.languageIcon} />
          <Select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          variant="standard"
          disableUnderline
          IconComponent={() => <span />} // Removes the dropdown icon
          className={styles.select}
        >
          
          
          <MenuItem value="en">{intl.formatMessage({ id: "english" })}</MenuItem>
          <MenuItem value="es">{intl.formatMessage({ id: "spanish" })}</MenuItem>
        </Select>
        </div>

        <Select defaultValue="usd" variant="standard" disableUnderline IconComponent={() => <span />} className={styles.select}>
          <MenuItem value="usd">{intl.formatMessage({ id: "usd" })}</MenuItem>
          <MenuItem value="eur">{intl.formatMessage({ id: "eur" })}</MenuItem>
        </Select>
          <Button variant="contained" className={styles.loginButton}>
            {intl.formatMessage({ id: "login" })}
          </Button>
        </Box>

        {/* Mobile Menu Icon - Only show on xs and sm screens */}
        <IconButton
          className={styles.menuIcon}
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Menu - Only show when menu is open */}
      {menuOpen && (
        <Box className={styles.mobileMenu} sx={{ display: { xs: "flex", md: "none" } }}>
          <Typography variant="body2" className={styles.menuItem}>
            {intl.formatMessage({ id: "myBookings" })}
          </Typography>
          <IconButton>
            <LanguageIcon className={styles.languageIcon} />
          </IconButton>
          <Select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className={styles.select}
          >
            <MenuItem value="en">{intl.formatMessage({ id: "english" })}</MenuItem>
            <MenuItem value="es">{intl.formatMessage({ id: "spanish" })}</MenuItem>
          </Select>
          <Select defaultValue="usd" className={styles.select}>
            <MenuItem value="usd">{intl.formatMessage({ id: "usd" })}</MenuItem>
            <MenuItem value="eur">{intl.formatMessage({ id: "eur" })}</MenuItem>
          </Select>
          <Button variant="contained" className={styles.loginButton}>
            {intl.formatMessage({ id: "login" })}
          </Button>
        </Box>
      )}
    </AppBar>
  );
};