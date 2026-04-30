"use client";

import { useEffect, useState } from "react";
import { Instagram, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 🔥 PROPER TYPES
interface InstaPost {
  id: string;
  image: string;
  link: string;
  caption: string;
  likes: number;
  comments: number;
}

export default function DynamicInstaFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data: { posts: InstaPost[] }) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-8 text-slate-400" />
          <p className="text-xl text-slate-500">Loading feed...</p>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Instagram className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-light text-slate-900 mb-4">Follow Us</h3>
          <p className="text-lg text-slate-600 mb-8">See what's trending</p>
          <Link 
            href="https://instagram.com/yourstore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-slate-900 bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all hover:bg-slate-50"
          >
            @yourstoreofficial
            <Instagram size={20} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full mb-6 font-semibold shadow-lg">
            <Instagram className="w-6 h-6" />
            LIVE FROM @yourstoreofficial
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Real Customer Looks
          </h2>
          <p className="text-xl text-slate-600">
            {posts.length} posts from our Delhi community
          </p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-12">
          {posts.slice(0, 12).map((post: InstaPost) => (
            <Link 
              key={post.id}
              href={post.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer border border-slate-100 hover:border-slate-200"
            >
              {/* Image */}
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col p-4 justify-end">
                <div className="flex items-center gap-4 mb-2 opacity-90">
                  <div className="flex items-center gap-1 text-white text-xs font-medium">
                    <Heart className="w-4 h-4 fill-current" />
                    {post.likes.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-white text-xs font-medium">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments.toLocaleString()}
                  </div>
                </div>
                <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                  {post.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="https://instagram.com/yourstoreofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-medium text-slate-900 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500"
          >
            Follow @yourstoreofficial
            <Instagram size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}