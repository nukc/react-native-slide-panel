/**
 * @author C .
 */
import React from 'react';
import {StyleSheet, Dimensions, Animated, PanResponder, Platform} from 'react-native';
import PropTypes from 'prop-types';
import clamp from 'clamp';

const WIDTH = Dimensions.get('window').width;

export default class CardView extends React.Component {

    static propTypes = {
        count: PropTypes.number.isRequired,
        position: PropTypes.number,
        onSlidedLeft: PropTypes.func,
        onSlidedRight: PropTypes.func,
        slideThreshold: PropTypes.number,
        deviation: PropTypes.number,
    };

    static defaultProps = {
        slideThreshold: 80,
        deviation: 8,
        count: 0,
    };

    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            enter: new Animated.Value(0.5),

            position: props.position,
            view: null,
        };

        this._resetState = this._resetState.bind(this);
    }

    render() {
        let {pan, enter, position} = this.state;

        let [translateX, translateY] = [pan.x, pan.y];

        let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
        let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]});
        let scale = enter;

        let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

        let zIndex = this.props.count - position;

        return (
            <Animated.View style={[styles.card, animatedCardStyles,
                {...this.props.style, top: position * this.props.deviation, zIndex: zIndex}
            ]} {...this._panResponder.panHandlers}>
                {this.state.view}
            </Animated.View>
        )
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, gestureState) => {
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
                this.state.pan.setValue({x: 0, y: 0});
            },
            onPanResponderMove: Animated.event([null, {dx: this.state.pan.x, dy: this.state.pan.y}]),
            onPanResponderRelease: (e, gestureState) => {
                let {vx, vy} = gestureState;

                let velocity;

                if (vx >= 0) {
                    velocity = clamp(vx, 3, 5);
                } else if (vx < 0) {
                    velocity = clamp(vx * -1, 3, 5) * -1;
                }

                if (Math.abs(this.state.pan.x._value) > this.props.slideThreshold) {
                    Animated.decay(this.state.pan, {
                        velocity: {x: velocity, y: vy},
                        deceleration: 0.98
                    }).start(this._resetState)
                } else {
                    Animated.spring(this.state.pan, {
                        toValue: {x: 0, y: 0},
                        friction: 4
                    }).start()
                }
            }
        })
    }

    componentDidMount() {
        this._animateEntrance(this.state.position);
    }

    _animateEntrance(position) {
        let offset = (this.props.deviation / WIDTH) * position;

        if (position === this.props.count - 1) {
            this.state.enter._value = 0.5;
        }
        Animated.spring(
            this.state.enter,
            {toValue: 1 - offset, friction: 8}
        ).start();
    }

    setPosition(position) {
        this.setState({position});
        this._animateEntrance(position);
    }

    getPosition() {
        return this.state.position;
    }

    setView(view) {
        this.setState({view});
    }

    _resetState() {
        if (this.state.pan.x._value > 0) {
            this.props.onSlidedRight && this.props.onSlidedRight();
        } else {
            this.props.onSlidedLeft && this.props.onSlidedLeft();
        }
        this.state.pan.setValue({x: 0, y: 0});
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: {height: 0, width: 0},
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
        overflow: 'hidden',
    },
});