import * as React from "react";
import Button from "@mui/material/Button";
import { Avatar } from "@material-ui/core";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";
import { bg, p } from "../General/Theme";
import { UserAuth } from "../General/ContextProvider";
import SignInUpPopup from "../Register/SignInUpPopup";
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

export default function UserMenu() {
  const navigate = useNavigate();
  const { signout, currentUser } = UserAuth();

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await signout();
      navigate("/")
      window.location.reload();
    } catch (e) {
      console.log(e.message);
    }
  };

  /* You must not delete those like they are important for the sign in popup */
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (defaulTab) => {
    setDefaultTab(defaulTab);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [defaultTab, setDefaultTab] = React.useState(1);
  return (
    <div className="flyout" style={{ position: "relative" }}>
      <Button
        id="basic-button"
        sx={{ bgcolor: bg, "&:hover": { backgroundColor: "transparent" } }}
      >
        <Avatar
          src={currentUser?.photo[0]}
          style={{
            border: `solid 1.4px ${p}`,
            width: "2.7rem",
            height: "2.7rem",
          }}
        />
      </Button>
      <div className="flyout-menu menu">
        <span className="menu-link" style={{ cursor: "auto" }}>
          Hello, <br />{currentUser ? currentUser?.full_name : "Guest"}!
        </span>
        {currentUser != null ? (
          <>
            <span
              className="menu-link"
              onClick={() => navigate(`/Profile/${currentUser?.user_id}`)}
            >
              <PersonIcon sx={{ marginLeft: "-5px" }} />
              Profile
            </span>
            {currentUser?.is_producer ? (
              <span
                className="menu-link"
                onClick={() =>
                  {
                    navigate(`/ProductionProfile/${currentUser?.user_id}`)
                    window.location.reload();
                  }
                }
              >
                <ContactEmergencyIcon sx={{ marginLeft: "-5px" }} />
                Production
              </span>
            ) : (
              <></>
            )}
            <span className="menu-link" onClick={handleLogOut}>
              <ExitToAppIcon sx={{ marginLeft: "-5px" }} />
              Sign Out
            </span>
          </>
        ) : (
          <>
            <span className="menu-link" onClick={() => handleClickOpen(0)}>
              <AssignmentIndIcon sx={{ marginLeft: "-5px" }} />
              Sign In
            </span>
            <span className="menu-link" onClick={() => handleClickOpen(1)}>
              <AssignmentIcon sx={{ marginLeft: "-5px" }} />
              Sign Up
            </span>
          </>
        )}
      </div>
      <SignInUpPopup
        open={open}
        onClose={handleClose}
        defaultTab={defaultTab}
      />
    </div>
  );
}
