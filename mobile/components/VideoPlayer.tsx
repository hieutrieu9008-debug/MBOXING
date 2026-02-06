import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    Dimensions,
    ActivityIndicator,
    Animated,
    Modal,
    StatusBar,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, Audio } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface VideoPlayerProps {
    videoUrl: string | null;
    onProgress?: (position: number, duration: number) => void;
    onComplete?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16);
const CONTROLS_HIDE_DELAY = 3000;
const SKIP_DURATION = 10000; // 10 seconds in ms
const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function VideoPlayer({ videoUrl, onProgress, onComplete }: VideoPlayerProps) {
    const videoRef = useRef<Video>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTapRef = useRef<{ time: number; side: 'left' | 'right' | null }>({ time: 0, side: null });

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Skip feedback animations
    const [skipFeedback, setSkipFeedback] = useState<{ side: 'left' | 'right'; amount: number } | null>(null);
    const skipOpacity = useRef(new Animated.Value(0)).current;

    // Configure audio mode for iOS
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

    // Auto-hide controls
    useEffect(() => {
        if (isPlaying && showControls && !isSeeking && !showSpeedMenu) {
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
    }, [isPlaying, showControls, isSeeking, showSpeedMenu]);

    // Show controls when paused
    useEffect(() => {
        if (!isPlaying) {
            setShowControls(true);
        }
    }, [isPlaying]);

    // Cleanup fullscreen on unmount
    useEffect(() => {
        return () => {
            if (isFullscreen) {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
        };
    }, [isFullscreen]);

    const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            setIsLoading(true);
            return;
        }

        setIsLoading(false);
        setIsPlaying(status.isPlaying);

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

    const skip = async (direction: 'forward' | 'backward') => {
        if (!videoRef.current || duration === 0) return;

        const skipMs = direction === 'forward' ? SKIP_DURATION : -SKIP_DURATION;
        const newPosition = Math.max(0, Math.min(duration, position + skipMs));
        await videoRef.current.setPositionAsync(newPosition);
        setPosition(newPosition);

        // Show skip feedback
        setSkipFeedback({
            side: direction === 'forward' ? 'right' : 'left',
            amount: SKIP_DURATION / 1000,
        });

        Animated.sequence([
            Animated.timing(skipOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.delay(500),
            Animated.timing(skipOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => setSkipFeedback(null));
    };

    const handleDoubleTap = (side: 'left' | 'right') => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (lastTapRef.current.side === side && now - lastTapRef.current.time < DOUBLE_TAP_DELAY) {
            // Double tap detected
            skip(side === 'right' ? 'forward' : 'backward');
            lastTapRef.current = { time: 0, side: null };
        } else {
            lastTapRef.current = { time: now, side };
            // Single tap fallback - toggle controls after delay
            setTimeout(() => {
                if (lastTapRef.current.time === now) {
                    setShowControls(!showControls);
                }
            }, DOUBLE_TAP_DELAY);
        }
    };

    const changePlaybackSpeed = async (speed: number) => {
        if (!videoRef.current) return;
        await videoRef.current.setRateAsync(speed, true);
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
    };

    const toggleFullscreen = async () => {
        if (isFullscreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            setIsFullscreen(false);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setIsFullscreen(true);
        }
    };

    const handleSlidingStart = () => setIsSeeking(true);

    const handleSlidingComplete = async (value: number) => {
        setIsSeeking(false);
        if (videoRef.current && duration > 0) {
            await videoRef.current.setPositionAsync(value);
            setPosition(value);
        }
    };

    const handleValueChange = (value: number) => setSeekValue(value);

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

    const videoContainerStyle = isFullscreen
        ? styles.fullscreenVideoContainer
        : styles.videoContainer;

    const VideoContent = (
        <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
            {isFullscreen && <StatusBar hidden />}

            <View style={videoContainerStyle}>
                <Video
                    ref={videoRef}
                    source={{ uri: videoUrl }}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    isLooping={false}
                    isMuted={false}
                    volume={1.0}
                    rate={playbackSpeed}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    useNativeControls={false}
                />

                {/* Double-tap zones */}
                <View style={styles.tapZonesContainer}>
                    <TouchableWithoutFeedback onPress={() => handleDoubleTap('left')}>
                        <View style={styles.tapZone} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => handleDoubleTap('right')}>
                        <View style={styles.tapZone} />
                    </TouchableWithoutFeedback>
                </View>

                {/* Skip feedback */}
                {skipFeedback && (
                    <Animated.View
                        style={[
                            styles.skipFeedback,
                            skipFeedback.side === 'left' ? styles.skipFeedbackLeft : styles.skipFeedbackRight,
                            { opacity: skipOpacity },
                        ]}
                    >
                        <Ionicons
                            name={skipFeedback.side === 'left' ? 'play-back' : 'play-forward'}
                            size={32}
                            color="#fff"
                        />
                        <Text style={styles.skipFeedbackText}>{skipFeedback.amount}s</Text>
                    </Animated.View>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                )}

                {/* Controls overlay - box-none allows taps to pass through to double-tap zones */}
                {showControls && !isLoading && (
                    <View style={styles.controlsOverlay} pointerEvents="box-none">
                        {/* Top bar */}
                        <View style={styles.topBar}>
                            {isFullscreen && (
                                <TouchableOpacity onPress={toggleFullscreen} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={24} color="#fff" />
                                </TouchableOpacity>
                            )}
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity onPress={toggleFullscreen} style={styles.controlButton}>
                                <Ionicons
                                    name={isFullscreen ? 'contract' : 'expand'}
                                    size={22}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Center play button - only button area is tappable */}
                        <View style={styles.centerControls} pointerEvents="box-none">
                            <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                                <Ionicons
                                    name={isPlaying ? 'pause' : 'play'}
                                    size={40}
                                    color={COLORS.background}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Bottom bar */}
                        <View style={styles.bottomBar}>
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
                                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                                    thumbTintColor={COLORS.primary}
                                />
                            </View>

                            <Text style={styles.timeText}>{formatTime(duration)}</Text>

                            {/* Speed button */}
                            <TouchableOpacity
                                onPress={() => setShowSpeedMenu(true)}
                                style={styles.speedButton}
                            >
                                <Text style={styles.speedButtonText}>{playbackSpeed}x</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );

    // Speed menu - rendered separately to avoid nesting inside fullscreen modal
    const SpeedMenu = (
        <Modal visible={showSpeedMenu} transparent animationType="fade">
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowSpeedMenu(false)}
            >
                <View style={styles.speedMenu}>
                    <Text style={styles.speedMenuTitle}>Playback Speed</Text>
                    {PLAYBACK_SPEEDS.map((speed) => (
                        <TouchableOpacity
                            key={speed}
                            style={[
                                styles.speedOption,
                                playbackSpeed === speed && styles.speedOptionActive,
                            ]}
                            onPress={() => changePlaybackSpeed(speed)}
                        >
                            <Text
                                style={[
                                    styles.speedOptionText,
                                    playbackSpeed === speed && styles.speedOptionTextActive,
                                ]}
                            >
                                {speed}x {speed === 1 && '(Normal)'}
                            </Text>
                            {playbackSpeed === speed && (
                                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );

    // Wrap in modal for fullscreen
    if (isFullscreen) {
        return (
            <>
                <Modal visible={isFullscreen} animationType="fade" supportedOrientations={['landscape']}>
                    {VideoContent}
                </Modal>
                {SpeedMenu}
            </>
        );
    }

    return (
        <>
            {VideoContent}
            {SpeedMenu}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#000',
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        width: '100%',
        height: VIDEO_HEIGHT,
        backgroundColor: '#000',
    },
    fullscreenVideoContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    tapZonesContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
    },
    tapZone: {
        flex: 1,
    },
    skipFeedback: {
        position: 'absolute',
        top: '50%',
        marginTop: -40,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 50,
        padding: 20,
    },
    skipFeedbackLeft: {
        left: '15%',
    },
    skipFeedbackRight: {
        right: '15%',
    },
    skipFeedbackText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        padding: 8,
    },
    controlButton: {
        padding: 8,
    },
    centerControls: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 24,
    },
    timeText: {
        color: '#fff',
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
    speedButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    speedButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    speedMenu: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 16,
        width: 250,
    },
    speedMenuTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    speedOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    speedOptionActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    speedOptionText: {
        color: COLORS.textSecondary,
        fontSize: 15,
    },
    speedOptionTextActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});
