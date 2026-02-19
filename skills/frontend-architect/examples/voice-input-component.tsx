/**
 * Voice Input Component for Task Management
 * Frontend Architect - Voice Command Integration
 * 
 * Supports:
 * - Web Speech API (browser-native)
 * - Real-time transcription
 * - Multi-language (English, Urdu)
 * - Visual recording feedback
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  language?: 'en-US' | 'ur-PK';
  placeholder?: string;
  className?: string;
}

export function VoiceInput({
  onTranscript,
  onError,
  language = 'en-US',
  placeholder = 'Click mic to start voice input...',
  className = ''
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // Check browser support for Web Speech API
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      onError?.('Voice input not supported in this browser');
      return;
    }
    
    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;
    
    // Handle results
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;
      
      // Update interim transcript
      setTranscript(transcriptText);
      
      // Final transcript
      if (result.isFinal) {
        setIsProcessing(true);
        onTranscript(transcriptText);
        setTranscript('');
        setIsRecording(false);
        setTimeout(() => setIsProcessing(false), 500);
      }
    };
    
    // Handle errors
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Voice input error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not found or not working.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied.';
          break;
        case 'network':
          errorMessage = 'Network error occurred.';
          break;
        default:
          errorMessage = `Voice input error: ${event.error}`;
      }
      
      onError?.(errorMessage);
      setIsRecording(false);
      setTranscript('');
    };
    
    // Handle end
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognitionRef.current = recognition;
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript, onError]);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setTranscript('');
      } catch (error) {
        console.error('Failed to start recording:', error);
        onError?.('Failed to start voice input');
      }
    }
  };
  
  if (!isSupported) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Voice input not supported in this browser.
        <br />
        Try Chrome, Edge, or Safari.
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Microphone Button */}
      <button
        onClick={toggleRecording}
        disabled={isProcessing}
        className={`relative p-4 rounded-full transition-all duration-200 ${
          isRecording
            ? 'bg-red-600 hover:bg-red-500 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-500'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-lg hover:shadow-xl active:scale-95`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
        
        {/* Recording indicator */}
        {isRecording && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </button>
      
      {/* Transcript Display */}
      {(transcript || isProcessing) && (
        <div className="flex-1 px-4 py-3 bg-slate-700 rounded-lg border border-slate-600">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="text-sm text-white">
              {transcript}
              <span className="inline-block w-1 h-4 ml-1 bg-blue-500 animate-pulse" />
            </div>
          )}
        </div>
      )}
      
      {/* Placeholder when idle */}
      {!transcript && !isRecording && !isProcessing && (
        <div className="flex-1 px-4 py-3 text-sm text-gray-500">
          {placeholder}
        </div>
      )}
    </div>
  );
}

// Example usage
export function VoiceTaskInput() {
  const [command, setCommand] = useState('');
  const [error, setError] = useState('');
  
  const handleTranscript = async (text: string) => {
    setCommand(text);
    
    // Process voice command
    try {
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();
      
      if (data.task) {
        // Task created successfully
        console.log('Task created:', data.task);
      }
    } catch (err) {
      setError('Failed to process voice command');
    }
  };
  
  return (
    <div className="space-y-4">
      <VoiceInput
        onTranscript={handleTranscript}
        onError={setError}
        language="en-US"
        placeholder="Say: 'Create a task for tomorrow...'"
      />
      
      {error && (
        <div className="px-4 py-2 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {command && (
        <div className="px-4 py-2 bg-green-900/20 border border-green-500 rounded-lg text-green-400 text-sm">
          Command: {command}
        </div>
      )}
    </div>
  );
}
