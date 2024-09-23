import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router-dom";
import Collapse from "@mui/material/Collapse";


export default function MobileSidebar({ setOPenSidebar, openSidebar, LiList }) {
 
  const location = useLocation();
  const [openDropDown, setOpenDropDown] = React.useState(0);
  const handleDropDown = (text) => {
    if (text === "Help" && openDropDown !== 1) {
      setOpenDropDown(1);
    }else if(text === "Help" && openDropDown ===1){
      setOpenDropDown(0);
    }
     else if (text === "Sales" && openDropDown !==2){
      setOpenDropDown(2);
    }
    else if(text === "Sales" && openDropDown ===2){
      setOpenDropDown(0);
    }
  };

  return (
    <div>
      <React.Fragment>
        <Drawer
          anchor={"left"}
          open={openSidebar}
          onClose={() => setOPenSidebar(false)}
        >
          <Box sx={{ width: 300 }} role="presentation" className="sidebar-box">
            <div className="sidebar-header">
              <img
                src="/images/logo.svg"
                height={30}
                alt="COMPLIANCE SUTRA LOGO"
                loading="lazy"
                className="sidebar-brand-logo"
                style={{ marginTop: 2, marginRight: "10px" }}
              />

              <span className="side-brand-text">COMPLIANCE SUTRA</span>

              <span className="cross-btn" onClick={() => setOPenSidebar(false)}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </div>

            <Divider />

            <List>
              {LiList.map((text, index) => (
                <>
                  <ListItem key={index} disablePadding>
                    <Link
                      to={text.link}
                      className={`sidebar-link ${
                        location.pathname === text.link ? "active" : ""
                      } `}
                      onClick={() => handleDropDown(text.title)}
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <img src={text.icon} className="sidebar-list-icon" />
                        </ListItemIcon>
                        <ListItemText primary={text.title} />
                      </ListItemButton>
                    </Link>
                  </ListItem>

                  {text.title === "Help" ? (
                    <Collapse
                      in={openDropDown === 1}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        component="div"
                        disablePadding
                        className={`list-item `}
                      >
                        <ListItemButton>
                          <span className="dropdown-text">
                            Write us on &nbsp;
                            <a href="mailto:kaushik@secmark.in">kaushik@secmark.in</a>
                          </span>
                        </ListItemButton>
                      </List>
                    </Collapse>
                  ) : (
                    ""
                  )}
                  {text.title === "Sales" ? (
                    <Collapse
                      in={openDropDown === 2}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        component="div"
                        disablePadding
                        className={`list-item `}
                      >
                        <ListItemButton>
                          <a className="dropdown-item" href="tel:919870210171">
                            +91 9870210171
                          </a>
                        </ListItemButton>

                        <ListItemButton>
                          <a
                            className="dropdown-item"
                            href="mailto:kaushik@secmark.in"
                          >
                            kaushik@secmark.in
                          </a>
                        </ListItemButton>
                      </List>
                    </Collapse>
                  ) : (
                    ""
                  )}
                </>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
