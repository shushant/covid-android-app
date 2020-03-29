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
  TouchableHighlight
} from "react-native";
import PTRView from "react-native-pull-to-refresh/index";
import moment from "moment";
import Loading from "react-native-whc-loading";

import axios from "axios";

//import tema
import * as theme from "../Theme";

const { width, height } = Dimensions.get("window");

const format = amount => {
  return Number(amount)
    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

class Provinsi extends React.Component {
  static navigationOptions = ({ route }) => ({
    title: `${route.pilneg}`,
    headerTitleStyle: { textAlign: "center", alignSelf: "center" },
    headerStyle: {
      backgroundColor: "white"
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      city: [],
      isError: false,
      isLoading: true
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

  componentDidMount() {
    //show loading
    const { params } = this.props.route;
    const ut = params ? params.ut : null;
    // ToastAndroid.show(ut, ToastAndroid.SHORT)
    this.refs.loading.show(this.state.isLoading);
    axios
      .get("https://api.covid19india.org/state_district_wise.json")
      .then(res => {
        this.setState({
          city: res.data[ut].districtData,
          isLoading: false
        });

        this.refs.loading.show(this.state.isLoading);
      });
  }

  renderDataProvinsi = () => {
    //get length
    var city_total = this.state.city.length;
    var city = this.state.city;
    return (
      <View style={{ marginBottom: 40 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.title}>City List</Text>
        </View>

        {Object.keys(city).map(function(key) {
          return (
            <View style={styles.kartuItem}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.headerKartu}>{key}</Text>
              </View>

              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                {/* <Text style={styles.textDescKuning}>Confirmed : </Text> */}
                {/* <Text style={styles.textDescgreen}>Sembuh : </Text> */}
                <Text style={styles.textDescred}>
                  Confirmed : {city[key].confirmed}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    return (
      <PTRView onRefresh={this._refresh} style={styles.container}>
        <Loading ref="loading" />
        <View style={{ flex: 1 }}>{this.renderDataProvinsi()}</View>
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
  kartuItem: {
    marginTop: 10,
    backgroundColor: theme.colors.background_secondary,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: theme.padding.left,
    paddingRight: theme.padding.right,
    fontFamily: "poppins"
  },
  headerKartu: {
    fontFamily: "poppins-bold",
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.87
  },
  statusPasienD: {
    color: theme.colors.blue,
    marginTop: 5,
    fontSize: 12,
    fontFamily: "poppins-bold"
  },
  textDesc: {
    marginTop: 10,
    color: theme.colors.white
  },
  textDescKuning: {
    marginTop: 10,
    color: theme.colors.kuning,
    paddingRight: 20
  },
  textDescgreen: {
    marginTop: 10,
    color: theme.colors.green,
    paddingRight: 20
  },
  textDescred: {
    marginTop: 10,
    color: theme.colors.red
  },
  textDescblue: {
    marginTop: 10,
    color: theme.colors.blue
  }
});

export default Provinsi;
