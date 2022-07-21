/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */

import React, { Component, setState } from "react";
import { StyleSheet, View, Image, Text, Animated } from  "react-native";
import { playlist } from "../playlist.js";
import NavBtn from "./NavBtn";
import VolBtn from "./VolBtn.js";
import Sound from "react-native-sound";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
// import Rotate from "./RotateDisc.js";



class Player extends Component{
    constructor(props){
        super(props);
        this.RotateValue = new Animated.Value(0);
    }
    state = {
        currentTrack: 0,
        playlist:playlist,
        playPause: true,
        transXAnim: new Animated.Value(1),
        timeManager: "0:00",
    }
    mp3 = this.initSound();
    initSound(index = this.state.currentTrack){
        /* console.log("index:"+index); */
        Sound.setCategory('Playback');
        const music = new Sound(this.state.playlist[index].mp3, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
            // loaded successfullymusic
            console.log('duration in seconds: ' + music.getDuration() + 'number of channels: ' + music.getNumberOfChannels());
          });
          return music;
    }
    // play () {
    //     this.mp3.play();
        // // rotation de l'image
        // let img = document.querySelector(".slider");
        // if (this.mp3.play) {
        //     console.log(audio.play);
        //    interval = setInterval(function () {
        //         img.style.transform = "rotateZ(" + angle++ + "deg)";
        //     }, 30);
        // }
    // }
        // bouton play - pause
    // pause () {
    //     this.mp3.pause();
        // //   arrêt de la rotation de l'image
        //  if (this.mp3.pause) {
        //     console.log(this.mp3.pause);
        //     clearInterval(interval);
        // }
    // }
    prev(){ /* console.log('prev'); */
        this.setState({playPause:false});    
        this.mp3.pause();
        let index; 
        if (this.state.currentTrack - 1 < 0){
            index = this.state.playlist.length - 1;
        } else {
            index = this.state.currentTrack - 1;
        }
        this.transOut(index);
        this.mp3 = this.initSound(index);
        setTimeout(() => {
            this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.mp3.setCurrentTime(0);
                } else {
                    console.log('playback failed due to audio decoding errors');
                } 
            });
        },100)
    }
    next(){ /* console.log('next');console.log(this.state.playlist[this.state.currentTrack].cover); */
        this.setState({playPause:false});
        this.mp3.stop();
        this.mp3.release();
        let index;
        if (this.state.currentTrack === this.state.playlist.length - 1){
        index = 0;
        } else {
            index = this.state.currentTrack + 1;
        }
        this.transOut(index);
            this.mp3 = this.initSound(index);
            setTimeout(() => {
                this.mp3.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                        this.mp3.setCurrentTime(0);
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    } 
                });
            },100)
    }
    playMp3(){
        let playPauseTmp = !this.state.playPause;
        this.setState({playPause:playPauseTmp});
        // console.log("playmp3");
        if (this.state.playPause) {
            // Play the sound with an onEnd callback
            this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.next();
                    this.mp3.setCurrentTime(0);
                    // // rotation de l'image
                    
                } else {
                    console.log('playback failed due to audio decoding errors');
                } 
            });
        } else {
            // pause 
            this.mp3.pause();
            // stop rotation 
        }
        this.time();
    }

    onSwipeLeft(gestureState) {
        this.next(); /* console.log('next'); */
        this.setState({myText: 'You swiped left!'});
    }
    
    onSwipeRight(gestureState) {
    this.prev(); /* console.log('prev'); */
    this.setState({myText: 'You swiped right!'});
    }
    
    onSwipe(gestureName, gestureState) {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    }

    // transision out du disc
    transOut = (index) => {
        Animated.timing(this.state.transXAnim, {
            toValue: 0,
            duration: 500,
        }).start(()=>{
                this.setState({currentTrack:index});
                this.transIn();
        });
    }
    // transition in du disc
    transIn = (index) => {
        Animated.timing(this.state.transXAnim, {
            toValue: 1,
            duration: 500,
        }).start(()=>{      
                console.log("l'amimation est terminée");
        });
    }

    // gestion du temps
    fancyTimeFormat(duration){
        // Hours, minutes and seconds
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
    }

    // intégration du temps
    time(){
        setInterval(()=>{
            this.mp3.getCurrentTime(
                (seconds)=>{
                    this.setState({timeManager:this.fancyTimeFormat(seconds)});
                }
            )
        },1000); 
    }

    //  Rotation du disc
    // rotate(()=>{

        componentDidMount(){
            this.StartImageRotationFunction()
        }
        StartImageRotationFunction(){
            this.RotateValue.setValue(0);
            Animated.timing(this.RotateValue, {
                toValue: 1,
                duration: 3000
            }).start(()=> this.StartImageRotationFunction())
        }
    // })

    render(){
        const RotateData = this.RotateValue.interpolate({
            inputRange: [0,1],
            outputRange: ['0deg','360deg']
        })
        return (
            <View style={styles.container}>
                <GestureRecognizer
                    onSwipe={(direction, state) => this.onSwipe(direction, state)}
                    onSwipeLeft={(state) => this.onSwipeLeft(state)}
                    onSwipeRight={(state) => this.onSwipeRight(state)}
                >
                    <Animated.Image source={
                    {uri: 'asset:/images/cover/' + this.state.playlist[this.state.currentTrack].cover}
                    }
                    style={[styles.slider,
                    {opacity: this.state.transXAnim}, 
                    {transform: [{ rotate: RotateData}]},
                    ]}>
                    </Animated.Image>
                </GestureRecognizer>
                <Text style={styles.title}>
                    {this.state.playlist[this.state.currentTrack].track} - {
                        this.state.playlist[this.state.currentTrack].title} - {
                            this.state.playlist[this.state.currentTrack].artist}
                </Text>
                <View style={styles.playNav}>
                    <NavBtn action={()=>{this.prev();}} icone={"/images/playButton/prev.jpg"}></NavBtn>
                    <NavBtn action={()=>{this.playMp3();}} icone={ this.state.playPause ? "/images/playButton/play.jpg":"/images/playButton/pause.jpg"}></NavBtn>
                    <NavBtn action={()=>{this.next();}} icone={"/images/playButton/next.jpg"}></NavBtn>
                </View>
                <Text style={styles.time}>{this.state.timeManager}</Text>
                    <Text style={styles.info}>
                    {this.state.playlist[this.state.currentTrack].genre} - {
                        this.state.playlist[this.state.currentTrack].annee} - {
                            this.state.playlist[this.state.currentTrack].description}
                    </Text>
                <View style={styles.volNav}>
                    <VolBtn action={()=>{this.volDown();}} icone={"/images/volButton/down.png"}></VolBtn>
                    <View></View>
                    <VolBtn action={()=>{this.volUp();}} icone={"/images/volButton/up.png"}></VolBtn>
                </View>
            </View>
        )
    }
}
const styles= StyleSheet.create ({
    container: {
        width:'100%',
        height:'100%',
        backgroundColor: 'rgb(99, 119, 230)',
        alignItems: 'center',
      },
    slider:{
        width:320, height:320,
        margin: 16,
        borderRadius:320,
    },
    playNav:{
        width:'90%',
        height: 70,
        padding: 5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        backgroundColor: 'aqua',
        borderRadius: 70,
    },
    title:{
        width: '80%',
        height: 48,
        margin: 8,
        backgroundColor: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 1020,
    },
    time:{
        width: '80%',
        height: 48,
        fontSize: 36,
        margin: 8,
        backgroundColor: 'white',
        textAlign: 'center',
    },
    info:{
        width: '80%',
        height: 48,
        margin: 8,
        backgroundColor: 'rgb(219, 174, 245)',
        textAlign: 'center',
    },
    volNav:{
        width:'90%',
        height: 50,
        padding: 5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        backgroundColor: 'aqua',
        borderRadius: 50,
    },
})
export default Player;