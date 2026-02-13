import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    Platform,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import BrandLogo from "@/components/BrandLogo";
import Label from "@/components/Label";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

// ⚠️ Ensure your .env file has GOOGLE_API_KEY=your_key_here
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey || process.env.GOOGLE_API_KEY;

// Placeholder for data import (we will replace these with real imports later)
// import sydneyBikeLanes from '@/assets/data/sydney_bike_lanes.json';
// import nswBikeParking from '@/assets/data/nsw_bike_parking.json';
// import { privateStations } from '@/services/mockStations';

export default function Explore() {
  const router = useRouter();
  const mapRef = useRef(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  // --- Map State ---
  const [origin, setOrigin] = useState(null); 
  const [destination, setDestination] = useState(null); 
  const [routeDetails, setRouteDetails] = useState(null); 
  const [isNavigationMode, setIsNavigationMode] = useState(false);
  
  // --- Filter State (from Wireframes) ---
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filters, setFilters] = useState({
    currentCharging: true,   // Blue Markers
    futureCharging: false,   // Green Markers
    dedicatedStations: false, // Purple Markers
    bikeInfrastructure: true, // Green Lines
  });

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

  // 1. Get User Location on Mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      try {
        let location = await Location.getCurrentPositionAsync({});
        const userLoc = { 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude 
        };
        setOrigin(userLoc);
        
        // Optional: Animate map to user initially
        // mapRef.current?.animateToRegion({
        //     ...userLoc,
        //     latitudeDelta: 0.05,
        //     longitudeDelta: 0.05,
        // });
      } catch (error) {
        console.log("Error fetching location", error);
      }
    })();
  }, []);

  // 2. Handle Keyboard Animation
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event) => {
        Animated.timing(keyboardHeight, { 
            toValue: event.endCoordinates.height, 
            duration: 250, 
            useNativeDriver: false 
        }).start();
    };
    const onHide = () => {
        Animated.timing(keyboardHeight, { 
            toValue: 0, 
            duration: 250, 
            useNativeDriver: false 
        }).start();
    };

    const sub1 = Keyboard.addListener(showEvent, onShow);
    const sub2 = Keyboard.addListener(hideEvent, onHide);
    return () => { sub1.remove(); sub2.remove(); };
  }, []);

  // 3. Navigation Logic
  const handlePlaceSelect = (details) => {
    if (!details) return;
    const { lat, lng } = details.geometry.location;
    const dest = { latitude: lat, longitude: lng };
    
    setDestination(dest);
    setIsNavigationMode(true);
    Keyboard.dismiss();
    
    if (origin && mapRef.current) {
        mapRef.current.fitToCoordinates([origin, dest], { 
            edgePadding: { top: 100, right: 50, bottom: 300, left: 50 }, 
            animated: true 
        });
    }
  };

  const cancelNavigation = () => {
    setIsNavigationMode(false);
    setDestination(null);
    setRouteDetails(null);
    // Optional: Reset view to origin
    if (origin && mapRef.current) {
        mapRef.current.animateToRegion({
            ...origin,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
        });
    }
  };

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScreenWrapper backgroundColor={Colors.white} edges={["top"]}>
      <View style={styles.headerSpacing}><BrandLogo /></View>

      <View style={styles.mapContainer}>
        <MapView 
            ref={mapRef} 
            provider={PROVIDER_GOOGLE} 
            style={styles.map} 
            initialRegion={region} 
            showsUserLocation={true} 
            showsMyLocationButton={false}
            showsCompass={false}
            // If you want Google's standard bike layer as a fallback:
            showsBicycling={false} 
        >
            {/* --- 1. NAVIGATION ROUTE --- */}
            {origin && destination && (
                <MapViewDirections 
                    origin={origin} 
                    destination={destination} 
                    apikey={GOOGLE_API_KEY} 
                    strokeWidth={4} 
                    strokeColor={Colors.primary} 
                    mode="BICYCLING" // Optimize for bikes
                    onReady={(result) => setRouteDetails({ 
                        distance: result.distance, 
                        duration: result.duration 
                    })} 
                />
            )}
            
            {/* --- 2. DESTINATION MARKER --- */}
            {destination && (
                <Marker coordinate={destination}>
                    <Ionicons name="location" size={40} color={Colors.red} />
                </Marker>
            )}

            {/* --- 3. CUSTOM LAYERS (Placeholder for when we add data) --- */}
            {/* {filters.bikeInfrastructure && (
                <Geojson geojson={sydneyBikeLanes} strokeColor="green" strokeWidth={3} />
            )}
            */}

        </MapView>

        {/* --- UI OVERLAY --- */}
        <Animated.View style={[styles.bottomUIContainer, { bottom: keyboardHeight }]}>
            
            {/* A. Search & More Buttons */}
            {!isNavigationMode && !showMoreFilters && (
                <View style={styles.searchWrapper}>
                    <View style={styles.searchInputContainer}>
                        <GooglePlacesAutocomplete 
                            placeholder='Search Destination' 
                            onPress={(data, details = null) => handlePlaceSelect(details)} 
                            query={{ key: GOOGLE_API_KEY, language: 'en' }} 
                            fetchDetails={true} 
                            styles={placesAutocompleteStyles} 
                            enablePoweredByContainer={false}
                            renderLeftButton={() => (
                                <Ionicons name="search" size={20} color={Colors.placeholderTextColor} style={{marginLeft: 15, alignSelf:'center'}}/>
                            )}
                            textInputProps={{ placeholderTextColor: Colors.placeholderTextColor }}
                        />
                    </View>
                    <TouchableOpacity style={styles.moreButton} activeOpacity={0.8} onPress={() => setShowMoreFilters(true)}>
                        <Ionicons name="layers-outline" size={24} color={Colors.black} />
                        <Label variant="caption" color={Colors.primary} bold style={{marginTop: -2}}>More</Label>
                    </TouchableOpacity>
                </View>
            )}

            {/* B. "More" Filters Panel (The Overlay) */}
            {showMoreFilters && (
                 <View style={styles.filtersPanel}>
                    <View style={styles.filterHeader}>
                        <Label variant="subheading">Map Layers</Label>
                        <TouchableOpacity onPress={() => setShowMoreFilters(false)}>
                            <Ionicons name="close" size={24} color={Colors.black} />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Toggle 1: Current Charging (Blue) */}
                    <View style={styles.filterRow}>
                         <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
                            <Ionicons name="battery-charging" size={20} color={Colors.primary} />
                            <Label>Current Charging Stations</Label>
                         </View>
                         <Switch 
                            value={filters.currentCharging} 
                            onValueChange={() => toggleFilter('currentCharging')}
                            trackColor={{ false: "#767577", true: Colors.primary }}
                         />
                    </View>

                    {/* Toggle 2: Future Charging (Green) */}
                    <View style={styles.filterRow}>
                         <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
                            <Ionicons name="time" size={20} color={Colors.success} />
                            <Label>Future Charging Stations</Label>
                         </View>
                         <Switch 
                            value={filters.futureCharging} 
                            onValueChange={() => toggleFilter('futureCharging')}
                            trackColor={{ false: "#767577", true: Colors.success }}
                         />
                    </View>

                     {/* Toggle 3: Dedicated Stations (Purple) */}
                     <View style={styles.filterRow}>
                         <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
                            <Ionicons name="bicycle" size={20} color="#9C27B0" />
                            <Label>Dedicated Bike Stations</Label>
                         </View>
                         <Switch 
                            value={filters.dedicatedStations} 
                            onValueChange={() => toggleFilter('dedicatedStations')}
                            trackColor={{ false: "#767577", true: "#9C27B0" }}
                         />
                    </View>

                    {/* Toggle 4: Infrastructure (Green Lines) */}
                    <View style={styles.filterRow}>
                         <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
                            <Ionicons name="git-branch" size={20} color="green" />
                            <Label>Bike Lane Infrastructure</Label>
                         </View>
                         <Switch 
                            value={filters.bikeInfrastructure} 
                            onValueChange={() => toggleFilter('bikeInfrastructure')}
                            trackColor={{ false: "#767577", true: "green" }}
                         />
                    </View>
                 </View>
            )}

            {/* C. Active Navigation Panel */}
            {isNavigationMode && (
                <View style={styles.navigationPanel}>
                    <View style={styles.navHeader}>
                        <TouchableOpacity onPress={cancelNavigation} style={{padding: 5}}>
                            <Ionicons name="close-circle" size={28} color={Colors.tabInactive} />
                        </TouchableOpacity>
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
                        <View style={[styles.fakeInput, {borderColor: Colors.primary}]}>
                            <Label color={Colors.black}>Selected Destination</Label>
                        </View>
                    </View>
                </View>
            )}

        </Animated.View>
      </View>

      {/* Manual Navigation Tabs */}
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
    
    // Search & More
    searchWrapper: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    searchInputContainer: { flex: 1, backgroundColor: Colors.white, borderRadius: 25, borderWidth: 2, borderColor: Colors.primary, height: 50, justifyContent: 'center', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    moreButton: { backgroundColor: Colors.white, width: 50, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    
    // Filters Panel
    filtersPanel: { backgroundColor: Colors.white, marginHorizontal: 20, padding: 20, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },

    // Navigation Panel
    navigationPanel: { backgroundColor: Colors.white, marginHorizontal: 20, padding: 15, borderRadius: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, elevation: 10, borderWidth: 1, borderColor: Colors.border },
    navHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    navInputRow: { flexDirection: 'row', alignItems: 'center' },
    fakeInput: { flex: 1, height: 44, backgroundColor: Colors.inputBackground, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: Colors.borderDark },
    
    // Bottom Nav Tabs
    navContainer: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
    navTouchable: { paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
    navUnderline: { textDecorationLine: "underline" },
});

const placesAutocompleteStyles = {
    textInput: { height: 46, color: Colors.black, backgroundColor: Colors.transparent, borderRadius: 25, paddingRight: 15, fontFamily: Fonts.secondary },
    listView: { position: 'absolute', top: 54, zIndex: 10, width: '100%', backgroundColor: Colors.white, borderRadius: 8, elevation: 5 },
};