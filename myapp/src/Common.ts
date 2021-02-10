import axios from "axios";

// エンドポイントとパラメータを指定してPostリクエストをだす
export function PostFire(
  endpoint: string,
  info: { [key: string]: string },
  //   errorMessage?: string,
  isContentTypeMultiPart?: boolean
): Promise<any> {
  return new Promise((resolve, reject) => {
    let params: FormData | URLSearchParams;
    if (isContentTypeMultiPart) {
      params = new FormData();
    } else {
      params = new URLSearchParams();
    }
    Object.keys(info).forEach((key) => {
      params.append(key, info[key]);
    });
    params.append("formToken", "true");
    axios({
      method: "POST",
      url: endpoint,
      responseType: "json",
      data: params,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.error("err: ", err);
        reject(false);
      });
  });
}

// トピックタイトルが長い場合に省略する
export function formatTopicTitle(topicTitle: string): string {
  if (topicTitle.length < 50) {
    return topicTitle;
  }
  return topicTitle.substr(0, 50) + "...";
}

//   投稿日時などの日付のフォーマット
export function formatDateTime(datetime: string): string {
  const separatedDateTime = datetime.match(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );
  if (separatedDateTime?.length == 6) {
    return (
      separatedDateTime[1] +
      "年" +
      separatedDateTime[2] +
      "月" +
      separatedDateTime[3] +
      "日" +
      separatedDateTime[4] +
      ":" +
      separatedDateTime[5]
    );
  }
  return "";
}
