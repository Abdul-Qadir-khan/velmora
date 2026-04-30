import { NextResponse } from "next/server";

interface InstaPost {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption?: string;
  thumbnail_url?: string;
  like_count?: number;
  comments_count?: number;
  timestamp: string;
}

interface InstaResponse {
  data: InstaPost[];
}

export async function GET() {
  try {
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID || "YOUR_ID";
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json({ 
        posts: [] as any[] 
      }, { status: 500 });
    }

    const response = await fetch(
      `https://graph.instagram.com/${accountId}/media?fields=id,media_type,media_url,permalink,caption,thumbnail_url,like_count,comments_count,timestamp&limit=12&access_token=${accessToken}`
    );

    const data: InstaResponse = await response.json();
    
    const posts = (data.data || []).map((post: InstaPost) => ({
      id: post.id,
      image: post.media_url || post.thumbnail_url || "",
      link: post.permalink || "",
      caption: post.caption?.substring(0, 100) + "..." || "",
      likes: post.like_count || 0,
      comments: post.comments_count || 0
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Instagram API error:", error);
    return NextResponse.json({ posts: [] });
  }
}