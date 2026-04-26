'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Heart } from 'lucide-react';

export default function VideoCall() {
  const params = useParams();
  const router = useRouter();
  const channelName = params.channelName as string;

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState('');

  const clientRef = useRef<any>(null);
  const localTrackRef = useRef<any[]>([]);

  useEffect(() => {
    startCall();
    return () => { leaveCall(); };
  }, []);

  const startCall = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const uid = Math.floor(Math.random() * 100000);

      // Get Agora token from backend
      const res = await fetch('http://localhost:3000/video/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ channelName, uid }),
      });

      const { appId, token: agoraToken } = await res.json();

      // Dynamically import Agora (avoids SSR issues)
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      // Handle remote users
      client.on('user-published', async (remoteUser: any, mediaType: any) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === 'video') {
          const remoteContainer = document.getElementById('remote-video');
          if (remoteContainer) {
            remoteContainer.innerHTML = '';
            remoteUser.videoTrack.play('remote-video');
          }
        }
        if (mediaType === 'audio') {
          remoteUser.audioTrack.play();
        }
      });

      client.on('user-unpublished', () => {
        const remoteContainer = document.getElementById('remote-video');
        if (remoteContainer) remoteContainer.innerHTML = '';
      });

      await client.join(appId, channelName, agoraToken || null, uid);

      // Create local tracks
      const [micTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTrackRef.current = [micTrack, cameraTrack];

      // Play local video
      cameraTrack.play('local-video');

      // Publish tracks
      await client.publish([micTrack, cameraTrack]);

      setJoined(true);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Failed to join call. Please check camera/mic permissions.');
      setLoading(false);
    }
  };

  const leaveCall = async () => {
    localTrackRef.current.forEach((track) => {
      track.stop();
      track.close();
    });
    if (clientRef.current) {
      await clientRef.current.leave();
    }
  };

  const handleLeave = async () => {
    await leaveCall();
    router.back();
  };

  const toggleMic = () => {
    const micTrack = localTrackRef.current[0];
    if (micTrack) {
      micTrack.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    const camTrack = localTrackRef.current[1];
    if (camTrack) {
      camTrack.setEnabled(!camOn);
      setCamOn(!camOn);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => router.back()} className="bg-white text-gray-900 px-6 py-2 rounded-xl">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold">MediConnect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${joined ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <span className="text-white/70 text-sm">{joined ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative px-4">
        {/* Remote Video */}
        <div
          id="remote-video"
          className="w-full h-full min-h-96 bg-gray-800 rounded-2xl flex items-center justify-center"
        >
          {loading && (
            <div className="text-white/50 text-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p>Joining call...</p>
            </div>
          )}
          {joined && (
            <div className="text-white/30 text-center absolute">
              <p>Waiting for other participant...</p>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div
          id="local-video"
          className="absolute bottom-4 right-8 w-36 h-48 bg-gray-700 rounded-xl overflow-hidden border-2 border-white/20"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 py-8">
        <button
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            micOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {micOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
        </button>

        <button
          onClick={handleLeave}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
        >
          <PhoneOff className="w-7 h-7 text-white" />
        </button>

        <button
          onClick={toggleCam}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            camOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {camOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
        </button>
      </div>
    </div>
  );
}