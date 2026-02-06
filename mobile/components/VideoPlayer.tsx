import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ActivityIndicator,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState,
} from 'react-native';
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
const PROGRESS_BAR_PADDING = 16; // Horizontal padding
const TIME_TEXT_WIDTH = 48; // Width of time text on each side
const PROGRESS_BAR_WIDTH = SCREEN_WIDTH - (PROGRESS_BAR_PADDING * 2) - (TIME_TEXT_WIDTH * 2) - 16;
const CONTROLS_HIDE_DELAY = 3000; // Auto-hide controls after 3 seconds

export default function VideoPlayer({ videoUrl, onProgress, onComplete }: VideoPlayerProps) {
    const videoRef = useRef<Video>(null);
    const progressBarRef = useRef<View>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekPosition, setSeekPosition] = useState(0);

    // Auto-hide controls when video is playing
    useEffect(() => {
        if (isPlaying && showControls && !isSeeking) {
            // Clear any existing timeout
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            // Set new timeout to hide controls
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, CONTROLS_HIDE_DELAY);
        }

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying, showControls, isSeeking]);

    // Show controls when video is paused
    useEffect(() => {
        if (!isPlaying) {
            setShowControls(true);
        }
    }, [isPlaying]);

    const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            setIsLoading(true);
            return;
        }

        setIsLoading(false);
        setIsPlaying(status.isPlaying);

        // Only update position if not actively seeking
        if (!isSeeking) {
            setPosition(status.positionMillis);
        }
        setDuration(status.durationMillis || 0);

        if (onProgress && status.durationMillis && !isSeeking) {
            onProgress(status.positionMillis, status.durationMillis);
        }

        if (status.didJustFinish && onComplete) {
            onComplete();
        }
    }, [onProgress, onComplete, isSeeking]);

    const togglePlayPause = async () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    };

    const seekToPosition = async (percentage: number) => {
        if (!videoRef.current || duration === 0) return;
        const newPosition = Math.max(0, Math.min(1, percentage)) * duration;
        await videoRef.current.setPositionAsync(newPosition);
        setPosition(newPosition);
    };

    const formatTime = (millis: number): string => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const displayPosition = isSeeking ? seekPosition : position;
    const progress = duration > 0 ? displayPosition / duration : 0;

    // Pan responder for drag-to-seek functionality
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt: GestureResponderEvent) => {
                setIsSeeking(true);
                const { locationX } = evt.nativeEvent;
                const percentage = Math.max(0, Math.min(1, locationX / PROGRESS_BAR_WIDTH));
                setSeekPosition(percentage * duration);
            },
            onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                // Calculate new position based on drag
                const locationX = Math.max(0, Math.min(PROGRESS_BAR_WIDTH, gestureState.moveX - PROGRESS_BAR_PADDING - TIME_TEXT_WIDTH - 8));
                const percentage = locationX / PROGRESS_BAR_WIDTH;
                setSeekPosition(Math.max(0, Math.min(duration, percentage * duration)));
            },
            onPanResponderRelease: async () => {
                setIsSeeking(false);
                await seekToPosition(seekPosition / duration);
            },
            onPanResponderTerminate: () => {
                setIsSeeking(false);
            },
        })
    ).current;

    // Handle tap on progress bar (in addition to drag)
    const handleProgressBarPress = (evt: GestureResponderEvent) => {
        const { locationX } = evt.nativeEvent;
        const percentage = Math.max(0, Math.min(1, locationX / PROGRESS_BAR_WIDTH));
        seekToPosition(percentage);
    };

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
                    isMuted={false}  // AUDIO ENABLED
                    volume={1.0}     // Full volume
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

            {/* Progress Bar with Drag Support */}
            <View style={styles.controls}>
                <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>

                <View
                    ref={progressBarRef}
                    style={styles.progressBarContainer}
                    {...panResponder.panHandlers}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={handleProgressBarPress}
                        style={styles.progressBarTouchArea}
                    >
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                        {/* Larger thumb for easier dragging */}
                        <View
                            style={[
                                styles.progressBarThumb,
                                { left: `${progress * 100}%` },
                                isSeeking && styles.progressBarThumbActive,
                            ]}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            {/* Seeking indicator */}
            {isSeeking && (
                <View style={styles.seekingIndicator}>
                    <Text style={styles.seekingText}>{formatTime(seekPosition)}</Text>
                </View>
            )}
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
        paddingHorizontal: PROGRESS_BAR_PADDING,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
    },
    timeText: {
        color: COLORS.textMuted,
        fontSize: 12,
        width: TIME_TEXT_WIDTH,
        textAlign: 'center',
    },
    progressBarContainer: {
        flex: 1,
        height: 44, // Larger touch target (44px minimum per UX guidelines)
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    progressBarTouchArea: {
        height: 44,
        justifyContent: 'center',
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    progressBarThumb: {
        position: 'absolute',
        top: '50%',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        marginLeft: -8,
        marginTop: -8,
        // Add shadow for better visibility
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    progressBarThumbActive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: -10,
        marginTop: -10,
        backgroundColor: COLORS.primaryLight || '#FFD700',
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
    seekingIndicator: {
        position: 'absolute',
        top: VIDEO_HEIGHT / 2 - 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    seekingText: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: COLORS.text,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        fontSize: 18,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
});
