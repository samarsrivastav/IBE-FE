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

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "hi", name: "हिन्दी" },
];

const LANGUAGE_DISPLAY = {
  en: { myBookings: "My Bookings", login: "Login", title: "Internet Booking System", usd: "USD", eur: "EUR" },
  es: { myBookings: "Mis Reservas", login: "Iniciar Sesión", title: "Sistema de Reservas", usd: "USD", eur: "EUR" },
  fr: { myBookings: "Mes Réservations", login: "Connexion", title: "Système de Réservation", usd: "USD", eur: "EUR" },
  de: { myBookings: "Meine Buchungen", login: "Anmelden", title: "Buchungssystem", usd: "USD", eur: "EUR" },
  hi: { myBookings: "मेरी बुकिंग", login: "लॉगिन", title: "इंटरनेट बुकिंग सिस्टम", usd: "USD", eur: "EUR" },
};

interface NavbarProps {
  language: string;
  setLanguage: (language: string) => void;
}

export const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);

  useEffect(() => {
    dispatch(fetchTenantConfig());
  }, [dispatch]);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    if ((window as any).changeGoogleTranslateLanguage) {
      (window as any).changeGoogleTranslateLanguage(newLanguage);
    }
    localStorage.setItem("preferredLanguage", newLanguage);
  };

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    dispatch(setCurrency(event.target.value));
  };

  const getText = (key: string): string => {
    return LANGUAGE_DISPLAY[language as keyof typeof LANGUAGE_DISPLAY]?.[key as keyof typeof LANGUAGE_DISPLAY.en] || 
           LANGUAGE_DISPLAY.en[key as keyof typeof LANGUAGE_DISPLAY.en];
  };

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.navbar__toolbar}>
        <Typography variant="h6" className={styles.navbar__logo}>
          {tenantConfig.configuration.headerLogo || "BookingPro"}
          <div className={styles.navbar__logo__subtitle}>{getText("title")}</div>
        </Typography>

        <Box className={styles.navbar__desktopMenu} sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography variant="body2" className={styles.navbar__desktopMenu__menuItem}>{getText("myBookings")}</Typography>
          <div className={styles.navbar__desktopMenu__language}>
            <LanguageIcon className={styles.navbar__desktopMenu__language__icon} />
            <Select value={language} onChange={handleLanguageChange} variant="standard" disableUnderline>
              {SUPPORTED_LANGUAGES.map(lang => (
                <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
              ))}
            </Select>
          </div>
          <Select defaultValue="usd" variant="standard" disableUnderline onChange={handleCurrencyChange}>
            <MenuItem value="usd">{getText("usd")}</MenuItem>
            <MenuItem value="eur">{getText("eur")}</MenuItem>
          </Select>
          <Button variant="contained" className={styles.navbar__desktopMenu__loginButton}>{getText("login")}</Button>
        </Box>

        <IconButton className={styles.navbar__menuIcon} sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {menuOpen && (
        <Box className={styles.navbar__mobileMenu} sx={{ display: { xs: "flex", md: "none" } }}>
          <Typography variant="body2" className={styles.navbar__mobileMenu__menuItem}>{getText("myBookings")}</Typography>
          <IconButton><LanguageIcon className={styles.navbar__mobileMenu__language__icon} /></IconButton>
          <Select value={language} onChange={handleLanguageChange} className={styles.navbar__mobileMenu__select}>
            {SUPPORTED_LANGUAGES.map(lang => (
              <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
            ))}
          </Select>
          <Select defaultValue="usd" className={styles.navbar__mobileMenu__select} onChange={handleCurrencyChange}>
            <MenuItem value="usd">{getText("usd")}</MenuItem>
            <MenuItem value="eur">{getText("eur")}</MenuItem>
          </Select>
          <Button variant="contained" className={styles.navbar__mobileMenu__loginButton}>{getText("login")}</Button>
        </Box>
      )}
    </AppBar>
  );
};
