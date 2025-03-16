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
import { setCurrency } from "../../Redux/slice/currencySlice";
import { useDispatch } from "react-redux"; 
import styles from "./Navbar.module.scss";
import { AppDispatch } from "../../Redux/store";

interface NavbarProps {
  locale: string;
  setLocale: (locale: string) => void;
}

export const Navbar = ({ locale, setLocale }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();

  const handleCurrencyChange = (event: any) => {
    dispatch(setCurrency(event.target.value));
  }

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.navbar__toolbar}>
        {/* Logo */}
        <Typography variant="h6" className={styles.navbar__logo}>
          <div className={styles.navbar__logo__title}>Kickdrum{" "}</div>
          <Typography component="span" className={styles.navbar__logo__subtitle}>
            {intl.formatMessage({ id: "title" })}
          </Typography>
        </Typography>

        {/* Desktop Menu - Only show on medium screens and larger */}
        <Box className={styles.navbar__desktopMenu} sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography variant="body2" className={styles.navbar__desktopMenu__menuItem}>
            {intl.formatMessage({ id: "myBookings" })}
          </Typography>
          
          <div className={styles.navbar__desktopMenu__language}>
            <LanguageIcon className={styles.navbar__desktopMenu__language__icon} />
            <Select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              variant="standard"
              disableUnderline
              IconComponent={() => <span />} // Removes the dropdown icon
              className={styles.navbar__desktopMenu__language__select}
            >
              <MenuItem value="en">{intl.formatMessage({ id: "english" })}</MenuItem>
              <MenuItem value="es">{intl.formatMessage({ id: "spanish" })}</MenuItem>
            </Select>
          </div>

          <Select defaultValue="usd" variant="standard" disableUnderline IconComponent={() => <span />} className={styles.navbar__desktopMenu__select} onChange={handleCurrencyChange}>
            <MenuItem value="usd">{intl.formatMessage({ id: "usd" })}</MenuItem>
            <MenuItem value="eur">{intl.formatMessage({ id: "eur" })}</MenuItem>
          </Select>
          <Button variant="contained" className={styles.navbar__desktopMenu__loginButton}>
            {intl.formatMessage({ id: "login" })}
          </Button>
        </Box>

        {/* Mobile Menu Icon - Only show on xs and sm screens */}
        <IconButton
          className={styles.navbar__menuIcon}
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Menu - Only show when menu is open */}
      {menuOpen && (
        <Box className={styles.navbar__mobileMenu} sx={{ display: { xs: "flex", md: "none" } }}>
          <Typography variant="body2" className={styles.navbar__mobileMenu__menuItem}>
            {intl.formatMessage({ id: "myBookings" })}
          </Typography>
          <IconButton>
            <LanguageIcon className={styles.navbar__mobileMenu__language__icon} />
          </IconButton>
          <Select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className={styles.navbar__mobileMenu__select}
          >
            <MenuItem value="en">{intl.formatMessage({ id: "english" })}</MenuItem>
            <MenuItem value="es">{intl.formatMessage({ id: "spanish" })}</MenuItem>
          </Select>
          <Select defaultValue="usd" className={styles.navbar__mobileMenu__select} onChange={handleCurrencyChange}>
            <MenuItem value="usd">{intl.formatMessage({ id: "usd" })}</MenuItem>
            <MenuItem value="eur">{intl.formatMessage({ id: "eur" })}</MenuItem>
          </Select>
          <Button variant="contained" className={styles.navbar__mobileMenu__loginButton}>
            {intl.formatMessage({ id: "login" })}
          </Button>
        </Box>
      )}
    </AppBar>
  );
};