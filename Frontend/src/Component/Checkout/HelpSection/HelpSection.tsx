import { Typography,Box } from "@mui/material";

export const HelpSection = () => {
    return (
      <Box sx={{ 
            width: "25rem",
            height: "7.15rem",
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-around",
            backgroundColor: "#EFF0F1", padding: "16px", borderRadius: "8px", marginTop: "16px"
        }}>
        <Typography variant="h6" fontWeight="bold"
        sx={{
            width: "13.25rem",
            height: "2.0625rem",
            fontFamily: "Lato",
            fontWeight: 700,
            fontSize: "2rem",
            lineHeight: "1.4",
            letterSpacing: "0px",

        }}>
          Need help?
        </Typography>
        <div>
            <Typography variant="body1" fontWeight="bold"
            sx={{
                width: "10.25rem",
                height: "1.5625rem",
                fontFamily: "Lato",
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: "1.5",
                letterSpacing: "0px",
            }}>
            Call 1-800-555-5555
            </Typography>
            <Typography variant="body2" color="textSecondary">
            Mon - Fri 8a - 5p EST
            </Typography>
        </div>
      </Box>
    );
  };