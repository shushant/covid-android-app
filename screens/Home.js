import React, { Component } from "react";
import {
  Text,
  ToastAndroid,
  StyleSheet,
  View,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Button,
  TouchableHighlight,
  Linking
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import PTRView from "react-native-pull-to-refresh";
import axios from "axios";
import { BackHandler } from "react-native";
console.disableYellowBox = true;
//import tema
import * as theme from "../Theme";
import _ from "lodash";

const { width, height } = Dimensions.get("screen");

const format = amount => {
  return Number(amount)
    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data_global: {},
      uts: [],
      default: ""
    };
  }

  _refresh = () => {
    return new Promise(resolve => {
      this.componentDidMount();
      this.setState({ default: "" });
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  handleBackButton() {
    // ToastAndroid.show("Build with Love India", ToastAndroid.SHORT);
    BackHandler.exitApp();
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

    axios.get("https://api.rootnet.in/covid19-in/stats/latest").then(res => {
      const data = res.data.data.summary;
      this.setState({ data_global: data });

      let uts = _.map(res.data.data.regional, loc => {
        return { value: loc.loc };
      });
      this.setState({ uts: uts });
    });
  }
  renderStatusGlobal = () => {
    return (
      <View style={styles.status}>
        <View style={styles.yellowCard}>
          <View style={styles.cardStyle}>
            <Image
              source={require("../assets/images/masker.png")}
              style={styles.icn}
            />
            <View>
              <Text style={styles.labelCount}>
                {format(
                  this.state.data_global.total != undefined
                    ? this.state.data_global.total
                    : ""
                )}
              </Text>
              <Text style={styles.labelDesc}>Infected</Text>
            </View>
          </View>
        </View>
        <View style={styles.greenCard}>
          <View style={styles.cardStyle}>
            <Image
              source={require("../assets/images/sembuh.png")}
              style={styles.icn}
            />
            <View>
              <Text style={styles.labelCount}>
                {format(
                  this.state.data_global.discharged != undefined
                    ? this.state.data_global.discharged
                    : ""
                )}
              </Text>
              <Text style={styles.labelDesc}>Recovered</Text>
            </View>
          </View>
        </View>
        <View style={styles.redCard}>
          <View style={styles.cardStyle}>
            <Image
              source={require("../assets/images/mati.png")}
              style={styles.icn}
            />
            <View>
              <Text style={styles.labelCount}>
                {format(
                  this.state.data_global.deaths != undefined
                    ? this.state.data_global.deaths
                    : ""
                )}
              </Text>
              <Text style={styles.labelDesc}>Died</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderUTS = () => {
    // const { route , navigation } = this.props;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Select State / UT</Text>

        <View style={styles.rapih}>
          <Dropdown
            value={this.state.default}
            baseColor={theme.colors.white}
            itemTextStyle={{
              color: "#FFF",
              fontSize: 18,
              padding: 12,
              fontFamily: "poppins"
            }}
            itemColor={theme.colors.black}
            selectedItemColor={theme.colors.black}
            textColor="#FFF"
            label="- select -"
            fontSize={16}
            data={this.state.uts}
            onChangeText={value => this.onChangeHandler(value)}
          />
          <TouchableHighlight
            underlayColor="#1F746A"
            style={styles.btngreen}
            onPress={() =>
              this.props.navigation.navigate("Detail", {
                ut: this.state.selectedUts == "" ? "" : this.state.selectedUts
              })
            }
          >
            <Text style={styles.btngreenText}>CHECK</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  renderOpenSource = () => {
    return (
      <View>
        <Text
          style={{
            ...styles.title,
            padding: 8,
            borderRadius: theme.sizes.radius,
            textAlign: "center"
          }}
        >
          Build with ♥ INDIA
        </Text>
      </View>
    );
  };

  onChangeHandler = value => {
    this.setState({ selectedUts: value });
    console.log(this.state.selectedUts);
  };

  render() {
    return (
      <PTRView onRefresh={this._refresh} style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Summary</Text>

          {/* <Button onPress={() => this.props.navigation.navigate('Provinsi')} title="Details"/> */}
          {this.renderStatusGlobal()}
          {this.renderUTS()}
          {this.renderOpenSource()}
        </View>
      </PTRView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    flexDirection: "column"
  },
  rapih: {
    height: height / 3.7,
    marginLeft: theme.padding.left,
    marginRight: theme.padding.right,
    fontFamily: "poppins",
    fontSize: 18,
    backgroundColor: theme.colors.background_secondary
  },
  title: {
    fontSize: theme.size.big,
    color: theme.colors.white,
    fontFamily: "poppins-bold",
    opacity: 0.87,
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right,
    marginTop: 25
  },
  title2: {
    fontSize: theme.size.big,
    color: theme.colors.white,
    fontFamily: "poppins-bold",
    opacity: 0.87,
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right,
    marginTop: 30
  },
  status: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right,
    marginTop: 20
  },
  yellowCard: {
    flex: 1,
    padding: 2,
    height: height / 4.5,
    backgroundColor: theme.colors.yellow,
    marginRight: 7,
    borderRadius: theme.sizes.radius
  },
  greenCard: {
    flex: 1,
    padding: 2,
    height: height / 4.5,
    backgroundColor: theme.colors.green,
    marginRight: 7,
    borderRadius: theme.sizes.radius
  },
  redCard: {
    flex: 1,
    padding: 2,
    height: height / 4.5,
    backgroundColor: theme.colors.red,
    marginRight: 7,
    borderRadius: theme.sizes.radius
  },
  cardStyle: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  labelCount: {
    color: theme.colors.white,
    fontSize: theme.size.large,
    textAlign: "center",
    fontFamily: "poppins-bold",
    marginTop: 10
  },
  labelDesc: {
    color: theme.colors.white,
    fontSize: theme.size.small,
    textAlign: "center",
    fontFamily: "poppins",
    marginTop: -5
  },
  icn: {
    width: 40,
    height: 40,
    marginTop: 10
  },
  btngreen: {
    backgroundColor: theme.colors.green,
    marginTop: 20,
    padding: 8,
    borderRadius: theme.sizes.radius
  },
  btngreenText: {
    color: theme.colors.white,
    fontSize: theme.size.large,
    textAlign: "center",
    fontFamily: "poppins-bold"
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.background_secondary,
    marginTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  textYellowBold: {
    color: theme.colors.yellow,
    fontSize: 16,
    fontFamily: "poppins-bold"
  },
  textYellow: {
    color: theme.colors.yellow,
    fontSize: 12,
    fontFamily: "poppins",
    marginTop: -5
  },
  textgreenBold: {
    color: theme.colors.green,
    fontSize: 16,
    fontFamily: "poppins-bold"
  },
  textgreen: {
    color: theme.colors.green,
    fontSize: 12,
    fontFamily: "poppins",
    marginTop: -5
  },
  textblueBold: {
    color: theme.colors.blue,
    fontSize: 16,
    fontFamily: "poppins-bold"
  },
  textblue: {
    color: theme.colors.blue,
    fontSize: 12,
    fontFamily: "poppins",
    marginTop: -5
  },
  textredBold: {
    color: theme.colors.red,
    fontSize: 16,
    fontFamily: "poppins-bold"
  },
  textred: {
    color: theme.colors.red,
    fontSize: 12,
    fontFamily: "poppins",
    marginTop: -5
  }
});

export default Home;
