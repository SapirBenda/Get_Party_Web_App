import { IconButton } from "@mui/material";
import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ShareViaWhatsApp = () => {
  const currentUrl = window.location.href;

  const handleShareViaWhatsApp = () => {
    const message = "Check out this event: " + currentUrl;
    const whatsappLink =
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);
    window.open(whatsappLink);
  };

  return (
    <IconButton onClick={handleShareViaWhatsApp}>
      <WhatsAppIcon fontSize="medium" sx={{ color: "#25D366" }} />
    </IconButton>
  );
};

export default ShareViaWhatsApp;
