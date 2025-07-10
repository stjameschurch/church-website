"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { motion } from "framer-motion";

const YOUTUBE_PLAYLIST_ID = "PLxVbRXKjzf4ZysNMtoLk949yNIr37VMVy";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID!;

interface VideoItem {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
  };
}

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylistVideos() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${API_KEY}`
        );
        const data = await res.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error("Failed to load playlist:", error);
      }
    }
    fetchPlaylistVideos();
  }, []);

  useEffect(() => {
    async function fetchLiveOrRecentVideo() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${API_KEY}`
        );
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          setLiveVideoId(data.items[0].id.videoId);
        } else {
          const pastRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&maxResults=1&type=video&key=${API_KEY}`
          );
          const pastData = await pastRes.json();
          if (pastData.items && pastData.items.length > 0) {
            setLiveVideoId(pastData.items[0].id.videoId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch livestream:", error);
      }
    }

    fetchLiveOrRecentVideo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/backgrounds/hero.jpg"
            alt="Worship Background"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        </div>

        {/* Foreground Content */}
        <motion.h2
          className="z-10 text-5xl md:text-6xl font-bold mb-4 text-blue-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          St. James Church Jacobpuram
        </motion.h2>
        <motion.h1
          className="z-10 text-xl md:text-2xl font-semibold mb-2 text-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Join Us for Worship
        </motion.h1>
        <motion.p
          className="z-10 text-lg md:text-xl font-bold mb-6 text-blue-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Sunday Service – 9:30 AM | Daily Service – 7:30 PM
        </motion.p>
        <div className="z-10 flex flex-col md:flex-row gap-4">
          <Button asChild size="lg" className="text-white bg-red-600 hover:bg-red-700">
            <a
              href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="mr-2 h-5 w-5" />
              Watch Live on YouTube
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          >
            Submit a Prayer Request
          </Button>
        </div>
      </section>

      {/* Livestream */}
      <section className="bg-gray-100 py-16 px-4 md:px-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-900">Sunday Livestream</h2>
          {liveVideoId ? (
            <div className="relative w-full aspect-video rounded-xl shadow-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=1`}
                title="YouTube Livestream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p className="text-gray-500">No livestream available at the moment.</p>
          )}
        </div>
      </section>

      {/* Prayer Request Form */}
      <section className="bg-white py-16 px-4 md:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-800">Need Prayer?</h2>
          <p className="text-gray-600 mb-8">
            Fill out the form below and our prayer team will pray for you.
          </p>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSchEwpuNAhGF_yC7TnmCQqZyovKr9jMxlwCovyzHr4xb7zjmw/viewform?usp=dialog"
            width="100%"
            height="600"
            frameBorder="0"
            className="w-full border rounded-2xl shadow-md"
            title="Prayer Request Form"
          ></iframe>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-blue-50 py-16 px-4 md:px-24 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Who We Are</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          The Jacobpuram congregation is a major landmark in the southern tip of Tirunelveli district...
        </p>
      </section>

      {/* Recent Sermons */}
      <section className="bg-white py-16 px-4 md:px-24 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">Recent Sermons</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.length > 0 ? (
            videos.map((video) => (
              <Card key={video.id} className="shadow-lg">
                <CardContent className="p-4">
                  <iframe
                    className="w-full aspect-video rounded-md"
                    src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
                    title={video.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <h3 className="text-lg font-semibold mt-4">{video.snippet.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-gray-500">Loading sermons...</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-10 px-6 md:px-24">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">St. James Church</h3>
            <p>Jacobpuram, Tirunelveli Dist., Tamil Nadu, INDIA</p>
            <p>Email: stjameschurchofficial@gmail.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">YouTube</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-sm text-gray-300 mt-8">© 2025 St. James Church. All rights reserved.</p>
      </footer>
    </div>
  );
}
