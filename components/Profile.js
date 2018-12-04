import React, { Component } from 'react'
import { Animated, Text, Image, ScrollView, View, StyleSheet } from 'react-native'


const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0)
        };
        }  
  render() {
      const headerHeight = this.state.scrollY.interpolate( {
          inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT],
          outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
          extrapolate: 'clamp'
      });
      const profileImageHeight = this.state.scrollY.interpolate( {
        inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT],
        outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
        extrapolate: 'clamp'
    });
    const profileImageMarginTop = this.state.scrollY.interpolate( {
        inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT],
        outputRange: [(HEADER_MAX_HEIGHT-PROFILE_IMAGE_MAX_HEIGHT/2), HEADER_MAX_HEIGHT+5],
        extrapolate: 'clamp'
    });
    const headerZIndex = this.state.scrollY.interpolate( {
        inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });
    const headerTitleBottom = this.state.scrollY.interpolate( {
        inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT,
            HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
            HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT + 26],
        outputRange: [-20, -20, -20, 0],
        extrapolate: 'clamp'
    });
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header,{ zIndex: headerZIndex, height: headerHeight }]}>
            <Animated.View style={[styles.textScrolledContainer, {bottom: headerTitleBottom}]}>
                <Text style={styles.textScrolled}>Batman</Text>
            </Animated.View>
            </Animated.View>
            <ScrollView style={styles.container}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                )}>
                <Animated.View 
                    style={[styles.imageContainer,{ marginTop: profileImageMarginTop, width: profileImageHeight, height: profileImageHeight }]}>
                    <Image style={styles.image} source={require('../assets/batman.jpg')} />
                </Animated.View>
                <View>
                    <Text style={styles.text}>Batman</Text>
                </View>
                <View style={{height: 1200}}></View>
            </ScrollView>
        </View>
    )
  }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
      position : 'absolute',
      alignItems: 'center',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'lightskyblue',
      height: HEADER_MAX_HEIGHT
    },
    imageContainer: {
        height: PROFILE_IMAGE_MAX_HEIGHT,
        width: PROFILE_IMAGE_MAX_HEIGHT,
        borderRadius: PROFILE_IMAGE_MAX_HEIGHT,
        borderColor: 'white',
        borderWidth: 3,
        overflow: 'hidden',
        marginTop: (HEADER_MAX_HEIGHT-PROFILE_IMAGE_MAX_HEIGHT/2),
        marginLeft: 10
    },
    text: {
        fontWeight: 'bold',
        fontSize: 24,
        paddingLeft: 10
    },
    textScrolledContainer: {
        position: 'absolute',
        bottom: 0
    },
    textScrolled: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        paddingLeft: 10
    },
    image: {
        flex: 1,
        height: null,
        width: null
    }
  });