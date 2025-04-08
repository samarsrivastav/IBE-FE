import {
  AppBar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";
import { setCurrency } from "../../Redux/slice/currencySlice";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Navbar.module.scss";
import { AppDispatch, RootState } from "../../Redux/store";
import fetchTenantConfig from "../../Redux/thunk/tenantConfigThunk";
import { LOGO_KICKDRUM_DEFAULT } from "../../Constant";
import { Link } from "react-router-dom";
import ImageWithFallback from "../Util/ImageWithFallback";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "En" },
  // { code: "es", name: "Español" },
  // { code: "de", name: "Deutsch" },
  { code: "hi", name: "हिन्दी" },
];

interface NavbarProps {
  language: string;
  setLanguage: (language: string) => void;
}

export const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currency } = useSelector((state: RootState) => state.currency);
  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);
  
  useEffect(() => {
    dispatch(fetchTenantConfig());
    const storedCurrency = localStorage.getItem("selectedCurrency") || "usd";
    dispatch(setCurrency(storedCurrency));
  }, [dispatch]);
  localStorage.setItem("taxes", JSON.stringify(tenantConfig.configuration.taxes));
  
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    if ((window as any).changeGoogleTranslateLanguage) {
      (window as any).changeGoogleTranslateLanguage(newLanguage);
    }
    localStorage.setItem("preferredLanguage", newLanguage);
  };

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    const newCurrency = event.target.value;
    dispatch(setCurrency(newCurrency));
  };

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.navbar__toolbar} sx={{paddingLeft:"0 !important"}}>
        <Link to="/" className={styles.navbar__logo}>
          <Typography variant="h6" className={styles.navbar__logo}>
            <ImageWithFallback
              src={tenantConfig.configuration.headerLogo}
              fallback={LOGO_KICKDRUM_DEFAULT}
              alt="logo"
              className={styles.navbar_logo_img}
            />
            <div className={styles.navbar__logo__subtitle}>
              Internet Booking Engine
            </div>
          </Typography>
        </Link>

        <Box
          className={styles.navbar__desktopMenu}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Lato', sans-serif !important",
              fontWeight:"700",
              lineHeight:"140%",
              width:"6.375rem",
              height:"1.25rem",
              letterSpacing:"2%"
            }}
            className={styles.navbar__desktopMenu__menuItem}
          >
            {"MY BOOKINGS"}
          </Typography>
          <div className={styles.navbar__desktopMenu__language}>
            <Select
              sx={{
                height:"1.1875rem",
                width:"2.8125rem",
                color:"#26266D",
                ".MuiSelect-select":{
                  height:"1.1875rem",
                  minHeight:"1.1875rem",
                  padding:"0 !important",
                },
                "&.MuiSelect-root::after, &.MuiSelect-root::before": {
                  display: "none",
                },
                "& .MuiSelect-icon": {
                  display: "none !important",
                },
              }}
              value={language}
              onChange={handleLanguageChange}
              variant="standard"
              disableUnderline
              className="notranslate"
              renderValue={(selected) => (
                <Box sx={{height:"1.1875rem", display: "flex", alignItems: "center", }}>
                  <LanguageIcon
                    sx={{ marginRight: 1, height:"16px",width:"16px",margin:"0 !important" }}
                    className={styles.navbar__desktopMenu__language__icon}
                  />
                  {
                    SUPPORTED_LANGUAGES.find((lang) => lang.code === selected)
                      ?.name
                  }
                </Box>
              )}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem
                  key={lang.code}
                  value={lang.code}
                  style={{ top: "0" }}
                  className="notranslate"
                >
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Select
            value={currency}
            variant="standard"
            disableUnderline
            onChange={handleCurrencyChange}
            sx={{
              height:"1.25rem",
              width:"3.1875rem",
              color:"#26266D",
              fontFamily:"Lato",
              "& .MuiSelect-select": {
                padding: "0 !important",
                minHeight:"1.25rem !important",
                height:"1.25rem !important"
              },
              "&.MuiSelect-root::after, &.MuiSelect-root::before": {
                display: "none",
              },
              "& .MuiSelect-icon": {
                display: "none !important",
              },
            }}  
          >
            <MenuItem value="usd">{"$ USD"}</MenuItem>
            <MenuItem value="eur">{"€ EUR"}</MenuItem>
            <MenuItem value="inr">{"₹ INR"}</MenuItem>
          </Select>
          <Button
            variant="contained"
            className={styles.navbar__desktopMenu__loginButton}
          >
            <p>{"login"}</p>
          </Button>
        </Box>

        <IconButton
          className={styles.navbar__menuIcon}
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {menuOpen && (
        <Box
          className={styles.navbar__mobileMenu}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <Typography
            variant="body2"
            className={styles.navbar__mobileMenu__menuItem}
          >
            {"MY BOOKINGS"}
          </Typography>
          <IconButton>
            <LanguageIcon
              className={styles.navbar__mobileMenu__language__icon}
            />
          </IconButton>
          <Select
            value={language}
            onChange={handleLanguageChange}
            className={styles.navbar__mobileMenu__select}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={currency}
            className={styles.navbar__mobileMenu__select}
            onChange={handleCurrencyChange}
          >
            <MenuItem value="usd">{"$ USD"}</MenuItem>
            <MenuItem value="eur">{"€ EUR"}</MenuItem>
            <MenuItem value="inr">{"₹ INR"}</MenuItem>
          </Select>
          <Button
            variant="contained"
            className={styles.navbar__mobileMenu__loginButton}
          >
            {"login"}
          </Button>
        </Box>
      )}
    </AppBar>
  );
};
