import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactHTMLElement,
} from "react";
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
import Link from "@material-ui/core/Link";

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
  })
);

export default function NavBar() {
  const classes = useStyles();
  const [userStatus, setUserStatus] = useState({
    userId: "",
    userName: "",
    session: false,
  });

  const fetchUserStatus = useCallback((): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "/users/responseUserStatus",
        responseType: "json",
      })
        .then((response) => {
          console.log("userstatus navbar", response);
          setUserStatus({
            userId: response.data.userId,
            userName: response.data.userName,
            session: response.data.session,
          });
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, []);

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchFromDB = async () => {
      fetchUserStatus();
    };
    fetchFromDB();
  }, []);

  const MenuItemElement = () => {
    // ログインしていないときのメニュー
    if (userStatus.session == false) {
      return (
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link href="/users/login">ログイン</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link href="/users/signup">サインアップ</Link>
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
          <Link href="/users/mypage">マイページへ移動</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/users/logout">ログアウト</Link>
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
          <Button color="inherit" href="/">
            トピック一覧
          </Button>
          <Button color="inherit" href="/post-topic">
            トピック投稿
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
