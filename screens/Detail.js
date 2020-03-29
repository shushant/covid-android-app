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
  BackHandler,
  ToastAndroid,
  Button,
  Linking,
  TouchableNativeFeedback
} from "react-native";
import PTRView from "react-native-pull-to-refresh/index";
import moment from "moment";
import Loading from "react-native-whc-loading";

import axios from "axios";
import _ from "lodash";

import * as theme from "../Theme";

const { width, height } = Dimensions.get("window");

const format = amount => {
  return Number(amount)
    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

class Detail extends React.Component {
  static navigationOptions = ({ route }) => ({
    title: `${route.pilneg}`,
    headerTitleStyle: { textAlign: "center", alignSelf: "center" },
    headerStyle: {
      backgroundColor: "white"
    }
  });

  constructor(props) {
    super(props);
    let helplines = [
      { city: "Andhra Pradesh", helpline: "0866-2410978" },
      { city: "Arunachal Pradesh", helpline: "9536055743" },
      { city: "Assam", helpline: "6913347770" },
      { city: "Bihar", helpline: "104" },
      { city: "Chhattisgarh", helpline: "077122-35091" },
      { city: "Goa", helpline: "104" },
      { city: "Gujarat", helpline: "104" },
      { city: "Haryana", helpline: "8558893911" },
      { city: "Himachal Pradesh", helpline: "104" },
      { city: "Jharkhand", helpline: "104" },
      { city: "Karnataka", helpline: "104" },
      { city: "Kerala", helpline: "0471-2552056" },
      { city: "Madhya Pradesh", helpline: "0755-2527177" },
      { city: "Maharashtra", helpline: "020-26127394" },
      { city: "Manipur", helpline: "3852411668" },
      { city: "Meghalaya", helpline: "108" },
      { city: "Mizoram", helpline: "102" },
      { city: "Nagaland", helpline: "7005539653" },
      { city: "Odisha", helpline: "9439994859" },
      { city: "Punjab", helpline: "104" },
      { city: "Rajasthan", helpline: "0141-2225624" },
      { city: "Sikkim", helpline: "104" },
      { city: "Tamil Nadu", helpline: "044-29510500" },
      { city: "Telengana", helpline: "104" },
      { city: "Tripura", helpline: "0381-2315879" },
      { city: "Uttar Pradesh", helpline: "18001805145" },
      { city: "Uttarakhand", helpline: "104" },
      { city: "West Bengal", helpline: "03323412600" },
      // { city: null, helpline: null },
      // { city: null, helpline: null },
      // { city: "Name of Union Territory (UT)", helpline: "Helpline numbers" },
      { city: "Andaman and Nicobar Islands", helpline: "03192-232102" },
      { city: "Chandigarh", helpline: "9779558282" },
      { city: "D & N Haveli", helpline: "104" },
      // { city: "104", helpline: null },
      { city: "Delhi", helpline: "011-22307145" },
      { city: "Jammu and Kashmir", helpline: "1912520982" },
      // { city: "0194-2440383", helpline: null },
      { city: "Ladakh", helpline: "01982-256462" },
      { city: "Lakshdweep", helpline: "04896-263742" },
      { city: "Puducherry", helpline: "104" }
    ];
    this.state = {
      details: {},
      helplines: helplines,
      selectedhelpline: "",
      isError: false,
      selectedUt: "",
      isLoading: true,
      lastUpdate: ""
    };
  }

  _refresh = () => {
    return new Promise(resolve => {
      this.componentDidMount();
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  //back button
  handleBackButton() {
    // const { route , navigation } = this.props;
    this.navigation.navigate("Home");
    // ToastAndroid.show("Selalu Cuci Tanganmu", ToastAndroid.SHORT);

    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

    const { params } = this.props.route;
    const ut = params ? params.ut : null;

    var url = "https://api.rootnet.in/covid19-in/stats/latest";

    this.refs.loading.show(this.state.isLoading);

    axios
      .get(url)
      .then(res => {
        let data = res.data.data.regional;
        let findings = _.filter(data, it => it.loc == ut);

        let helplineUt = this.state.helplines.filter(h => h.city == ut);
        console.log('city',helplineUt[0].helpline);
        // ToastAndroid.show(findings[0].deaths + "", ToastAndroid.LONG);

        this.setState({
          selectedUt: ut,
          selectedhelpline: helplineUt[0].helpline,
          details: {
            total:
              Number(findings[0].confirmedCasesForeign) +
              Number(findings[0].confirmedCasesIndian),
            ...findings[0]
          },
          isLoading: false,
          lastUpdate: res.data.lastRefreshed
        });

        this.refs.loading.show(this.state.isLoading);
      })
      .catch(err => {
        console.log(err)
        this.setState({
          isError: true,
          selectedUt: ut,
          isLoading: false
        });

        //update state loading
        this.refs.loading.show(this.state.isLoading);
      });
  }

  render() {
    const isOk = this.state.isError;
    if (this.state.isError == false) {
      return (
        <PTRView onRefresh={this._refresh} style={styles.container}>
          <Loading ref="loading" />
          <View>
            <Text style={styles.title}>Last Update</Text>
            <Text style={styles.subtitle}>
              {this.state.lastUpdate}
            </Text>

            <Button
              onPress={() =>
                this.props.navigation.navigate("City", {
                  ut: this.state.selectedUt
                })
              }
              title="City-Wise Details"
            />

            <View style={styles.rapih}>
              <View style={styles.yellowCard}>
                <View>
                  <Text style={styles.labelDesc}>Infected</Text>
                  <Text style={styles.labelCount}>
                    {format(
                      this.state.details.total != undefined
                        ? this.state.details.total
                        : ""
                    )}
                  </Text>
                </View>
                <Image
                  source={require("../assets/images/masker.png")}
                  style={styles.icn}
                />
              </View>

              <View style={styles.greenCard}>
                <View>
                  <Text style={styles.labelDesc}>Recovered</Text>
                  <Text style={styles.labelCount}>
                    {format(
                      this.state.details.discharged != undefined
                        ? this.state.details.discharged
                        : ""
                    )}
                  </Text>
                </View>
                <Image
                  source={require("../assets/images/sembuh.png")}
                  style={styles.icn}
                />
              </View>

              <View style={styles.redCard}>
                <View>
                  <Text style={styles.labelDesc}>Deaths</Text>
                  <Text style={styles.labelCount}>
                    {format(
                      this.state.details.deaths != undefined
                        ? this.state.details.deaths
                        : ""
                    )}
                  </Text>
                </View>
                <Image
                  source={require("../assets/images/mati.png")}
                  style={styles.icn}
                />
              </View>
              {/* Linking.openURL(`tel:${phoneNumber}`) */}
              <TouchableNativeFeedback
                onPress={() =>
                  Linking.openURL(
                    `tel:${
                      this.state.selectedhelpline != undefined
                        ? this.state.selectedhelpline
                        : ""
                    }`
                  )
                }
              >
                <View style={styles.helpCard}>
                  <View>
                    <Text style={styles.labelDesc}>Helpline Number</Text>
                    <Text style={styles.labelCount}>
                      {this.state.selectedhelpline != undefined
                        ? this.state.selectedhelpline
                        : ""}
                    </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </PTRView>
      );
    } else {
      return (
        <View style={styles.containerErr}>
          <Loading ref="loading" />
          <Image
            source={require("../assets/images/bacteria.png")}
            style={styles.icnErr}
          />
          <Text style={styles.errorTitle}>{this.state.selectedUt}</Text>
          <Text style={styles.errorSubTitle}>Internal Server Error</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
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
  containerErr: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -100
  },
  errorTitle: {
    fontSize: theme.size.big,
    color: theme.colors.white,
    fontFamily: "poppins-bold",
    opacity: 0.87,
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right,
    marginTop: 30,
    textAlign: "center"
  },
  errorSubTitle: {
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
  },
  subtitle: {
    fontSize: theme.size.small,
    color: theme.colors.white,
    fontFamily: "poppins",
    opacity: 0.67,
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right
  },
  rapih: {
    marginTop: 20,
    marginLeft: theme.padding.left,
    marginRight: theme.padding.right
  },
  yellowCard: {
    flex: 1,
    backgroundColor: theme.colors.yellow,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: theme.padding.right,
    paddingLeft: theme.padding.left,
    borderRadius: theme.sizes.radius,
    alignItems: "center"
  },
  greenCard: {
    flex: 1,
    backgroundColor: theme.colors.green,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: theme.padding.right,
    paddingLeft: theme.padding.left,
    borderRadius: theme.sizes.radius,
    alignItems: "center",
    marginTop: 20
  },
  redCard: {
    flex: 1,
    backgroundColor: theme.colors.red,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: theme.padding.right,
    paddingLeft: theme.padding.left,
    borderRadius: theme.sizes.radius,
    alignItems: "center",
    marginTop: 20
  },
  helpCard: {
    flex: 1,
    backgroundColor: theme.colors.blue,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: theme.padding.right,
    paddingLeft: theme.padding.left,
    borderRadius: theme.sizes.radius,
    alignItems: "center",
    marginTop: 20
  },
  labelCount: {
    fontFamily: "poppins-bold",
    color: theme.colors.white,
    fontSize: 30,
    marginTop: -5
  },
  labelDesc: {
    fontFamily: "poppins",
    color: theme.colors.white,
    fontSize: theme.size.medium,
    marginTop: 10
  }
});

export default Detail;
