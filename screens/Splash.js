import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Button,
  TouchableHighlight
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import PTRView from "react-native-pull-to-refresh";
import axios from "axios";

//import tema
import * as theme from "../Theme";

const { width, height } = Dimensions.get("screen");

class Splash extends React.Component {
  performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve("result");
      }, 3000)
    );
  };

  async componentDidMount() {
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate("Home");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.conSplash}>
          <Image
            source={require("../assets/images/bacteria.png")}
            style={styles.icnErr}
          />
          <Text style={styles.title}>COVID19 Tracker</Text>
          <Text style={styles.subTitle}>Made with ♥</Text>
          <Text style={styles.subTitle}>in India</Text>
          <Text style={styles.subTitle}>
            WE STAND WITH EVERYONE FIGHTING ON THE FRONTLINES
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  conSplash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80
  },
  rapih: {
    marginLeft: theme.padding.left,
    marginRight: theme.padding.right,
    fontFamily: "poppins",
    fontSize: 18
  },
  title: {
    fontSize: theme.size.medium,
    color: theme.colors.white,
    fontFamily: "poppins-bold",
    opacity: 0.87,
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right,
    marginTop: 25,
    marginBottom: 10,
    textAlign: "center"
  },
  subTitle: {
    fontSize: theme.size.small,
    color: theme.colors.white,
    fontFamily: "poppins",
    opacity: 0.87,
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right,
    textAlign: "center"
  },
  icnErr: {
    width: 150,
    height: 150
  }
});

export default Splash;
