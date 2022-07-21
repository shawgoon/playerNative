/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, Image, TouchableHighlight } from "react-native";

const VolBtn = (props) => { /* console.log(props.icone); */
    return(
        <TouchableHighlight onPress={props.action}>
            <Image  source = {{uri: 'asset:' + props.icone}}
                style={styles.imgIcon}
            />    
        </TouchableHighlight>
       
    )

}
const styles = StyleSheet.create({
    imgIcon:{
        width:40,
        height:40,
        borderRadius: 40,
    },
})
export default VolBtn;
