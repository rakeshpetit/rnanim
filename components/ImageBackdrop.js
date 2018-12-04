import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Image,
    SafeAreaView,TouchableWithoutFeedback, Animated, Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const images = [
    {id: 1, src: require('../assets/1.jpeg')},
    {id: 2, src: require('../assets/2.jpg')},
    {id: 3, src: require('../assets/3.jpeg')},
    {id: 4, src: require('../assets/4.jpg')},
    {id: 5, src: require('../assets/5.jpeg')},
    {id: 6, src: require('../assets/6.jpg')},
];
export class ImageBackdrop extends Component {
    constructor() {
        super();
        this.state = {
            activeImage: null
        };
        }  

    componentWillMount() {
        this.allImages = {};
        this.oldPosition = {};
        this.position = new Animated.ValueXY();
        this.dimensions = new Animated.ValueXY();
        this.animation = new Animated.Value(0);
        this.activeImageStyle = null;
    }

    closeImage = () => {
        Animated.parallel([
            Animated.timing(this.position.x, {
                toValue: this.oldPosition.x,
                duration: 300
            }),
            Animated.timing(this.position.y, {
                toValue: this.oldPosition.y,
                duration: 300
            }),
            Animated.timing(this.dimensions.x, {
                toValue: this.oldPosition.width,
                duration: 300
            }),
            Animated.timing(this.dimensions.y, {
                toValue: this.oldPosition.height,
                duration: 300
            }),
            Animated.timing(this.animation, {
                toValue: 0,
                duration: 300
            })
        ]).start(() => {
            this.setState( {
                activeImage: null
            });
        });
    }

    openImage = (index) => {
        this.allImages[index].measure((x,y,width,height,pageX,pageY) => {
            this.oldPosition.x = pageX;
            this.oldPosition.y = pageY;
            this.oldPosition.width = width;
            this.oldPosition.height = height;
            this.position.setValue({
                x:pageX,
                y:pageY
            });
            this.dimensions.setValue({
                x: width,
                y: height
            })
        })
        this.setState({ activeImage: images[index]}, 
            ()=> {
                this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
                    Animated.parallel([
                        Animated.timing(this.position.x, {
                            toValue: dPageX,
                            duration: 300
                        }),
                        Animated.timing(this.position.y, {
                            toValue: dPageY,
                            duration: 300
                        }),
                        Animated.timing(this.dimensions.x, {
                            toValue: dWidth,
                            duration: 300
                        }),
                        Animated.timing(this.dimensions.y, {
                            toValue: dHeight,
                            duration: 300
                        }),
                        Animated.timing(this.animation, {
                            toValue: 1,
                            duration: 300
                        })
                    ]).start();
                })
            });
    }
  render() {
      const activeImageStyle = {
          width: this.dimensions.x,
          height: this.dimensions.y,
          left: this.position.x,
          top: this.position.y,
      }

      const animatedContentY = this.animation.interpolate( {
        inputRange: [0, 1],
        outputRange: [-150, 0]
        });

    const animatedContentOpacity = this.animation.interpolate( {
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 1]
        });

        const animatedContentStyle = {
            opacity: animatedContentOpacity,
            transform: [{
                translateY: animatedContentY
            }]
        }

        const animatedCrossOpacity = {
            opacity: this.animation
        }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                {images.map((image, index) => {
                    return (
                        <TouchableWithoutFeedback 
                        key={image.id}
                        onPress = {() => this.openImage(index)}
                        >
                            <Animated.View style={styles.imageContainer}>
                                <Image 
                                ref={(image) => (this.allImages[index] = image)}
                                style={styles.image} source={image.src} />
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </ScrollView>
            <View style={StyleSheet.absoluteFill}
            pointerEvents={this.state.activeImage ? 'auto' : 'none' }>
                <View ref={(view) => (this.viewImage = view)} style={styles.container2}>
                    <Animated.Image style={[styles.imageClicked, activeImageStyle]}
                    source={this.state.activeImage ? this.state.activeImage.src : null} />
                    <TouchableWithoutFeedback
                    onPress = {() => this.closeImage()}>
                        <Animated.View style={[styles.textCloseContainer,  animatedCrossOpacity]}>
                            <Text style={styles.textClose}>X</Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
                <Animated.View style={[styles.textContainer, animatedContentStyle]}>
                    <Text style={styles.textTitle}>Wallpaper</Text>
                    <Text style={styles.textContent}>
                    This is a nice wallpaper. This is a nice wallpaper. This is a nice wallpaper. This is a nice wallpaper. This is a nice wallpaper.</Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    )
  }
}

export default ImageBackdrop;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textContainer: {
        flex: 1,
        zIndex: 1000,
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 50
    },
    textCloseContainer: {
        position: 'absolute',
        top: 30,
        right: 30,
        
    },
    textClose: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
    },
    textTitle: {
        fontSize: 24,
        paddingBottom: 10     
    },
    textContent: {
        fontSize: 15
    },
    container2: {
        flex: 2,
        zIndex: 1001,
    },
    imageClicked: {
        resizeMode: 'cover',
        top: 0,
        left: 0,
        height: null,
        width: null
    },
    imageContainer: {
        height: SCREEN_HEIGHT - 150,
        width: SCREEN_WIDTH,
        padding: 15       
    },
    image: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'cover',
        borderRadius : 20
    }
});