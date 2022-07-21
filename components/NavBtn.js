/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, Image, TouchableHighlight } from "react-native";

const NavBtn = (props) => { /* console.log(props.icone); */
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
        width:60,
        height:60,
        borderRadius: 60,
    },
})
export default NavBtn;