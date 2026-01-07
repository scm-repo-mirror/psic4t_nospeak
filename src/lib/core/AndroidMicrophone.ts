import { Capacitor, registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

export interface WaveformPeakEvent {
    peak: number;
}

export interface RecordingErrorEvent {
    error: string;
}

export interface StartRecordingResult {
    success: boolean;
    error?: string;
}

export interface StopRecordingResult {
    filePath: string;
    durationMs: number;
}

export interface AndroidMicrophonePlugin {
    requestPermission(): Promise<{ granted: boolean }>;
    startRecording(): Promise<StartRecordingResult>;
    stopRecording(): Promise<StopRecordingResult>;
    pauseRecording(): Promise<void>;
    resumeRecording(): Promise<void>;
    deleteRecordingFile(options: { filePath: string }): Promise<void>;
    addListener(
        eventName: 'waveformPeak',
        listenerFunc: (event: WaveformPeakEvent) => void
    ): Promise<PluginListenerHandle>;
    addListener(
        eventName: 'recordingError',
        listenerFunc: (event: RecordingErrorEvent) => void
    ): Promise<PluginListenerHandle>;
}

export const AndroidMicrophone = Capacitor.getPlatform() === 'android'
    ? registerPlugin<AndroidMicrophonePlugin>('AndroidMicrophone')
    : null;
