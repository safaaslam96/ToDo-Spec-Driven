/**
 * Voice Command Input Component
 * Subagent: @subagents/voice-command-agent/
 * Skill: @skills/frontend-architect/examples/voice-input-component.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: 'en-US' | 'ur-PK';
}

export function VoiceInput({ onTranscript, language = 'en-US' }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check for Web Speech API support
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize recognition
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;

      setTranscript(transcriptText);

      // If final result, submit
      if (event.results[current].isFinal) {
        onTranscript(transcriptText);
        setTranscript('');
        setIsRecording(false);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please enable microphone permissions.');
      }
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
  }, [language, onTranscript]);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Voice input not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-400">
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Microphone Button */}
      <button
        onClick={toggleRecording}
        className={`relative p-3 rounded-full transition-all ${
          isRecording
            ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/50'
            : 'bg-slate-700 hover:bg-slate-600'
        }`}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
      >
        {isRecording ? (
          <>
            <MicOff className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </>
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Live Transcript */}
      {transcript && (
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600 animate-pulse">
          <Volume2 className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">{transcript}...</span>
        </div>
      )}

      {/* Language Indicator */}
      <div className="text-xs text-gray-500">
        {language === 'ur-PK' ? '🇵🇰 Urdu' : '🇺🇸 English'}
      </div>
    </div>
  );
}
