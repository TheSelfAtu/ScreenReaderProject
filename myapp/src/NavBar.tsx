import { PostFire } from "./Common";
import React from "react";
import { BrowserRouter as Router,  Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { Menu } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import "./css/style.css";

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
  fetchUserStatus: () => Promise<any>;
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
    // ログインしていないときのメニュー
    if (props.userStatus.session == false) {
      return (
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          tabIndex={0}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/login" tabIndex={0}>
              ログイン
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/signup" tabIndex={0}>
              サインアップ
            </Link>
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
          <Link to={`/mypage/${props.userStatus.userId}`}>
            マイページへ移動
          </Link>
        </MenuItem>
        <MenuItem
          onClick={async () => {
            await PostFire("/users/logout", {});
            props.fetchUserStatus();
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
