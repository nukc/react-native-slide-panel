/**
 * @author C .
 */

import React from 'react';
import {View} from "react-native";
import PropTypes from 'prop-types';
import CardView from './CardView';

export default class SlidePanel extends React.Component {

    static propTypes = {
        count: PropTypes.number,
        renderItem: PropTypes.func,
        slideThreshold: PropTypes.number,
        deviation: PropTypes.number,
        cardStyle: PropTypes.object,
    };

    static defaultProps = {
        count: 5,
    };

    constructor(props) {
        super(props);

        let index = 0;

        let items = [];
        let refs = [];
        for (let i = 0; i < props.count; i++) {
            let item = (
                <CardView
                    key={i}
                    position={i}
                    {...this.props}
                    ref={ref => refs.push(ref)}
                    style={{...this.props.cardStyle, backgroundColor: 'white', position: 'absolute', height: 300}}
                    onSlidedLeft={this.onNext.bind(this)}
                    onSlidedRight={this.onNext.bind(this)} />
            );
            index++;
            items.push(item);
        }

        this.state = {
            items: items,
            refs: refs,
            index: index,
        }
    }

    render() {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                {this.state.items}
            </View>
        )
    }

    componentDidMount() {
        let {refs} = this.state;
        for (let i = 0, count = refs.length; i < count; i++) {
            let item = refs[i];
            item.setView(this.props.renderItem(i));
        }
    }

    onNext() {
        let {refs, index} = this.state;
        let count = refs.length;

        this.setState({index: ++index});

        for (let i = 0; i < count; i++) {
            let item = refs[i];
            let itemPosition = item.getPosition();
            if (itemPosition === 0) {
                item.setView(this.props.renderItem(this.state.index));
            }
            item.setPosition(itemPosition === 0 ? count - 1 : itemPosition - 1);
        }
    }

}