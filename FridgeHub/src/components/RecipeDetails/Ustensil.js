import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../../axiosInstance";

const Ustensil = ({ ustensilId }) => {
  const [ustensilDetails, setUstensilDetails] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUstensilData = async () => {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
      if (storedToken === null) {
        console.error('Token is null');
      }
      try {
        const res = await axiosInstance.get(`/api/v1/ustensil/${ustensilId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setUstensilDetails(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ustensil data:", error);
        setLoading(false);
      }
    };
    fetchUstensilData();
  }, [ustensilId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!ustensilDetails) {
    return <Text>Ustensile non disponible</Text>;
  }

  return (
    <View style={styles.ustensilCell}>
        {ustensilDetails.image !== '' &&
            <Image
                style={styles.ustensilCellImage}
                source={{ uri: ustensilDetails.image }}
                onError={({nativeEvent: {error}}) => console.log('Failed to load ustensil image: ', error)}
            />
        }
        <Text style={styles.ustensilCellText}>{ustensilDetails.name}</Text>
    </View>
  );
};

export default Ustensil;

const styles = StyleSheet.create({
  ustensilCell: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: 120,
    width: 180,
    backgroundColor: "rgb(223,239,234)",
    borderColor: "rgba(108,214,183,1)",
    borderRadius: 16,
    borderWidth: 1,
  },
  ustensilCellImage: {
    width: 80,
    height: 80,
  },
  ustensilCellText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
