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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { setCurrency } from "../../Redux/slice/currencySlice";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Navbar.module.scss";
import { AppDispatch, RootState } from "../../Redux/store";
import fetchTenantConfig from "../../Redux/thunk/tenantConfigThunk";
import { LOGO_KICKDRUM_DEFAULT } from "../../Constant";
import { Link, useNavigate } from "react-router-dom";
import ImageWithFallback from "../Util/ImageWithFallback";
import { useAuth } from "react-oidc-context";
import { authService } from "../../Services/authServices.ts";

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
  
  const navigate = useNavigate();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const auth = useAuth();
  
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    dispatch(fetchTenantConfig());
    const storedCurrency = localStorage.getItem("selectedCurrency") || "usd";
    dispatch(setCurrency(storedCurrency));
  }, [dispatch]);

  useEffect(() => {
    if (tenantConfig.configuration?.taxes) {
      localStorage.setItem("taxes", JSON.stringify(tenantConfig.configuration.taxes));
    }
  }, [tenantConfig.configuration?.taxes]);

  useEffect(() => {
    const checkAuthStatus = () => {
      // First check if auth context reports as authenticated
      if (auth.isAuthenticated) {
        setIsUserAuthenticated(true);
        return;
      }
      
      // If not, check localStorage as fallback
      const isAuthenticatedFromStorage = authService.isAuthenticated();
      setIsUserAuthenticated(isAuthenticatedFromStorage);
      
      // If authenticated in storage but not in context, try to load the user
      if (isAuthenticatedFromStorage && !auth.isAuthenticated && !auth.isLoading) {
        auth.signinSilent().catch(error => {
          console.error("Silent sign-in failed:", error);
          // If silent sign-in fails, user may need to login again
          setIsUserAuthenticated(false);
        });
      }
    };
    
    checkAuthStatus();
    
    // Add event listener for storage changes (in case of login/logout in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [auth.isAuthenticated, auth.isLoading, auth]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      console.log('Cognito User Details:', auth.user);
      console.log('JWT Token:', auth.user.access_token);
      console.log('ID Token:', auth.user.id_token);
      if (auth.user.expires_at) {
        console.log('Token Expiry:', new Date(auth.user.expires_at * 1000));
      }
      console.log('User Claims:', auth.user.profile);
    }
  }, [auth.isAuthenticated, auth.user]);

  const signOutRedirect = () => {
    const clientId = `${import.meta.env.VITE_COGNITO_CLIENT_ID}`;
    const logoutUri = `${import.meta.env.VITE_COGNITO_REDIRECT_URI}`;
    const cognitoDomain = `${import.meta.env.VITE_COGNITO_DOMAIN}`;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };
  
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    if ((window as any).changeGoogleTranslateLanguage) {
      (window as any).changeGoogleTranslateLanguage(newLanguage);
    }
    localStorage.setItem("preferredLanguage", newLanguage);
    handleDrawerToggle();
  };

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    const newCurrency = event.target.value;
    dispatch(setCurrency(newCurrency));
    handleDrawerToggle();
  };

  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const handleLogout = () => {
    console.log("Signing out");
    
    // First, clear the local user data
    auth.removeUser();
    localStorage.clear();
    
    // Then redirect to Cognito's logout endpoint with the correct parameters
    const clientId = `${import.meta.env.VITE_COGNITO_CLIENT_ID}`;
    const logoutUri = encodeURIComponent(`${import.meta.env.VITE_COGNITO_REDIRECT_URI}`);
    const cognitoDomain = `${import.meta.env.VITE_COGNITO_DOMAIN}`;
    
    // Use logout_uri instead of post_logout_redirect_uri
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
    setIsUserAuthenticated(false);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ padding: 1 }}>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/my-bookings" 
            onClick={handleDrawerToggle}
            sx={{
              fontFamily: "'Lato', sans-serif !important",
              fontWeight: "700",
              lineHeight: "140%",
              letterSpacing: "2%",
              color: "#26266D",
              textTransform: "none",
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#1A1A47'
              }
            }}
          >
            <ListItemText primary={"MY BOOKINGS"} />
          </ListItemButton>
        </ListItem>
        
        <ListItem>
           <LanguageIcon sx={{ marginRight: 1 }}/>
           <Select
              value={language}
              onChange={handleLanguageChange}
              variant="standard"
              disableUnderline
              className="notranslate"
              sx={{ width: '100%' }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem
                  key={lang.code}
                  value={lang.code}
                  className="notranslate"
                >
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
        </ListItem>

         <ListItem>
            <Typography sx={{ marginRight: 1 }}>{currency === 'usd' ? '$' : currency === 'eur' ? '€' : '₹'}</Typography>
            <Select
              value={currency}
              variant="standard"
              disableUnderline
              onChange={handleCurrencyChange}
              sx={{ width: '100%' }}
            >
              <MenuItem value="usd">USD</MenuItem>
              <MenuItem value="eur">EUR</MenuItem>
              <MenuItem value="inr">INR</MenuItem>
            </Select>
         </ListItem>

         <ListItem>
    <Button
      variant="contained"
      fullWidth
      className={styles.navbar__mobileMenu__loginButton}
      onClick={isUserAuthenticated ? handleLogout : handleLogin}
    >
      {isUserAuthenticated ? "Logout" : "Login"}
    </Button>
  </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar className={styles.navbar__toolbar} sx={{paddingLeft:"0 !important"}}>
          <Link to="/" className={styles.navbar__logo}>
            <Typography variant="h6" className={styles.navbar__logo}>
              <ImageWithFallback
                src={tenantConfig.configuration?.headerLogo}
                fallback={LOGO_KICKDRUM_DEFAULT}
                alt="logo"
                className={styles.navbar_logo_img}
              />
              <div className={styles.navbar__logo__subtitle}>
                Internet Booking Engine
              </div>
            </Typography>
          </Link>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              className={styles.navbar__menuIcon}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box
              className={styles.navbar__desktopMenu}
            >
               <Button
                 component={Link}
                 to="/my-bookings"
                 sx={{
                    fontFamily: "'Lato', sans-serif !important",
                    fontWeight:"700",
                    lineHeight:"140%",
                    width:"6.375rem",
                    height:"1.25rem",
                    letterSpacing:"2%",
                    color: "#26266D",
                    textTransform: "none",
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#1A1A47'
                    }
                 }}
                 className={styles.navbar__desktopMenu__menuItem}
                >
                 MY BOOKINGS
               </Button>
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
    onClick={isUserAuthenticated ? handleLogout : handleLogin}
  >
    <p>{isUserAuthenticated ? "Logout" : "Login"}</p>
  </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={menuOpen && isMobile}
        onClose={handleDrawerToggle}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
