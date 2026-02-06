import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface VideoPlayerProps {
    videoUrl: string | null;
    onProgress?: (position: number, duration: number) => void;
    onComplete?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16); // 16:9 aspect ratio

export default function VideoPlayer({ videoUrl, onProgress, onComplete }: VideoPlayerProps) {
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);

    const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            setIsLoading(true);
            return;
        }

        setIsLoading(false);
        setIsPlaying(status.isPlaying);
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);

        if (onProgress && status.durationMillis) {
            onProgress(status.positionMillis, status.durationMillis);
        }

        if (status.didJustFinish && onComplete) {
            onComplete();
        }
    }, [onProgress, onComplete]);

    const togglePlayPause = async () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    };

    const handleSeek = async (percentage: number) => {
        if (!videoRef.current || duration === 0) return;
        const seekPosition = percentage * duration;
        await videoRef.current.setPositionAsync(seekPosition);
    };

    const formatTime = (millis: number): string => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? position / duration : 0;

    if (!videoUrl) {
        return (
            <View style={[styles.container, styles.placeholder]}>
                <Ionicons name="videocam-off" size={48} color={COLORS.textMuted} />
                <Text style={styles.placeholderText}>Video not available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowControls(!showControls)}
                style={styles.videoContainer}
            >
                <Video
                    ref={videoRef}
                    source={{ uri: videoUrl }}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    isLooping={false}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    useNativeControls={false}
                />

                {/* Loading Indicator */}
                {isLoading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                )}

                {/* Play/Pause Button */}
                {showControls && !isLoading && (
                    <TouchableOpacity style={styles.overlay} onPress={togglePlayPause}>
                        <View style={styles.playButton}>
                            <Ionicons
                                name={isPlaying ? 'pause' : 'play'}
                                size={40}
                                color={COLORS.background}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.controls}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>

                <TouchableOpacity
                    style={styles.progressBarContainer}
                    onPress={(e) => {
                        const { locationX } = e.nativeEvent;
                        const containerWidth = SCREEN_WIDTH - 100; // Approximate width
                        const percentage = Math.max(0, Math.min(1, locationX / containerWidth));
                        handleSeek(percentage);
                    }}
                >
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                        <View style={[styles.progressBarThumb, { left: `${progress * 100}%` }]} />
                    </View>
                </TouchableOpacity>

                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#000',
    },
    videoContainer: {
        width: '100%',
        height: VIDEO_HEIGHT,
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5, // Offset for play icon visual centering
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
    },
    timeText: {
        color: COLORS.textMuted,
        fontSize: 12,
        minWidth: 40,
        textAlign: 'center',
    },
    progressBarContainer: {
        flex: 1,
        height: 20,
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        position: 'relative',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    progressBarThumb: {
        position: 'absolute',
        top: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        marginLeft: -6,
    },
    placeholder: {
        height: VIDEO_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginTop: 8,
    },
});
