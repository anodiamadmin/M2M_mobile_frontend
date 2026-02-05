import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { WebView } from 'react-native-webview';

import BrandLogo from "@/components/BrandLogo";
import Label from "@/components/Label";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey || process.env.GOOGLE_API_KEY;

export default function Explore() {
  const router = useRouter();
  const mapRef = useRef(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  const [origin, setOrigin] = useState(null); 
  const [destination, setDestination] = useState(null); 
  const [routeDetails, setRouteDetails] = useState(null); 
  const [isNavigationMode, setIsNavigationMode] = useState(false);
  const [showWebMap, setShowWebMap] = useState(false); 

  const [region, setRegion] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const navItems = [
    { id: "maps", label: "Maps", path: "/(tabs)/explore" },
    { id: "info", label: "Info", path: "/explore/info" },
    { id: "community", label: "Community Update", path: "/explore/community-updates" },
    { id: "ask-ai", label: "Ask AI", path: "/explore/ask-ai" },
  ];
  const activeTab = "maps";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    const keyboardWillShow = (event) => {
      Animated.timing(keyboardHeight, { toValue: event.endCoordinates.height, duration: 250, useNativeDriver: false }).start();
    };
    const keyboardWillHide = () => {
      Animated.timing(keyboardHeight, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    };
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showListener = Keyboard.addListener(showEvent, keyboardWillShow);
    const hideListener = Keyboard.addListener(hideEvent, keyboardWillHide);
    return () => { showListener.remove(); hideListener.remove(); };
  }, []);

  const handlePlaceSelect = (details) => {
    const { lat, lng } = details.geometry.location;
    const dest = { latitude: lat, longitude: lng };
    setDestination(dest);
    setIsNavigationMode(true);
    Keyboard.dismiss();
    if (origin && mapRef.current) {
        mapRef.current.fitToCoordinates([origin, dest], { edgePadding: { top: 100, right: 50, bottom: 300, left: 50 }, animated: true });
    }
  };

  const cancelNavigation = () => {
    setIsNavigationMode(false);
    setDestination(null);
    setRouteDetails(null);
  };

  return (
    <ScreenWrapper backgroundColor={Colors.white} edges={["top"]}>
      <View style={styles.headerSpacing}><BrandLogo /></View>

      <View style={styles.mapContainer}>
        {!showWebMap && (
          <>
            <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={region} showsUserLocation={true} showsMyLocationButton={false}>
                {origin && destination && (
                    <MapViewDirections origin={origin} destination={destination} apikey={GOOGLE_API_KEY} strokeWidth={4} strokeColor={Colors.primary} 
                        onReady={(result) => setRouteDetails({ distance: result.distance, duration: result.duration })} />
                )}
                {destination && (<Marker coordinate={destination}><Ionicons name="location" size={40} color={Colors.primary} /></Marker>)}
            </MapView>

            <Animated.View style={[styles.bottomUIContainer, { bottom: keyboardHeight }]}>
                {!isNavigationMode ? (
                    <View style={styles.searchWrapper}>
                        <View style={styles.searchInputContainer}>
                            <GooglePlacesAutocomplete placeholder='Search Destination' onPress={(data, details = null) => handlePlaceSelect(details)} query={{ key: GOOGLE_API_KEY, language: 'en' }} fetchDetails={true} styles={placesAutocompleteStyles} enablePoweredByContainer={false}
                                renderLeftButton={() => (<Ionicons name="search" size={20} color={Colors.placeholderTextColor} style={{marginLeft: 15, alignSelf:'center'}}/>)}
                                textInputProps={{ placeholderTextColor: Colors.placeholderTextColor }}
                            />
                        </View>
                        <TouchableOpacity style={styles.moreButton} activeOpacity={0.8} onPress={() => setShowWebMap(true)}>
                            <Ionicons name="layers-outline" size={24} color={Colors.black} />
                            <Label variant="caption" color={Colors.primary} bold style={{marginTop: -2}}>More</Label>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.navigationPanel}>
                        <View style={styles.navHeader}>
                            <TouchableOpacity onPress={cancelNavigation} style={{padding: 5}}><Ionicons name="close-circle" size={28} color={Colors.tabInactive} /></TouchableOpacity>
                            {routeDetails && (
                                <View style={{alignItems: 'flex-end'}}>
                                    <Label bold size={16} color={Colors.success}>{routeDetails.duration.toFixed(0)} min</Label>
                                    <Label variant="caption" color={Colors.tabInactive}>{routeDetails.distance.toFixed(1)} km</Label>
                                </View>
                            )}
                        </View>
                        <View style={styles.navInputRow}>
                            <Ionicons name="navigate-circle" size={24} color={Colors.primary} style={{marginRight: 10}} />
                            <View style={styles.fakeInput}><Label color={Colors.black}>My Current Location</Label></View>
                        </View>
                        <View style={[styles.navInputRow, {marginTop: 10}]}>
                            <Ionicons name="location" size={24} color={Colors.red} style={{marginRight: 10}} />
                            <View style={[styles.fakeInput, {borderColor: Colors.primary}]}><Label color={Colors.black}>Selected Destination</Label></View>
                        </View>
                    </View>
                )}
            </Animated.View>
          </>
        )}

        {showWebMap && (
           <View style={{flex: 1}}>
              <WebView source={{ uri: "https://www.google.com/maps/d/embed?mid=18LrGVELKm9obR7Xh_BH6_r7sAzc&ehbc=2E312F" }} style={{ flex: 1 }} startInLoadingState={true}
                  renderLoading={() => (<View style={styles.webLoading}><ActivityIndicator size="large" color={Colors.primary}/></View>)} />
              <TouchableOpacity style={styles.closeWebButton} onPress={() => setShowWebMap(false)}>
                  <Ionicons name="close" size={24} color={Colors.white} />
                  <Label variant="caption" color={Colors.white} bold>Close</Label>
              </TouchableOpacity>
           </View>
        )}
      </View>

      {/* Manual Navigation Render */}
      <View style={styles.navContainer}>
        {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
            <TouchableOpacity key={item.id} onPress={() => { if (!isActive) router.push(item.path); }} activeOpacity={0.7} style={styles.navTouchable}>
                <Label size={isActive ? 16 : 15} bold={isActive} color={isActive ? Colors.success : Colors.primary} style={[!isActive && styles.navUnderline]}>
                {item.label}
                </Label>
            </TouchableOpacity>
            );
        })}
      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
    headerSpacing: { marginTop: 10, marginBottom: 5, paddingHorizontal: 16 },
    mapContainer: { flex: 1, position: 'relative' },
    map: { ...StyleSheet.absoluteFillObject },
    bottomUIContainer: { position: 'absolute', left: 0, right: 0, zIndex: 10, paddingBottom: 20 },
    searchWrapper: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    searchInputContainer: { flex: 1, backgroundColor: Colors.white, borderRadius: 25, borderWidth: 2, borderColor: Colors.primary, height: 50, justifyContent: 'center', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    moreButton: { backgroundColor: Colors.white, width: 50, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    webLoading: { position:'absolute', top:0, left:0, right:0, bottom:0, alignItems:'center', justifyContent:'center', backgroundColor:'white' },
    closeWebButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: Colors.red, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 5, opacity: 0.5},
    navigationPanel: { backgroundColor: Colors.white, marginHorizontal: 20, padding: 15, borderRadius: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, elevation: 10, borderWidth: 1, borderColor: Colors.border },
    navHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    navInputRow: { flexDirection: 'row', alignItems: 'center' },
    fakeInput: { flex: 1, height: 44, backgroundColor: Colors.inputBackground, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: Colors.borderDark },
    
    // Nav Styles
    navContainer: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
    navTouchable: { paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
    navUnderline: { textDecorationLine: "underline" },
});

const placesAutocompleteStyles = {
    textInput: { height: 46, color: Colors.black, backgroundColor: Colors.transparent, borderRadius: 25, paddingRight: 15, fontFamily: Fonts.secondary },
    listView: { position: 'absolute', top: 54, zIndex: 10, width: '100%', backgroundColor: Colors.white, borderRadius: 8, elevation: 5 },
};