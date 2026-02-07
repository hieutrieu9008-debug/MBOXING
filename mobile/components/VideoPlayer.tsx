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
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    }, [isPlaying, showControls, isSeeking, showSpeedMenu, isFullscreen]);

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
            Animated.timing(skipOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => setSkipFeedback(null));
    };

    const handleDoubleTap = (side: 'left' | 'right') => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (lastTapRef.current.side === side && now - lastTapRef.current.time < DOUBLE_TAP_DELAY) {
            skip(side === 'left' ? 'backward' : 'forward');
            lastTapRef.current = { time: 0, side: null };
        } else {
            lastTapRef.current = { time: now, side };
            setTimeout(() => {
                if (lastTapRef.current.time === now) {
                    setShowControls(!showControls);
                }
            }, DOUBLE_TAP_DELAY);
        }
    };

    const toggleFullscreen = async () => {
        if (isFullscreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            setIsFullscreen(false);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setIsFullscreen(true);
        }
        setShowSpeedMenu(false);
    };

    const changePlaybackSpeed = async (speed: number) => {
        if (videoRef.current) {
            await videoRef.current.setRateAsync(speed, true);
            setPlaybackSpeed(speed);
            setShowSpeedMenu(false);
        }
    };

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSlidingStart = () => {
        setIsSeeking(true);
    };

    const handleSlidingComplete = async (value: number) => {
        if (videoRef.current) {
            await videoRef.current.setPositionAsync(value);
        }
        setIsSeeking(false);
    };

    const handleValueChange = (value: number) => {
        setSeekValue(value);
    };

    // Inline speed menu for fullscreen
    const InlineSpeedMenu = (
        <View style={styles.inlineSpeedMenu}>
            <Text style={styles.inlineSpeedTitle}>Speed</Text>
            {PLAYBACK_SPEEDS.map((speed) => (
                <TouchableOpacity
                    key={speed}
                    style={[
                        styles.inlineSpeedOption,
                        playbackSpeed === speed && styles.inlineSpeedOptionActive,
                    ]}
                    onPress={() => changePlaybackSpeed(speed)}
                >
                    <Text
                        style={[
                            styles.inlineSpeedOptionText,
                            playbackSpeed === speed && styles.inlineSpeedOptionTextActive,
                        ]}
                    >
                        {speed}x
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    // Modal speed menu for non-fullscreen
    const ModalSpeedMenu = (
        <Modal visible={showSpeedMenu && !isFullscreen} transparent animationType="fade">
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

    const VideoContent = (
        <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
            <View style={isFullscreen ? styles.fullscreenVideoContainer : styles.videoContainer}>
                {videoUrl ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: videoUrl }}
                        style={styles.video}
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        shouldPlay={false}
                        isLooping={false}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="videocam-off" size={48} color={COLORS.textMuted} />
                        <Text style={styles.placeholderText}>Video not available</Text>
                    </View>
                )}

                {/* Double tap zones */}
                <View style={styles.tapZonesContainer}>
                    <TouchableWithoutFeedback onPress={() => handleDoubleTap('left')}>
                        <View style={styles.tapZoneLeft} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => handleDoubleTap('right')}>
                        <View style={styles.tapZoneRight} />
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
                            size={28}
                            color="#fff"
                        />
                        <Text style={styles.skipFeedbackText}>{skipFeedback.amount}s</Text>
                    </Animated.View>
                )}

                {/* Loading indicator */}
                {isLoading && videoUrl && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                )}

                {/* Controls overlay */}
                {showControls && !isLoading && (
                    <View style={styles.controlsOverlay} pointerEvents="box-none">
                        {/* Top bar */}
                        <View style={styles.topBar} pointerEvents="auto">
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

                        {/* Center controls */}
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
                        <View style={styles.bottomBar} pointerEvents="auto">
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
                                onPress={() => setShowSpeedMenu(!showSpeedMenu)}
                                style={styles.speedButton}
                            >
                                <Text style={styles.speedButtonText}>{playbackSpeed}x</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Inline speed menu for fullscreen */}
                {isFullscreen && showSpeedMenu && InlineSpeedMenu}
            </View>
        </View>
    );

    // Wrap in modal for fullscreen
    if (isFullscreen) {
        return (
            <>
                <Modal visible={isFullscreen} animationType="fade" supportedOrientations={['landscape']}>
                    <StatusBar hidden />
                    {VideoContent}
                </Modal>
                {ModalSpeedMenu}
            </>
        );
    }

    return (
        <>
            {VideoContent}
            {ModalSpeedMenu}
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
        position: 'relative',
    },
    fullscreenVideoContainer: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    tapZonesContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
    },
    tapZoneLeft: {
        flex: 1,
    },
    tapZoneRight: {
        flex: 1,
    },
    skipFeedback: {
        position: 'absolute',
        top: '50%',
        marginTop: -30,
        width: 80,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
    },
    skipFeedbackLeft: {
        left: 30,
    },
    skipFeedbackRight: {
        right: 30,
    },
    skipFeedbackText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
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
    // Modal speed menu (non-fullscreen)
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
    // Inline speed menu (fullscreen)
    inlineSpeedMenu: {
        position: 'absolute',
        right: 16,
        bottom: 80,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    inlineSpeedTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        opacity: 0.7,
    },
    inlineSpeedOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginVertical: 2,
    },
    inlineSpeedOptionActive: {
        backgroundColor: COLORS.primary,
    },
    inlineSpeedOptionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    inlineSpeedOptionTextActive: {
        color: COLORS.background,
    },
});
