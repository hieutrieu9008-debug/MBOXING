import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface VideoPlayerProps {
    videoUrl: string | null;
    onProgress?: (position: number, duration: number) => void;
    onComplete?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16); // 16:9 aspect ratio
const CONTROLS_HIDE_DELAY = 3000; // Auto-hide controls after 3 seconds

export default function VideoPlayer({ videoUrl, onProgress, onComplete }: VideoPlayerProps) {
    const videoRef = useRef<Video>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState(0);

    // Configure audio mode for iOS (plays even when silent switch is on)
    useEffect(() => {
        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
            } catch (error) {
                console.log('Error setting audio mode:', error);
            }
        };
        setupAudio();
    }, []);

    // Auto-hide controls when video is playing
    useEffect(() => {
        if (isPlaying && showControls && !isSeeking) {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
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
            setSeekValue(status.positionMillis);
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

    const handleSlidingStart = () => {
        setIsSeeking(true);
    };

    const handleSlidingComplete = async (value: number) => {
        setIsSeeking(false);
        if (videoRef.current && duration > 0) {
            await videoRef.current.setPositionAsync(value);
            setPosition(value);
        }
    };

    const handleValueChange = (value: number) => {
        setSeekValue(value);
    };

    const formatTime = (millis: number): string => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
                    isMuted={false}
                    volume={1.0}
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

            {/* Progress Bar with Native Slider */}
            <View style={styles.controls}>
                <Text style={styles.timeText}>{formatTime(isSeeking ? seekValue : position)}</Text>

                <View style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration || 1}
                        value={isSeeking ? seekValue : position}
                        onSlidingStart={handleSlidingStart}
                        onSlidingComplete={handleSlidingComplete}
                        onValueChange={handleValueChange}
                        minimumTrackTintColor={COLORS.primary}
                        maximumTrackTintColor={COLORS.border}
                        thumbTintColor={COLORS.primary}
                    />
                </View>

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
        paddingLeft: 5,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.background,
    },
    timeText: {
        color: COLORS.textMuted,
        fontSize: 12,
        width: 45,
        textAlign: 'center',
    },
    sliderContainer: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
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
