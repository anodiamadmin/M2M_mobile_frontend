import { Colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 100,
  },
  topSection: {
    marginTop: 40,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
    transform: [{ scale: 1.8 }],
  },
  footerContainer: {
    marginBottom: 40,
  },
});

export const landingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  topSection: {
    marginBottom: 60,
    alignItems: "center",
  },
  circleBadge: {
    width: 280,
    height: 280,
    borderRadius: 140, 
    backgroundColor: Colors.black, 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 150,
    transform: [{ scale: 1.8 }],
    marginBottom: 10,
  },
  tagline: {
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.9,
  },
  actionContainer: {
    width: "100%", 
    paddingHorizontal: 24, 
    alignItems: "center", 
  },
  buttonSpacing: {
    marginBottom: 15,
  },
  exploreButton: {
    marginTop: 10,
  },
});

export const signinStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20, 
  },
  headerSection: {
    marginBottom: 5,
  },
  logoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  pageTitle: {
    fontFamily: "Comfortaa-Bold",
    color: "#333",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export const signupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20, 
  },
  headerSection: {
    marginBottom: 20, 
  },
  logoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  headerLogo: {
    width: 40, 
    height: 40,
  },
  pageTitle: {
    fontFamily: "Comfortaa-Bold", 
    color: "#333", 
  },
  form: {
    marginBottom: 10,
  },
  
  // MATCHING TEXTFIELD STYLE
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6E6FA', 
    paddingHorizontal: 16,
    height: 50, 
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#F0F0F8',     
  },
  dateText: {
    fontSize: 15, 
    color: '#333',
    fontFamily: 'Lato-Regular',
  },
  placeholderText: {
    color: '#999',
    fontFamily: 'Lato-Regular', 
  },
  
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#ccc", 
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F8", 
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  inlineTextContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  
  uploadSection: {
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20, 
    height: 60, 
  },
  uploadPill: {
    flex: 1, 
    height: 50, 
    paddingVertical: 8, 
    backgroundColor: "#E6E6FA", 
    borderRadius: 25, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E8E8F0",
    overflow: 'hidden',
  },
  uploadPillActive: {
    backgroundColor: "#E6F4FE", 
    borderColor: Colors.primary,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillLabel: {
    textAlign: 'center',
    flexShrink: 1,
    fontSize: 11,
  },
  uploadedThumb: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  
  actionSection: {
    marginTop: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});