import { AppBar, Box, Button, Container, IconButton, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store"; 
import { setCurrency } from "../../Redux/slice/currencySlice";
import { fetchExchangeRates } from "../../Redux/thunk/exchangeRateThunk";

interface NavbarProps {
  locale: string;
  setLocale: (locale: string) => void;
}
export const Navbar=({ locale, setLocale }:NavbarProps) =>{
  const [menuOpen, setMenuOpen] = useState(false);
  const intl = useIntl();

  const dispatch = useDispatch<AppDispatch>();
  
    useEffect(() => {
      dispatch(fetchExchangeRates()); // Fetch exchange rates on component mount
    }, [dispatch]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none", borderBottom: "1px solid #ddd" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#10072C" }}>
            Kickdrum <Typography component="span" sx={{ color: "#666" }}>{intl.formatMessage({ id: "title" })}</Typography>
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#10072C" }}>
              {intl.formatMessage({ id: "myBookings" })}
            </Typography>
            <IconButton>
              <LanguageIcon sx={{ color: "#10072C" }} />
            </IconButton>
            <Select value={locale} onChange={(e) => setLocale(e.target.value)} sx={{ color: "#10072C" }}>
              <MenuItem value="en">{intl.formatMessage({ id: "english" })}</MenuItem>
              <MenuItem value="es">{intl.formatMessage({ id: "spanish" })}</MenuItem>
            </Select>
            <Select defaultValue="usd" sx={{ color: "#10072C" }} onChange={(e) => dispatch(setCurrency(e.target.value))}>
              <MenuItem value="usd">{intl.formatMessage({ id: "usd" })}</MenuItem>
              <MenuItem value="eur">{intl.formatMessage({ id: "eur" })}</MenuItem>
              <MenuItem value="inr">{intl.formatMessage({ id: "inr" })}</MenuItem>
            </Select>
            <Button variant="contained" sx={{ backgroundColor: "#10072C", color: "white" }}>
              {intl.formatMessage({ id: "login" })}
            </Button>
          </Box>

          <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon sx={{ color: "#10072C" }} />
          </IconButton>
        </Toolbar>

        {menuOpen && (
          <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", alignItems: "center", gap: 2, py: 2 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#10072C" }}>
              {intl.formatMessage({ id: "myBookings" })}
            </Typography>
            <IconButton>
              <LanguageIcon sx={{ color: "#10072C" }} />
            </IconButton>
            <Select value={locale} onChange={(e) => setLocale(e.target.value)} sx={{ color: "#10072C" }}>
              <MenuItem value="en">{intl.formatMessage({ id: "english" })}</MenuItem>
              <MenuItem value="es">{intl.formatMessage({ id: "spanish" })}</MenuItem>
            </Select>
            <Select defaultValue="usd" sx={{ color: "#10072C" }} onChange={(e) => dispatch(setCurrency(e.target.value))}>
              <MenuItem value="usd">{intl.formatMessage({ id: "usd" })}</MenuItem>
              <MenuItem value="eur">{intl.formatMessage({ id: "eur" })}</MenuItem>
              <MenuItem value="inr">{intl.formatMessage({ id: "inr" })}</MenuItem>
            </Select>
            <Button variant="contained" sx={{ backgroundColor: "#10072C", color: "white" }}>
              {intl.formatMessage({ id: "login" })}
            </Button>
          </Box>
        )}
      </Container>
    </AppBar>
  );
};
