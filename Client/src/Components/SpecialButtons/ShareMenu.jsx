import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Stack, TextField, Typography, lighten } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { bg, p, s } from "../../Components/General/Theme";
import { useState } from "react";
import { FacebookShareButton } from "react-share";
import Snackbar from "@mui/material/Snackbar";
import Message from "./Message";

export default function ShareMenu() {
  const paperStyles = {
    backgroundColor: bg,
    borderRadius: "10px",
    border: "solid 2px ${bg}",
    maxHeight: "300px",
    width: "11rem",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "0.5em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f2f2f2",
      borderRadius: "10px",
    },
  };
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const openMenu = Boolean(anchorElMenu);
  const currentUrl = window.location.href;
  const [openMessage, setOpenMessage] = useState(false);

  const handleClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElMenu(null);
  };

  /* Share VIA WhatsApp */
  const handleShareViaWhatsApp = () => {
    const message = "Check out this event: " + currentUrl;
    const whatsappLink =
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);
    window.open(whatsappLink);
  };

  /* Copy URL to clipboard */
  const copyToClipboard = async (event) => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      handleClose();
      setOpenMessage(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };
  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  return (
    <div>
      {openMessage && (
        <Message message="Link copied !" onClose={handleCloseMessage} />
      )}
      <Button
        id="basic-button"
        aria-controls={openMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        onClick={handleClick}
        sx={{
          bgcolor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
          color: s,
        }}
      >
        <ShareIcon fontSize="small" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorElMenu}
        open={openMenu}
        onClose={handleClose}
        PaperProps={{ style: paperStyles }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={copyToClipboard}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <LinkIcon fontSize="medium" sx={{ color: p }} />
          copy link
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <FacebookShareButton url={currentUrl} quote={"Check out this event "}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              spacing={3}
            >
              <FacebookIcon fontSize="medium" sx={{ color: "#3b5998" }} round />
              <Typography>facebook</Typography>
            </Stack>
          </FacebookShareButton>
        </MenuItem>
        <MenuItem
          onClick={handleShareViaWhatsApp}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <WhatsAppIcon fontSize="medium" sx={{ color: "#25D366" }} />
          whatsapp
        </MenuItem>
      </Menu>
    </div>
  );
}
