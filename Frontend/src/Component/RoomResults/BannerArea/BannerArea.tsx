import React from "react";
import { Box } from "@mui/material";
import styles from "./BannerArea.module.scss";

interface BannerAreaProps {
  bannerStyle: React.CSSProperties;
  imageLoaded: boolean;
}

const BannerArea: React.FC<BannerAreaProps> = ({ bannerStyle, imageLoaded }) => {
  return (
    <div className={styles.banner} style={bannerStyle}>
      {!imageLoaded && (
        <Box className={styles.banner__loader}>
        </Box>
      )}
    </div>
  );
};

export default BannerArea;