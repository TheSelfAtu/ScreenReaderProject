import { postFire } from "../common";
import React, { useState, useCallback, useRef } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import useReactRouter from "use-react-router";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

interface UpdateProfileProps {
  profileUserID: string;
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    comment: string;
  };

  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function UpdateProfile(props: UpdateProfileProps) {
  const prevMessageRef = useRef(props.requestSuccessMessage);
  const { history, location, match } = useReactRouter();
  const [yearsOfProgramming, setYearsOfProgramming] = React.useState("");
  // プログラミング歴選択
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYearsOfProgramming(event.target.value as string);
  };

  const [inputUserComment, setInputUserComment] = useState(
    props.userStatus.comment
  );
  const [error, setError] = useState("");

  const updateUserProfile = useCallback(
    async (
      inputUserComment: string,
      yearsOfProgramming: string
    ): Promise<any> => {
      // プロフィールを変更します
      try {
        await postFire("/users/update-profile", {
          inputUserComment: inputUserComment,
          years_of_programming: yearsOfProgramming,
          user_id: props.userStatus.userId,
        });
      } catch (e) {
        // プロフィール変更に失敗した場合はエラーをセット
        setError("プロフィール変更に失敗しました");
        return;
      }
      // プロフィールの変更に成功した場合はマイページ画面に遷移
      props.setRequestSuccessMessage(
        prevMessageRef.current.concat(["プロフィールを変更しました"])
      );

      history.push(`/mypage/${props.userStatus.userId}`);
    },
    [props.userStatus]
  );

  return (
    <div id="update-profile-wrapper">
      <div className="update-profile-main">
        {/* プロフィールコメント記入フォーム */}
        <div id="user-comment-wrapper">
          <h3 className="form-comment">コメント</h3>
          <TextField
            margin="dense"
            id="profile-form"
            type="textarea"
            fullWidth
            placeholder="公開するコメントを記入してください"
            variant="outlined"
            multiline
            rows="6"
            value={inputUserComment}
            onChange={(e) => {
              setInputUserComment(e.target.value);
            }}
          />
        </div>
        <div id="user-programming-year-wrapper">
          <label htmlFor="years-of-programming">
            <h3 className="form-programming-year">プログラミング歴</h3>
            <Select
              native
              value={yearsOfProgramming}
              onChange={handleChange}
              inputProps={{
                name: "years-of-programming",
                id: "years-of-programming",
              }}
            >
              <option aria-label="None" value="" />
              <option value={"0"}>1年未満</option>
              <option value={"1"}>1年 ~ 3年</option>
              <option value={"2"}>3年以上</option>
            </Select>
          </label>
        </div>
        {/* エラーメッセージを表示 */}
        <div role="alert">
          <span id="update-profile-error">{error}</span>
        </div>
        <div className="buttons">
          <Link
            className="back-to-mypage-button"
            to={`/mypage/${props.userStatus.userId}`}
          >
            <Button variant="contained" color="default" tabIndex="-1">
              マイページへ戻る
            </Button>
          </Link>
          <Button
            onClick={async () => {
              updateUserProfile(inputUserComment, yearsOfProgramming);
            }}
            className="update-profile-button"
            color="primary"
            variant="contained"
          >
            プロフィール更新
          </Button>
        </div>
      </div>
    </div>
  );
}
