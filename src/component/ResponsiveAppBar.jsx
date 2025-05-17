import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Swal from "sweetalert2";

const UserIcon = () => (
  <AccountCircleIcon sx={{ fontSize: 20, color: "white", mr: 1 }} />
);

const pages = ["Home", "Profile", "Notes"];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire("Already Logged Out", "You are already logged out!", "info");
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
      });

      if (result.isConfirmed) {
        await fetch("https://notes-management-system-backend.vercel.app/api/v1/logout", {
          method: "POST",
          credentials: "include",
        });

        localStorage.removeItem("token");
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        );

        navigate("/login");
      }
    } catch (error) {
      Swal.fire("Error!", "Logout failed. Please try again.", "error");
      console.error("Logout failed", error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#166534" }}>
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Mobile Menu Icon */}
          <IconButton
            size="large"
            aria-label="open menu"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "#ffffff",
                color: "#166534",
                fontWeight: "bold",
                fontSize: 18,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                boxShadow: 1,
              }}
            >
              N
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white", fontWeight: "bold", letterSpacing: 1 }}
            >
              NoteSync
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {pages.map((page) => (
              <IconButton
                key={page}
                onClick={() =>
                  navigate(page === "Home" ? "/" : `/${page.toLowerCase()}`)
                }
                sx={{ color: "white" }}
              >
                <Typography>{page}</Typography>
              </IconButton>
            ))}

            {/* Login Icon */}
            <IconButton onClick={() => navigate("/login")} color="inherit">
              <UserIcon />
            </IconButton>

            {/* Logout only on Home */}
            {location.pathname === "/" && (
              <IconButton onClick={handleLogout} color="inherit">
                <Typography>Logout</Typography>
              </IconButton>
            )}
          </Box>

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(page === "Home" ? "/" : `/${page.toLowerCase()}`);
                }}
              >
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}

            <MenuItem
              onClick={() => {
                handleCloseNavMenu();
                navigate("/login");
              }}
            >
              <Typography sx={{ color: "black" }}>Login</Typography>
            </MenuItem>

            {location.pathname === "/" && (
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  handleLogout();
                }}
              >
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
