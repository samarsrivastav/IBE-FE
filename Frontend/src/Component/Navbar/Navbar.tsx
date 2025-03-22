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
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { setCurrency } from "../../Redux/slice/currencySlice";
import { useDispatch } from "react-redux"; 
import styles from "./Navbar.module.scss";
import { AppDispatch } from "../../Redux/store";
import fetchTenantConfig  from "../../Redux/thunk/tenantConfigThunk";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";


interface NavbarProps {
  locale: string;
  setLocale: (locale: string) => void;
}

export const Navbar = ({ locale, setLocale }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();

  const availableLanguages = ["en", "es"]; // Languages supported in the dropdown

  useEffect(() => {
    dispatch(fetchTenantConfig());
  }, []);

  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);
  console.log("tenantConfig", tenantConfig);

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.split("-")[0]; // Extract primary language code (e.g., 'en-US' -> 'en')
    
    // Ensure it's a supported language
    if (availableLanguages.includes(browserLang)) {
      setLocale(browserLang);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleCurrencyChange = (event: any) => {
    dispatch(setCurrency(event.target.value));
  };

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.navbar__toolbar}>
        {/* Logo */}
      <Typography variant="h6" className={styles.navbar__logo}>
      <div className={styles.navbar__logo__title}>
        {tenantConfig.configuration.headerLogo ? tenantConfig.configuration.headerLogo : "Kickdrum"}
      </div>
      {tenantConfig.configuration.headerLogo && (
        <div className={styles.navbar__logo__subtitle}>
          {intl.formatMessage({ id: "title" })}
        </div>
      )}
      </Typography>

        {/* Desktop Menu */}
        <Box className={styles.navbar__desktopMenu} sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography variant="body2" className={styles.navbar__desktopMenu__menuItem}>
            {intl.formatMessage({ id: "myBookings" })}
          </Typography>
          
          {/* Language Selection */}
          <div className={styles.navbar__desktopMenu__language}>
            <LanguageIcon className={styles.navbar__desktopMenu__language__icon} />
            <Select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              variant="standard"
              disableUnderline
              IconComponent={() => <span />}
              className={styles.navbar__desktopMenu__language__select}
            >
              <MenuItem value="en">{intl.formatMessage({ id: "en" })}</MenuItem>
              <MenuItem value="es">{intl.formatMessage({ id: "sp" })}</MenuItem>
            </Select>
          </div>

          {/* Currency Selection */}
          <Select defaultValue="usd" variant="standard" disableUnderline IconComponent={() => <span />} className={styles.navbar__desktopMenu__select} onChange={handleCurrencyChange}>
            <MenuItem value="usd">{intl.formatMessage({ id: "usd" })}</MenuItem>
            <MenuItem value="eur">{intl.formatMessage({ id: "eur" })}</MenuItem>
          </Select>
          <Button variant="contained" className={styles.navbar__desktopMenu__loginButton}>
            {intl.formatMessage({ id: "login" })}
          </Button>
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          className={styles.navbar__menuIcon}
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Menu */}
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
