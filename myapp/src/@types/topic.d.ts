// トピック関連の定義をするファイル

// トピックの型
interface topic {
    id: string;
    title: string;
    content: string;
    is_topic_active: number;
    post_user_id: string;
    username: string;
    created_at: string;
    "COUNT(response.id)": string;
}