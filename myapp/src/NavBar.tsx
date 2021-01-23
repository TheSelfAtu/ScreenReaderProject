import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactHTMLElement,
} from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { Menu } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    navList: {
      padding: "5px",
      color: "white",
      textDecoration: "none",
    },
  })
);

interface NavBarProps {
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
  };
  requestToAPIServer: (endpoint: string) => Promise<any>;
}

export default function NavBar(props: NavBarProps) {
  const classes = useStyles();
  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const MenuItemElement = () => {
    console.log(
      "nav",
      props.userStatus,
      props.userStatus.session,
      typeof props.userStatus.session
    );
    // ログインしていないときのメニュー
    if (props.userStatus.session == false) {
      return (
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/login">ログイン</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/signup">サインアップ</Link>
          </MenuItem>
        </Menu>
      );
    }
    // ログイン時のメニュー
    return (
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Link to="/mypage">マイページへ移動</Link>
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.requestToAPIServer("/users/logout");
            handleClose();
          }}
        >
          <Link to="/login">ログアウト</Link>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          {MenuItemElement()}

          <Typography variant="h6" className={classes.title}></Typography>
          <Link to="/" className={classes.navList}>
            トピック一覧
          </Link>
          <Link to="/post-topic" className={classes.navList}>
            トピック投稿
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
