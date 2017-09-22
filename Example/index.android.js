/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import SlidePanel from "react-native-slide-panel";

export default class Example extends Component {
    render() {
        return (
                <SlidePanel
                    deviation={10}
                    slideThreshold={80}
                    cardStyle={{height: 300, width: '90%'}}
                    renderItem={(index) => {
                        console.log(index);

                        let r = Math.floor(Math.random() * 256);
                        let g = Math.floor(Math.random() * 256);
                        let b = Math.floor(Math.random() * 256);
                        let rgb = `rgb(${r},${g},${b})`;

                        return (
                            <View
                                style={{flex: 1, backgroundColor: rgb, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: 'white', fontSize: 36}}>{index}</Text>
                            </View>
                        )
                    }}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop: 100,
    },
});

AppRegistry.registerComponent('Example', () => Example);
